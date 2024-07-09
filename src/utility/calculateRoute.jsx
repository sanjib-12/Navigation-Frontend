export const calculateRoute = (initialLocation, finalLocation, mode, setDirections, setTravelTime) => {
    const directionsService = new window.google.maps.DirectionsService();
  
    directionsService.route(
      {
        origin: initialLocation,
        destination: finalLocation,
        travelMode: window.google.maps.TravelMode[mode], // Use the selected mode
      },
      (result, status) => {
        if (status === 'OK') {
          setDirections(result);
          const legs = result.routes[0].legs;
          const totalDuration = legs.reduce((sum, leg) => sum + leg.duration.value, 0);
          const totalDurationText = legs.reduce((text, leg) => leg.duration.text, '');
          setTravelTime(totalDurationText);
        } else {
          console.error(`Error fetching directions ${result}`);
        }
      }
    );
  };
  