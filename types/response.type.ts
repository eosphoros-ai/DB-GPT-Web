import { AxiosResponse } from 'axios';

export type ResponseType<T = any> = {
  data: T;
  err_code: string | null;
  err_msg: string | null;
  success: boolean;
};

export type ApiResponse<T = any, D = any> = AxiosResponse<ResponseType<T>, D>;

export type SuccessTuple<T = any, D = any> = [null, T, ResponseType<T>, ApiResponse<T, D>];

export type FailedTuple = [Error, null, null, null];
