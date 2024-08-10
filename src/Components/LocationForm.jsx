import React, { useRef, useEffect, useState } from 'react';
import { Form, Button, message, Select } from 'antd';
import { Autocomplete } from '@react-google-maps/api';

import currentLocationIcon from '../assets/location.png'
import { useCoordinates } from '../Hooks/useLocation';

const { Option } = Select;

const LocationForm = ({ onCalculate }) => {
  const [form] = Form.useForm();
  const initialAutocompleteRef = useRef(null);
  const finalAutocompleteRef = useRef(null);
  const initialLocationRef = useRef(null);
  const finalLocationRef = useRef(null);
  const [initialLocationValue, setInitialLocationValue] = useState('');
  const [finalLocationValue, setFinalLocationValue] = useState('');

  const userLocation = useCoordinates();

  useEffect(() => {
    if (initialLocationRef.current) {
      form.setFieldsValue({ initialLocation: initialLocationRef.current.formatted_address });
    }
  }, [initialLocationRef.current, form]);

  const handleUseCurrentLocation = async () => {
    console.log('clicked')
    if (userLocation) {
      try {
        let locationName = await getAddressFromCoordinates(userLocation.lat, userLocation.lng);
        form.setFieldsValue({ initialLocation: locationName });
        setInitialLocationValue(locationName);
        initialLocationRef.current = {
          lat: userLocation.lat,
          lng: userLocation.lng,
          formatted_address: locationName
        };
      } catch (error) {
        console.error('Error getting address:', error);
        message.error('Failed to get current location address');
      }
    }
  }

  const getAddressFromCoordinates = (lat, lng) => {
    return new Promise((resolve, reject) => {
      const geocoder = new window.google.maps.Geocoder();
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

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (initialLocationRef.current && finalLocationRef.current) {
        onCalculate(initialLocationRef.current, finalLocationRef.current, values.mode);
        console.log(initialLocationRef.current, finalLocationRef.current, values.mode);
        console.log(initialAutocompleteRef.current, finalAutocompleteRef.current)
      } else {
        message.error('Please select valid initial and final locations.');
      }
    }).catch((errorInfo) => {
      console.error('Validation failed:', errorInfo);
    });
  };

  const handleInitialPlaceChanged = () => {
    const place = initialAutocompleteRef.current.getPlace();
    if (place && place.geometry) {
      initialLocationRef.current = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        formatted_address: place.formatted_address
      };
      setInitialLocationValue(place.formatted_address);
      form.setFieldsValue({ initialLocation: place.formatted_address });
    } else {
      message.error('Please select a valid place from the suggestions.');
    }
  };

  const handleFinalPlaceChanged = () => {
    const place = finalAutocompleteRef.current.getPlace();
    if (place && place.geometry) {
      finalLocationRef.current = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        formatted_address: place.formatted_address
      };
      setFinalLocationValue(place.formatted_address);
      form.setFieldsValue({ finalLocation: place.formatted_address });
    } else {
      message.error('Please select a valid place from the suggestions.');
    }
  };

  return (
    <div style={{ padding: '10px' }}>
      <Form form={form} layout="inline">
        <Form.Item
          name="initialLocation"
          rules={[{ required: true, message: 'Please enter the initial location' }]}
        >
          <Autocomplete 
            onLoad={ref => initialAutocompleteRef.current = ref} 
            onPlaceChanged={handleInitialPlaceChanged}
          >
            <input
              value={initialLocationValue}
              onChange={(e) => setInitialLocationValue(e.target.value)}
              placeholder="Initial Location"
              style={{
                width: '200px',
                padding: '6px 5px ',
                background: 'white',
                borderRadius: '6px',
                border: 'none'
              }}
            />
          </Autocomplete>
          <img 
            src={currentLocationIcon} 
            alt="Current Location"
            onClick={handleUseCurrentLocation}
            style={{
              position: 'absolute',
              right: '5px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '20px',
              cursor: 'pointer',
              background: 'white    '
            }}
          />
        </Form.Item>

        <Form.Item
          name="finalLocation"
          rules={[{ required: true, message: 'Please enter the final location' }]}
        >
          <Autocomplete 
            onLoad={ref => finalAutocompleteRef.current = ref} 
            onPlaceChanged={handleFinalPlaceChanged}
          >
            <input
              value={finalLocationValue}
              onChange={(e) => setFinalLocationValue(e.target.value)}
              placeholder="Final Location"
              style={{
                width: '200px',
                padding: '6px 5px ',
                background: 'white',
                borderRadius: '6px',
                border: 'none'
              }}
            />
          </Autocomplete>
        </Form.Item>
        <Form.Item
          name="mode"
          rules={[{ required: true, message: 'Please select the mode of transportation' }]}
        >
          <Select placeholder="Select Mode" style={{ width: '150px' }}>
            <Option value="DRIVING">Driving</Option>
            <Option value="WALKING">Walking</Option>
            <Option value="BICYCLING">Bicycling</Option>
            <Option value="TRANSIT">Transit</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleSubmit}>
            Show Route
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LocationForm;