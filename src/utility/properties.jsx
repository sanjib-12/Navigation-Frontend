export const containerStyle = {
    width: '100vw',
    height: '100vh',
  };
  
export const center = {
    lat: 43.8118238,
    lng: -79.3463625,
  };

export const mapOptions = {
    zoomControl: true,
    zoomControlOptions: {
      position: window.google?.maps?.ControlPosition?.RIGHT_BOTTOM
    },
    mapTypeControl: false,
    mapTypeId:'roadmap',
    scaleControl: true,
    scaleControlOptions: {
      position: window.google?.maps?.ControlPosition?.RIGHT_BOTTOM
    },
    streetViewControl: true,
    streetViewControlOptions: {
      position: window.google?.maps?.ControlPosition?.RIGHT_BOTTOM
    },
    rotateControl: true,
    rotateControlOptions: {
      position: window.google?.maps?.ControlPosition?.RIGHT_TOP
    },
    fullscreenControl: false,
    fullscreenControlOptions: {
      position: window.google?.maps?.ControlPosition?.RIGHT_BOTTOM
    }
  };