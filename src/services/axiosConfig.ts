import { getToken } from "./storage";

import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

const config = {
  baseURL: "https://server.ganghannal.life/api",
  // baseURL: "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

const api: AxiosInstance = axios.create(config);

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    const token = await getToken();
    if (token) {
      config.headers!['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);


export default api;
