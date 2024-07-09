import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Modal, Button } from 'antd';
import { coordinates } from '../Hooks/useLocation';

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const currentLocation = coordinates();
  const apiKey = '5bc445aea9cd8e5586b73dcc991074cb';

  useEffect(() => {
    if (currentLocation) {
      getWeatherByCoords(currentLocation.lat, currentLocation.lng);
    }
  }, [currentLocation]);

  const getWeatherByCoords = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      setWeather(response.data);
      console.log(response.data)
      setError(null);
    } catch (err) {
      setError('Location not found');
      setWeather(null);
    }
  };



  return (
    <>
    {weather && (
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '100px',
        Index: '10px',
        padding: '4px 15px 4px 15px',
        background: 'white',
        borderRadius: '6px'
      }} >
        <p>{weather.main.temp}°C with {weather.weather[0].description}</p>
        
      </div>
    )}
  </>
  )
};

export default Weather;
