import { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { VendorRfqRes } from '../../model';
import { fetcher } from '../fetcher';

const KEY = {
  VENDOR_RFQ: 'VENDOR_RFQ',
  PM_RFQ: 'PM_RFQ',
} as const;

const request = {
  get: async (rfqId: number, signal?: AbortSignal) => {
    const { data } = await fetcher.legacyApi.get<VendorRfqRes>(`/rfqs/v2/${rfqId}`, { signal });

    return data;
  },
  getPmRfq: async (rfqId: number, signal?: AbortSignal) => {
    const { data } = await fetcher.legacyApi.get<VendorRfqRes>(`/rfqs/${rfqId}/pmRfq`, {
      signal,
    });

    return data;
  },
};

const query = {
  /**
   *
   * Gets details of the Project/Contract created by PM with
   *
   * There are 2 variants of RFQ
   * * `invite only` aka private rfq
   * * `open rfq` aka public rfq
   */
  useGet: (rfqId: number, config?: Partial<UseQueryOptions<VendorRfqRes, Error>>) =>
    useQuery({
      queryFn: ({ signal }) => request.get(rfqId, signal),
      queryKey: [KEY.VENDOR_RFQ, rfqId],
      ...config,
    }),

  useGetPmRfq: (rfqId: number, config?: Partial<UseQueryOptions<VendorRfqRes, Error>>) =>
    useQuery({
      queryFn: ({ signal }) => request.getPmRfq(rfqId, signal),
      queryKey: [KEY.PM_RFQ, rfqId],
      ...config,
    }),
};

export const rfq = {
  KEY,
  query,
  request,
};
