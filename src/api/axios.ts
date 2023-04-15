import axios from 'axios';
const BASE_URL = 'http://localhost:8080/v2';

export default axios.create({
   baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
   baseURL: BASE_URL,
   headers: {'Content-Type': 'application/json', Authorization: localStorage.getItem("jwtToken")},
   withCredentials: true
});