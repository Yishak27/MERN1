import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';

import { setAlert } from '../../../action/alert'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'


const Register = (props) => {
  const [fetchData, setFetchData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: ""
  });
  const { name, email, password, confirm } = fetchData;

  const onChange = e => setFetchData({ ...fetchData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== confirm) {
      props.setAlert('Password is not matched','danger');
    } else {
      // asign the fetch data
      const newUser = { name, email, password };
      try {
        //creating config
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
          }
        };
        const body = JSON.stringify(newUser);
        const res = await axios.post('http://localhost:5000/API/user/', body, config);
        console.log(res.data);
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  }

  return (
    <Fragment>
      <section className="container">
        <h1 className="large text-primary">Sign Up</h1>
        <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
        <form className="form" onSubmit={e => onSubmit(e)}>
          <div className="form-group">
            <input type="text" placeholder="Name" name="name"
              value={name}
              onChange={e => onChange(e)}
              required />
          </div>
          <div className="form-group">
            <input type="email"
              placeholder="Email Address"
              name="email"
              value={email}
              onChange={e => onChange(e)} />

            <small className="form-text"
            >This site uses Gravatar so if you want a profile image, use a
              Gravatar email</small
            >
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              name="password"
              minLength="6"
              value={password}
              onChange={e => onChange(e)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirm"
              minLength="6"
              value={confirm}
              onChange={e => onChange(e)}
            />
          </div>
          <input type="submit" className="btn btn-primary" value="Register" />
        </form>
        <p className="my-1">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </section>
    </Fragment>
  )
}

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
}
export default connect(null,{setAlert})(Register)
