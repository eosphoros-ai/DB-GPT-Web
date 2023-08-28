import { ApiResponse, FailedTuple, SuccessTuple } from '@/types/response.type';
import { GetChatDbSupportTypeResponse } from '@/types/schema.type';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const ins = axios.create({
  baseURL: `${process.env.API_BASE_URL}/api/v1`,
  timeout: 10000,
});

export const GET = <Params = null, Response = any, D = any>(
  url: string,
  params?: Params,
  config?: AxiosRequestConfig<D>,
) => {
  return ins.get<Params, ApiResponse<Response>>(url, { params, ...config });
};

export const POST = <Data = null, Response = any, D = any>(
  url: string,
  data?: Data,
  config?: AxiosRequestConfig<D>,
) => {
  return ins.post<Data, ApiResponse<Response>>(url, data, config);
};

export const PATCH = <Data = null, Response = any, D = any>(
  url: string,
  data?: Data,
  config?: AxiosRequestConfig<D>,
) => {
  return ins.patch<Data, ApiResponse<Response>>(url, data, config);
};

export const PUT = <Data = null, Response = any, D = any>(url: string, data?: Data, config?: AxiosRequestConfig<D>) => {
  return ins.put<Data, ApiResponse<Response>>(url, data, config);
};

export const DELETE = <Params = null, Response = any, D = any>(
  url: string,
  params?: Params,
  config?: AxiosRequestConfig<D>,
) => {
  return ins.delete<Params, ApiResponse<Response>>(url, { params, ...config });
};

export const apiInterceptors = <T = any, D = any>(
  promise: Promise<ApiResponse<T, D>>,
  ignoreCodes?: '*' | (number | string)[],
) => {
  return promise
    .then<SuccessTuple<T, D>>((response) => {
      const { data } = response;
      if (!data) {
        throw new Error('Network Error!');
      }
      if (!data.success) {
        if (ignoreCodes && ignoreCodes !== '*' && data.err_code && ignoreCodes.includes(data.err_code)) {
          throw new Error(data.err_msg ?? '');
        }
      }
      return [null, data.data, data, response];
    })
    .catch<FailedTuple>((err: Error | AxiosError) => {
      return [err, null, null, null];
    });
};

export const getChatDbSupportType = () => GET<null, GetChatDbSupportTypeResponse>('/chat/db/support/type');
export const postChatDbDelete = (dbName: string) => POST(`/chat/db/delete?db_name=${dbName}`, undefined);
