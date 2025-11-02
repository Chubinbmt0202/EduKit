// import axios from 'axios';

// // Create an axios instance
// const api = axios.create({
//     baseURL: 'https://your.api.url', // Replace with your API base URL
//     timeout: 10000, // Set a timeout for requests
// });

// // Request interceptor for adding tokens to headers
// api.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('token'); // Get token from localStorage or any other storage
//         if (token) {
//             config.headers['Authorization'] = `Bearer ${token}`; // Attach token to headers
//         }
//         return config;
//     },
//     (error) => {
//         // Handle request error
//         return Promise.reject(error);
//     }
// );

// // Response interceptor for handling errors
// api.interceptors.response.use(
//     (response) => {
//         return response; // Return response if no errors
//     },
//     (error) => {
//         // Handle response errors
//         if (error.response) {
//             // Server responded with a status other than 200 range
//             console.error('Error Response:', error.response);
//         } else if (error.request) {
//             // Request was made but no response received
//             console.error('Error Request:', error.request);
//         } else {
//             // Something else happened while setting up the request
//             console.error('Error Message:', error.message);
//         }
//         return Promise.reject(error);
//     }
// );

// export default api; // Export the axios instance