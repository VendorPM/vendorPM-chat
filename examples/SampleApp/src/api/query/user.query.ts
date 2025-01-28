import { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '../fetcher';

const KEY = {
  USER: 'USER',
} as const;

const request = {
  get: async (signal?: AbortSignal) => {
    const { data } = await fetcher.legacyApi.get<any>('/users/user', { signal });
    return data;
  },
};

const query = {
  useGet: (config?: Partial<UseQueryOptions<any, Error>>) =>
    useQuery({
      queryFn: ({ signal }) => request.get(signal),
      queryKey: [KEY.USER],
      ...config,
    }),
};

export const user = {
  KEY,
  query,
  request,
};
