import { AxiosError } from 'axios';
import { ApiResponse, FailedTuple, SuccessTuple } from '../';
import { notification } from 'antd';

/**
 * Response processing
 *
 * @param promise request
 * @param ignoreCodes ignore error codes
 * @returns
 */
export const apiInterceptors = <T = any, D = any>(promise: Promise<ApiResponse<T, D>>, ignoreCodes?: '*' | (number | string)[]) => {
  return promise
    .then<SuccessTuple<T, D>>((response) => {
      const { data } = response;
      if (!data) {
        throw new Error('Network Error!');
      }
      if (!data.success) {
        if (ignoreCodes === '*' || (data.err_code && ignoreCodes?.includes(data.err_code))) {
          return [null, data.data, data, response];
        } else {
          notification.error({
            message: `Request error`,
            description: data?.err_msg ?? '',
          });
          throw new Error(data.err_msg ?? '');
        }
      }
      return [null, data.data, data, response];
    })
    .catch<FailedTuple>((err: Error | AxiosError) => {
      return [err, null, null, null];
    });
};
