import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice';

const store = configureStore({
  reducer: {
    authorize: authReducer,
  },
});
export default store;
