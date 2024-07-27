export const calculateRoute = (initialLocation, finalLocation, mode, setDirections, setTravelTime, setTravelDistance) => {
  const directionsService = new window.google.maps.DirectionsService();

  console.log(`this is from the calculate route: ${initialLocation, finalLocation}`);
  console.log(initialLocation);
  console.log(finalLocation);

  directionsService.route(
    {
      origin: initialLocation,
      destination: finalLocation,
      travelMode: window.google.maps.TravelMode[mode], // Use the selected mode
    },
    (result, status) => {
      if (status === 'OK') {
        setDirections(result);
        const leg = result.routes[0].legs[0];
        
        // Set travel time and distance from the first leg
        setTravelTime(leg.duration.text);
        setTravelDistance(leg.distance.text);
      } else {
        console.error(`Error fetching directions ${result}`);
      }
    }
  );
};
