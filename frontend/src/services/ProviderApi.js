import axios from "axios";

const ProviderApi = axios.create({
  baseURL: "http://localhost:5000/api", // backend ka base URL with /api
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token ko automatically har request me add karna
ProviderApi.interceptors.request.use((req) => {
  const token = localStorage.getItem("token"); // ya "providerToken"
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Error handling
ProviderApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default ProviderApi;
