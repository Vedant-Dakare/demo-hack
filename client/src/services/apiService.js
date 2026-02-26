import axios from "axios";

const API = axios.create({
  // Point to Node server (not Flask). Keep Flask on 5000.
  baseURL: "http://127.0.0.1:4000/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;
