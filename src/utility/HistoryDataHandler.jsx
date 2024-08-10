
// Data sending to the server
export const sendHistoryData = async (directions, travelTime, travelDistance) => {
    console.log(directions)
    // Get user ID from localStorage
    const userData = localStorage.getItem('user_data');
    let userId = '';
    
    if (userData) {
      try {
        const userInfo = JSON.parse(userData);
        userId = userInfo.user._id;
      } catch (error) {
        console.error('Error parsing user data:', error);
        throw new Error('Invalid user data');
      }
    } else {
      throw new Error('User data not found');
    }
  
    const sendingData = {
      userId: userId,
      startLocation: {
        lat: directions.initialLocation.lat,
        lng: directions.initialLocation.lng,
      },
      endLocation: {
        lat: directions.finalLocation.lat,
        lng: directions.finalLocation.lng
      },
      travelTime: travelTime,
      travelDistance: travelDistance
    };
  
    console.log('Sending data:', sendingData);
  
    try {
      const response = await fetch('http://localhost:3000/api/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sendingData)
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Data sent successfully:', data);
      return data;
    } catch (error) {
      console.error('Error sending data:', error);
      throw error;
    }
  };


// Data reterival from the server

export const getHistoryData = async () => {
  
  // Get user ID from localStorage
  const userData = localStorage.getItem('user_data');
  let userId = '';
  
  if (userData) {
    try {
      const userInfo = JSON.parse(userData);
      userId = userInfo.user._id;
    } catch (error) {
      console.error('Error parsing user data:', error);
      throw new Error('Invalid user data');
    }
  } else {
    throw new Error('User data not found');
  }

  
  try {
    const response = await fetch(`http://localhost:3000/api/history/${userId}`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let data = await response.json();

     // Convert coordinates to addresses
     data = await Promise.all(data.map(async (item) => {
      const startAddress = await getAddressFromCoordinates(item.startLocation.lat, item.startLocation.lng);
      const endAddress = await getAddressFromCoordinates(item.endLocation.lat, item.endLocation.lng);
      return {
        ...item,
        startAddress,
        endAddress
      };
    }));

    console.log('Data retrieve successfully:', data);
    return data;
  } catch (error) {
    console.error('Error sending data:', error);
    throw error;
  }
};
  

const getAddressFromCoordinates = (lat, lng) => {
  return new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat: parseFloat(lat), lng: parseFloat(lng) };
    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          resolve(results[0].formatted_address);
        } else {
          reject("No results found");
        }
      } else {
        reject("Geocoder failed due to: " + status);
      }
    });
  });
};


// {
//     "userId": "668da7d4a89487b67a3e76ff",
//     "startLocation": {
//       "lat": 37.7749,
//       "lng": -122.4194
//     },
//     "endLocation": {
//       "lat": 34.0522,
//       "lng": -118.2437
//     },
//     "travelTime": "5 hours",
//     "travelDistance": "383 miles"
//   }





