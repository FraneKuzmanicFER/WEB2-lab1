import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://web2-lab1-1.onrender.com',
    timeout: 1000,
    headers: { 'Content-Type': 'application/json' },
});
  
export default axiosInstance;