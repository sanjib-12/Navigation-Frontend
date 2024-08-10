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
  const [isBlinking, setIsBlinking] = useState(false);
  const mapRef = useRef(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const watchIdRef = useRef(null);
  const [isDrivingMode, setIsDrivingMode] = useState(false);

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

  useEffect(() => {
    let intervalId;
    if (isTracking) {
      intervalId = setInterval(() => {
        setIsBlinking(prev => !prev);
      }, 500); // Blink every 500ms
    } else {
      setIsBlinking(false);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isTracking]);

  const handleCalculateRoute = useCallback((initialLocation, finalLocation, mode) => {
    locationInfo.current = { finalLocation, initialLocation };
    if (directionsRenderer) {
      directionsRenderer.setMap(null);
    }
    setDirections(null);
    calculateRoute(initialLocation, finalLocation, mode, setDirections, setTravelTime, setTravelDistance);
    setShowCard(true);
    setIsTracking(false);
    setIsDrivingMode(mode === 'DRIVING');
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

  const handleUberClick = () => {
    const uberWebLink = `https://www.uber.com/ca/en/`;
    window.open(uberWebLink, '_blank');
  };
  
  const handleLyftClick = () => {
    const lyftWebLink = `https://www.lyft.com/`;
    window.open(lyftWebLink, '_blank');
  };

  const handleStartTracking = () => {
    sendHistoryData(locationInfo.current, travelTime, travelDistance);
    setIsTracking(true);
    if ("geolocation" in navigator) {
      const options = {
        enableHighAccuracy: true,
        timeout: 25000, // Increased timeout to 10 seconds
        maximumAge: 0
      };
  
      const watchPosition = () => {
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
            if (error.code === error.TIMEOUT) {
             // message.warning("Location update timed out. Retrying...");
              // Clear the current watch and try again
              navigator.geolocation.clearWatch(watchIdRef.current);
              watchPosition();
            } else {
              //message.error("Unable to track location continuously. Using last known position.");
              setIsTracking(false);
            }
          },
          options
        );
      };
  
      // Start watching position
      watchPosition();
  
      // Fallback: If we don't get a location update within 15 seconds, use the last known position
      setTimeout(() => {
        if (!currentPosition) {
          //message.warning("Unable to get current location. Using last known position.");
          setCurrentPosition(mapCenter);
          if (mapRef.current) {
            mapRef.current.panTo(mapCenter);
          }
        }
      }, 15000);
  
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

          {/* <MarkerF 
            position={currentPosition || mapCenter}
            icon={markerIcon}
            animation={isTracking ? window.google.maps.Animation.BOUNCE : null}
          /> */}
          
          {!isTracking && <MarkerF 
              position={mapCenter} 
              label={{
                text: "ME",
                color: "Black",
                fontSize: "14px",
                fontWeight: "bold",
              }} 
            />
          }
          {isTracking && currentPosition && (
            <MarkerF 
              position={currentPosition}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 12,
                fillColor: isBlinking ? 'blue' : 'green',
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: 'white',
              }}
            />
          )}

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
              {isDrivingMode && (
                <div style={{ marginTop: '10px' }}>
                  <Button onClick={handleUberClick} style={{ marginRight: '10px' }}>
                     Uber
                  </Button>
                  <Button onClick={handleLyftClick}>
                    Lyft
                  </Button>
                </div>
              )}
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