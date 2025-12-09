import { useEffect } from 'react';
import api from './axios';
import { useAuth } from '../context/AuthContext';

const useAxiosAuth = () => {
  const { accessToken, refreshAccessToken } = useAuth();

  useEffect(() => {
    const requestIntercept = api.interceptors.request.use(
      config => {
        if (accessToken && !config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    const responseIntercept = api.interceptors.response.use(
      response => response,
      async error => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest._retry) {
          prevRequest._retry = true;
          const newToken = await refreshAccessToken();
          prevRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return api(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestIntercept);
      api.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken, refreshAccessToken]);

  return api;
};

export default useAxiosAuth;
