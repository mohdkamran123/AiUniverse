import React from 'react';
import { Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AiToolRunner from './pages/AiToolRunner';
import AdminDashboard from './pages/AdminDashboard';



const App = () => {
  return (
    
      <Routes>
       
        <Route path="/home" element={<Home />} /> 
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/run-ai" element={<AiToolRunner />} />
        <Route path='/admin-dashboard' element={<AdminDashboard/>}/>
         {/* <Route path="/" element={<Landing />} /> */}
      </Routes>
  );
};

export default App;
