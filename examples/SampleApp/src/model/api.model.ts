import { AxiosError } from 'axios';

export type ApiError = AxiosError<{
  message: string;
}>;

export type ApiRequest<T> = {
  // What will be sent as part of the Request json
  payload: T;
};
