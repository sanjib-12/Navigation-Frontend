import { useState, useEffect } from 'react';

export const useCoordinates = () => {
    const [currentLocation, setCurrentLocation] = useState(null);

    useEffect(() => {
        const successCallback = (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation({ lat: latitude, lng: longitude });
        };

        const errorCallback = (error) => {
            console.error("Error getting location:", error);
        };

        const options = {
            enableHighAccuracy: true,
            timeout: 25000,
            maximumAge: 0
        };

        const watchId = navigator.geolocation.watchPosition(
            successCallback,
            errorCallback,
            options
        );

        // Cleanup function to stop watching the position when the component unmounts
        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, []);

    return currentLocation;
};