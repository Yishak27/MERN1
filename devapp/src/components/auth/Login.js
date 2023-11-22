import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Alert from '../Alert';
import { useSnackbar } from 'notistack';

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  var data = {
    email: '',
    password: '',
  };
  const [fetchData, setFetchData] = useState(data);
  const { email, password } = fetchData;

  const onChange = (e) => {
    setFetchData({ ...fetchData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const newUser = { email, password };
    try {
      //creating config
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST',
        },
      };
      const body = JSON.stringify(newUser);
      const res = await axios.post(
        'http://localhost:5000/API/auth/',
        body,
        config
      );
      if (res.data.errors) {
        enqueueSnackbar('Unable to login', {variant:'error'});
      } else {
        enqueueSnackbar('Login Successfully', {variant:'success'});
        
      }
    } catch (err) {
      enqueueSnackbar('Unable to loign', {variant:'warning'});
     
    }
  };

  return (
    <div>
      <section className='container'>
        <h1 className='large text-primary'>Login</h1>
        <p className='lead'>
          <i className='fas fa-user'></i> Sign into Your Account
        </p>
        <form className='form' onSubmit={(e) => onSubmit(e)}>
          <div className='form-group'>
            <input
              type='email'
              placeholder='Email Address'
              name='email'
              required
              value={email}
              onChange={(e) => onChange(e)}
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              placeholder='Password'
              name='password'
              value={password}
              onChange={(e) => onChange(e)}
            />
          </div>
          <input type='submit' className='btn btn-primary' value='Login' />
        </form>
        <p className='my-1'>
          Don't have an account? <Link to='/register'>Sign Up</Link>
        </p>
      </section>
    </div>
  );
};

export default Login;
