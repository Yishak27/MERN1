import axios from 'axios';
import { REGISTER_FAIL, REGISTER_SUCCESS } from './constant';

export const register = async ({ name, email, password }) => {
  const config = {
    header: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    },
  };
  const body = { name, email, password };
  try {
    const res = await axios.post(
      'http://localhost:5000/API/user/',
      body,
      config
    );
    return res.data;
  } catch (err) {
    return null;
  }
};
