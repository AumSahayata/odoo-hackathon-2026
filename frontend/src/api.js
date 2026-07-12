import axios from "axios";

const getBaseURL = () => {
  const url = import.meta.env.VITE_API_URL;
  const port = import.meta.env.VITE_API_PORT;

  if (url && port && !url.match(/:\d+$/)) {
    return `${url}:${port}/api`;
  }
  if (url) {
    return url.endsWith("/api") ? url : `${url}/api`;
  }
  return "http://localhost:8001/api";
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiCall = async (
  endpoint,
  method = "GET",
  payload = null,
  customHeaders = {},
) => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      ...customHeaders,
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config = {
      url: endpoint,
      method: method.toUpperCase(),
      headers,
    };

    if (payload) {
      if (config.method === "GET") {
        config.params = payload;
      } else {
        config.data = payload;
      }
    }

    const response = await api(config);
    return response.data;
  } catch (error) {
    let message = "Connection error. Please check your network and try again.";
    const data = error.response?.data;
    if (data) {
      if (typeof data.detail === "string") {
        message = data.detail;
      } else if (Array.isArray(data.detail)) {
        message = data.detail.map((d) => d.msg || "Validation error").join(", ");
      } else if (typeof data.message === "string") {
        message = data.message;
      }
    }
    throw new Error(message, { cause: error });
  }
};

export default apiCall;
