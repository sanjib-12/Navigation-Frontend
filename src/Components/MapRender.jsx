import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, DirectionsRenderer} from '@react-google-maps/api';

import { containerStyle, center, mapOptions } from '../utility/properties'; 
import { calculateRoute } from '../utility/calculateRoute';
import {coordinates} from '../Hooks/useLocation'
import LocationForm from './LocationForm';

import { Card } from 'antd';

const libraries = ['places', 'geometry', 'marker'];

const MapRender = () => {

  // this gets the current location of the user.  
  const userLocation = coordinates();
  const mapCenter = userLocation || center;


  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_MAP_API_KEY,
    libraries,
  });

  const [directions, setDirections] = useState(null);
  const [travelTime, setTravelTime] = useState(null);
  const mapRef = useRef(null);

  const handleCalculateRoute = (initialLocation, finalLocation, mode) => {
    calculateRoute(initialLocation, finalLocation, mode, setDirections, setTravelTime);
  }


  return (
    <>
    
      {isLoaded ? (

        <GoogleMap 
            mapContainerStyle={containerStyle} 
            center={mapCenter} 
            zoom={14}  
            options={mapOptions}
            onLoad={(map) => (mapRef.current = map)}
        >
            <LocationForm onCalculate={handleCalculateRoute}/>
            {directions && <DirectionsRenderer directions={directions} />}
            <MarkerF position={mapCenter}/>

            {travelTime && (
        <Card style={{ position: 'absolute', top: 60, left: 20, zIndex: 1 }}>
          <p>Estimated Travel Time: {travelTime}</p>
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
