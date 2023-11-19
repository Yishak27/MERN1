import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Alert from '../Alert';
import { useDispatch } from 'react-redux';
import { setAlert } from '../../../action/alert';

const Login = () => {
  var data = {
    email: '',
    password: '',
  };
  const [fetchData, setFetchData] = useState(data);
  const { email, password } = fetchData;

  const onChange = (e) =>{
    setFetchData({ ...fetchData, [e.target.name] : e.target.value });
}

// redux
const dispatch = useDispatch();

  const onSubmit = async (e) => {
    e.preventDefault();
    // asign the fetch data
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
        dispatch(setAlert(res.data.errors[0].msg, 'danger'));
      } else {
        dispatch(setAlert('Registed Successfully', 'success'));
        console.log(res.data);
      }
    } catch (err) {
      dispatch(setAlert('Registed not done', 'danger'));
      console.log(err);
      throw err;
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
