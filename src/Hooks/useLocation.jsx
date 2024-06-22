import { useState, useEffect } from 'react';


export const coordinates = () =>{

    const [currentLocation, setCurrentLocation] = useState(null);

    useEffect(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => console.error(error)
      );
    }, []);

    return currentLocation;

}
