import axios from 'axios';

export default axios.create({
   baseURL: 'http://localhost:8080/v2'
});

export const axiosPrivate = axios.create({
   baseURL: BASE_URL,
   headers: {'Content-Type': 'application/json', Authorization: localStorage.getItem("jwtToken")},
   withCredentials: true
});