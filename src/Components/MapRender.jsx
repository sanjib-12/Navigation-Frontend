import { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, DirectionsRenderer } from '@react-google-maps/api';
import { containerStyle, center, mapOptions } from '../utility/properties'; 
import { calculateRoute } from '../utility/calculateRoute';
import { useCoordinates } from '../Hooks/useLocation';
import LocationForm from './LocationForm';
import { sendHistoryData } from '../utility/HistoryDataHandler';

import { Card, Button, Typography, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const { Title } = Typography;

const libraries = ['places', 'geometry', 'marker'];

const MapRender = () => {
  const userLocation = useCoordinates();
  const mapCenter = userLocation || center;

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_MAP_API_KEY,
    libraries,
  });

  const [directions, setDirections] = useState(null);
  const [travelTime, setTravelTime] = useState(null);
  const [travelDistance, setTravelDistance] = useState(null);
  const [showCard, setShowCard] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const mapRef = useRef(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const watchIdRef = useRef(null);

  const locationInfo = useRef({
    finalLocation: { lat: 0, lng: 0 },
    initialLocation: { lat: 0, lng: 0 },
  });

  useEffect(() => {
    if (isLoaded) {
      const renderer = new window.google.maps.DirectionsRenderer();
      setDirectionsRenderer(renderer);
    }
  }, [isLoaded]);

  useEffect(() => {
    if (directionsRenderer) {
      directionsRenderer.setMap(directions ? mapRef.current : null);
      directionsRenderer.setDirections(directions);
    }
  }, [directions, directionsRenderer]);

  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const handleCalculateRoute = useCallback((initialLocation, finalLocation, mode) => {
    locationInfo.current = { finalLocation, initialLocation };
    if (directionsRenderer) {
      directionsRenderer.setMap(null);
    }
    setDirections(null);
    calculateRoute(initialLocation, finalLocation, mode, setDirections, setTravelTime, setTravelDistance);
    setShowCard(true);
    setIsTracking(false);
  }, [directionsRenderer]);

  const handleCloseCard = () => {
    setShowCard(false);
    setDirections(null);
    setTravelTime(null);
    setTravelDistance(null);
    setIsTracking(false);
    if (directionsRenderer) {
      directionsRenderer.setMap(null);
    }
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
  };

  const handleStartTracking = () => {
    //sendHistoryData(locationInfo.current, travelTime, travelDistance);
    setIsTracking(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentPosition(newPosition);
          if (mapRef.current) {
            mapRef.current.panTo(newPosition);
          }
          watchIdRef.current = navigator.geolocation.watchPosition(
            (position) => {
              const newPosition = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              setCurrentPosition(newPosition);
              if (mapRef.current) {
                mapRef.current.panTo(newPosition);
              }
            },
            (error) => {
              console.error("Error in tracking location: ", error);
              message.error("Unable to track location continuously. Using last known position.");
            },
            {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0,
            }
          );
        },
        (error) => {
          console.error("Error getting initial location: ", error);
          let errorMessage = "Unable to get location. ";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += "Location permission denied.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Location information unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage += "Location request timed out.";
              break;
            default:
              errorMessage += "An unknown error occurred.";
          }
          message.error(errorMessage);
          setIsTracking(false);
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    } else {
      message.error("Geolocation is not supported by this browser.");
      setIsTracking(false);
    }
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  return (
    <>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={currentPosition || mapCenter}
          zoom={14}
          options={mapOptions}
          onLoad={(map) => (mapRef.current = map)}
        >
          <LocationForm onCalculate={handleCalculateRoute} />
          
          {!isTracking && <MarkerF position={mapCenter} />}
          {isTracking && currentPosition && <MarkerF position={currentPosition} />}

          {showCard && travelTime && (
            <Card
              style={{ position: 'absolute', top: 60, left: 20, zIndex: 1, width: 300 }}
              extra={
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  onClick={handleCloseCard}
                  style={{ border: 'none', padding: 0 }}
                />
              }
            >
              <Title level={4}>Travel Information</Title>
              <p>Estimated Travel Time: {travelTime}</p>
              <p>Estimated Travel Distance: {travelDistance}</p>
              <Button
                type="primary"
                onClick={handleStartTracking}
                disabled={isTracking}
              >
                {isTracking ? 'Tracking...' : 'Start'}
              </Button>
            </Card>
          )}
        </GoogleMap>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default MapRender;
