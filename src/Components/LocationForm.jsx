import React, { useRef } from 'react';
import { Form, Button, message, Select } from 'antd';
import { Autocomplete } from '@react-google-maps/api';

const { Option } = Select;

const LocationForm = ({ onCalculate }) => {
  const [form] = Form.useForm();
  const initialAutocompleteRef = useRef(null);
  const finalAutocompleteRef = useRef(null);
  const initialLocationRef = useRef(null);
  const finalLocationRef = useRef(null);



  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (initialLocationRef.current && finalLocationRef.current) {
        onCalculate(initialLocationRef.current, finalLocationRef.current, values.mode);
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
    if (place.geometry) {
      initialLocationRef.current = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };
      form.setFieldsValue({ initialLocation: place.formatted_address });
    } else {
      message.error('Please select a valid place from the suggestions.');
    }
  };

  const handleFinalPlaceChanged = () => {
    const place = finalAutocompleteRef.current.getPlace();
    if (place.geometry) {
      finalLocationRef.current = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };
      form.setFieldsValue({ finalLocation: place.formatted_address });
    } else {
      message.error('Please select a valid place from the suggestions.');
    }
    console.log('this is from place')
    console.log(place.formatted_address)
    console.log(place)
    console.log('this is from place')
  };

  return (
    <div style={{ padding: '10px' }}>
      <Form form={form} layout="inline">
        <Form.Item
          
          name="initialLocation"
          rules={[{ required: true, message: 'Please enter the initial location' }]}
        >
          <Autocomplete onLoad={ref => initialAutocompleteRef.current = ref} onPlaceChanged={handleInitialPlaceChanged}>
            <input
              placeholder="Initial Location"
              style={{ width: '200px',
                padding: '6px 5px ',
                background: 'white',
                borderRadius: '6px',
                border: 'none'
              }}
            />
          </Autocomplete>
        </Form.Item>
        <Form.Item
          name="finalLocation"
          rules={[{ required: true, message: 'Please enter the final location' }]}
        >
          <Autocomplete onLoad={ref => finalAutocompleteRef.current = ref} onPlaceChanged={handleFinalPlaceChanged}>
            <input
              placeholder="Final Location"
              style={{ width: '200px',
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
