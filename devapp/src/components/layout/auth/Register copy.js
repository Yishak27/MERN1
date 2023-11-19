import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'

import { setAlert } from '../../../action/alert'
import { register } from '../../../action/auth'

import { connect } from 'react-redux'
import PropTypes from 'prop-types'


const Register = ({ setAlert, register }) => {
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
      setAlert('Password is not matched', 'danger');
    } else {
       register({ name, email, password });
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
            />
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
              value={password}
              onChange={e => onChange(e)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirm"
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
  register: PropTypes.func.isRequired
}
export default connect(null, { setAlert, register })(Register)