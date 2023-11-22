import React, { Fragment } from 'react';
import { Routes, Route, Router } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

import { Provider } from 'react-redux';

import store from './store';
import { SnackbarProvider } from 'notistack';

function App() {
  return (
    <Provider store={store}>
      <SnackbarProvider autoHideDuration={3000}>
        <Navbar />
        <section>
          <Routes>
            <Route path='/' element={<Landing />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Routes>
        </section>
      </SnackbarProvider>
    </Provider>
  );
}

export default App;
