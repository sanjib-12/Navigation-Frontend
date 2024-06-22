import { GoogleMap, useJsApiLoader, MarkerF} from '@react-google-maps/api';
import { containerStyle, center, mapOptions } from '../properties/properties'; 
import {coordinates} from '../Hooks/useLocation'

const MapRender = () => {

  // this gets the current location of the user.  
  const loc = coordinates();


  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_MAP_API_KEY,
  });


  return (
    <>
      {isLoaded ? (

        <GoogleMap 
            mapContainerStyle={containerStyle} 
            center={loc} 
            zoom={14}  
            options={mapOptions}
        >

          <MarkerF position={loc}/>

        </GoogleMap>

      ) : (
        <div>Loading...</div>
      )}
     
    </>
  );
};

export default MapRender;
