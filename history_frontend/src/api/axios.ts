import axios from 'axios';

const instance = axios.create({});

// instance.interceptors.response.use(response => response, async (error) => {
//     const originalRequest = error.config;
//     if (error.response.status === 403 && !originalRequest._retry) {
//         originalRequest._retry = true;

//     }
// });

export default instance;
