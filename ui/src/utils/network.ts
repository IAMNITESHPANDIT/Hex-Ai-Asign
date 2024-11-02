import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ROUTE_NAME } from './constant';

const baseUrl = process.env.REACT_APP_BASE_AUTH; 
let accessToken: string | null = null; 

// Function to set the access token
export const setAccessToken = (token: string) => {
  accessToken = token;
};

// Function to refresh the token
const refreshToken = async () => {
//   try {
//     const response = await axios.post(`${baseUrl}/auth/refresh`, {
//       token: accessToken,
//     });
//     accessToken = response.data.accessToken;
//   } catch (error) {
//     console.error('Token refresh failed:', error);
//     throw error;
//   }
localStorage.clear();
window.location.href =ROUTE_NAME.LOGIN
};

// Create default configuration for Axios
const getDefaultConfig = (token: string | null): AxiosRequestConfig => ({
  headers: {
    Authorization: token ? `Bearer ${token}` : undefined,
  },
});

// Generic function for making requests
const request = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  data: any = null,
  token: string | null = null 
): Promise<AxiosResponse<T>> => {
  try {
    const config = getDefaultConfig(token || accessToken);

    const response = await axios({
      method,
      url: `${baseUrl}${endpoint}`,
      data,
      ...config,
    });

    return response;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      await refreshToken();
      return request<T>(method, endpoint, data, token);
    }
    throw error;
  }
};

export const get = async <T>(
  endpoint: string,
  token?: string // Optional token
): Promise<AxiosResponse<T>> => {
  return request<T>('GET', endpoint, null, token);
};

export const post = async <T>(
  endpoint: string,
  data: any,
  token?: string // Optional token
): Promise<AxiosResponse<T>> => {
  return request<T>('POST', endpoint, data, token);
};

export const put = async <T>(
  endpoint: string,
  data: any,
  token?: string // Optional token
): Promise<AxiosResponse<T>> => {
  return request<T>('PUT', endpoint, data, token);
};

export const del = async <T>(
  endpoint: string,
  token?: string // Optional token
): Promise<AxiosResponse<T>> => {
  return request<T>('DELETE', endpoint, null, token);
};

export const recordActivity = async (id: string,msg:string, access_token:string) => {
    try {
      await post(
        "/api/v1/user/profile",
        {
          "userId": id ,
          "activity": msg
        },
        access_token
      );
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };
