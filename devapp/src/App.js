import React, { Fragment } from 'react';
import { Routes, Route, Router } from 'react-router-dom'
import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/layout/auth/Login';
import Register from './components/layout/auth/Register';

import Alert from './components/layout/Alert.js';

import { Provider } from 'react-redux'

import store from './store';

function App() {
  return (
    <Provider store={store}>
      <Navbar />
      <Alert></Alert>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /></Routes>
    </Provider>
  );
}

export default App;
