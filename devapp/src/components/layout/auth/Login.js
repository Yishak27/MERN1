import React,{useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';

const Login = () => {
  
  const [fetchData, setFetchData] = useState({
    email: "",
    password: ""
  });
  const { email, password } = fetchData;

  const onChange = e => setFetchData({ ...fetchData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    // asign the fetch data
    const newUser = { email, password };
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
      const res = await axios.get('http://localhost:5000/API/user/', body, config);
      console.log(res.data);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  return (
    <div>
      <section className="container">
      <div className="alert alert-danger">
        Invalid credentials
      </div>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead"><i className="fas fa-user"></i> Sign into Your Account</p>
        <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            required
            value={email}
            onChange={e=>onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={e=>onChange(e)}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </section>
    </div>
  )
}

export default Login
