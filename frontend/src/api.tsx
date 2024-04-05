// This is a convenience file that creates an Axios instance with the API URL from configuration.
// You can use it by simply doing the following:
//
// import api from 'api' // or wherever you put this file
// 
// api.get(...)
// api.post(...)
//
// ...and so on

import Axios from 'axios';

import { API_URL } from './config';

export default Axios.create({
  baseURL: API_URL
});