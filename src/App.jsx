import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css'
import Register from './Auth/Register';
import Login from './Auth/Login';
import Dashboard from './Pages/Dashboard';

const App = () =>{
  return <Router>
    <Routes>

      <Route path = '/' element={<Register/>} /> 
      <Route path = '/login' element={<Login/>} /> 
      <Route path = '/dashboard' element={<Dashboard/>} /> 

    </Routes>
    
  </Router>
}
export default App;
