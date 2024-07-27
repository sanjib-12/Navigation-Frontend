import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Modal, Button, Spin } from 'antd';
import { useCoordinates } from '../Hooks/useLocation';

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const currentLocation = useCoordinates();
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    if (currentLocation) {
      getWeatherByCoords(currentLocation.lat, currentLocation.lng);
    }
  }, [currentLocation]);

  const getWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      setWeather(response.data);
      setError(null);
    } catch (err) {
      setError('Location not found');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const showWeatherCard = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      {loading ? (
        <Spin tip="Loading..." style={{ position: 'absolute', top: '17px', right: '130px', zIndex: '10' }} />
      ) : (
        weather && (
          <>
            <Button
              style={{
                position: 'absolute',
                top: '10px',
                right: '120px',
                zIndex: '10',
              }}
              onClick={showWeatherCard}
            >
              {weather.main.temp}°C with {weather.weather[0].description}
            </Button>

            <Modal
              title="Weather Details"
              open={isModalVisible}
              onCancel={handleCancel}
              footer={null}
            >
              <Card>
                <p>Weather: {weather.weather[0].description}</p>
                <p>Temperature: {weather.main.temp}°C</p>
                <p>Feels Like: {weather.main.feels_like}°C</p>
                <p>Max Temperature: {weather.main.temp_max}°C</p>
                <p>Min Temperature: {weather.main.temp_min}°C</p>
                <p>Humidity: {weather.main.humidity}%</p>
                <p>Pressure: {weather.main.pressure} hPa</p>
                <p>Wind Speed: {weather.wind.speed} m/s</p>
              </Card>
            </Modal>
          </>
        )
      )}
    </>
  );
};

export default Weather;
