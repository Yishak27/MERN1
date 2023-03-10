import axios from 'axios'
import { REGISTER_FAIL, REGISTER_SUCCESS } from './constant'
import { setAlert } from './alert'

export const register = ({name, email, password}) => async dispach => {
    const config = {
        header: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
        }
    }
    const body = JSON.stringify({ name, email, password })
    try {
        const res = await axios.post('http://localhost:5000/API/user/', body, config);
        dispach({
            type: REGISTER_SUCCESS,
            payload: res 
        })
    } catch (err) {
        const errors = err.response.data.errors;
        alert(JSON.stringify(errors));
        if(errors){
            errors.forEach(error => dispach(setAlert(error.msg, 'danger')));
        }
       
    }
}