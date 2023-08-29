import axios, { AxiosRequestConfig } from 'axios';
import { ApiResponse } from './types/request.type';

const ins = axios.create({
  baseURL: `${process.env.API_BASE_URL}/api/v1`,
  timeout: 10000,
});

export const GET = <Params = any, Response = any, D = any>(url: string, params?: Params, config?: AxiosRequestConfig<D>) => {
  return ins.get<Params, ApiResponse<Response>>(url, { params, ...config });
};

export const POST = <Data = any, Response = any, D = any>(url: string, data?: Data, config?: AxiosRequestConfig<D>) => {
  return ins.post<Data, ApiResponse<Response>>(url, data, config);
};

export const PATCH = <Data = any, Response = any, D = any>(url: string, data?: Data, config?: AxiosRequestConfig<D>) => {
  return ins.patch<Data, ApiResponse<Response>>(url, data, config);
};

export const PUT = <Data = any, Response = any, D = any>(url: string, data?: Data, config?: AxiosRequestConfig<D>) => {
  return ins.put<Data, ApiResponse<Response>>(url, data, config);
};

export const DELETE = <Params = any, Response = any, D = any>(url: string, params?: Params, config?: AxiosRequestConfig<D>) => {
  return ins.delete<Params, ApiResponse<Response>>(url, { params, ...config });
};

export * from './tools';
export * from './request';
export * from './types/request.type';
export * from './types/schema.type';
