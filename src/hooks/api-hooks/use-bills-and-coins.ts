import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'

import { toBase64, withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import { createMutationHook } from './api-hook-factory'
import * as BillsAndCoinService from '@/api-service/bills-and-coins-service'

import {
    TEntityId,
    IQueryProps,
    IBillsAndCoin,
    IBillsAndCoinRequest,
    IBillsAndCoinPaginated,
    IAPIFilteredPaginatedHook,
    IAPIHook,
} from '@/types'

export const useCreateBillsAndCoin = createMutationHook<
    IBillsAndCoin,
    string,
    IBillsAndCoinRequest
>(
    (data) => BillsAndCoinService.createBillsCoin(data),
    'New Member Type Created'
)

export const useUpdateBillsAndCoin = createMutationHook<
    IBillsAndCoin,
    string,
    { id: TEntityId; data: IBillsAndCoinRequest }
>(
    ({ id, data }) => BillsAndCoinService.updateBillsCoin(id, data),
    'Member Type updated'
)

export const useDeleteBillsAndCoins = createMutationHook<
    void,
    string,
    TEntityId
>((id) => BillsAndCoinService.deleteBillsAndCoin(id), 'Bills and coins deleted')

export const useDeleteManyBillsAndCoins = createMutationHook<
    void,
    string,
    TEntityId[]
>(
    (ids) => BillsAndCoinService.deleteManyBillsAndCoin(ids),
    'Bills and coins deleted'
)

export const useBillsAndCoins = ({
    enabled,
    showMessage = true,
}: IAPIHook<IBillsAndCoin[], string> & IQueryProps = {}) => {
    return useQuery<IBillsAndCoin[], string>({
        queryKey: [' bills-and-coin', 'all'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                BillsAndCoinService.getAllBillsCoins()
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        initialData: [
            // {
            //     id: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
            //     organization_id: '11111111-2222-3333-4444-555555555555',
            //     organization: {
            //         id: '11111111-2222-3333-4444-555555555555',
            //         name: 'Sample Organization',
            //     },
            //     branch_id: '22222222-3333-4444-5555-666666666666',
            //     branch: {
            //         id: '22222222-3333-4444-5555-666666666666',
            //         name: 'Main Branch',
            //     },
            //     created_by_id: '33333333-4444-5555-6666-777777777777',
            //     updated_by_id: '33333333-4444-5555-6666-777777777777',
            //     deleted_by_id: null,
            //     media_id: '44444444-5555-6666-7777-888888888888',
            //     media: {
            //         id: '44444444-5555-6666-7777-888888888888',
            //         download_url: 'https://example.com/image1.png',
            //     },
            //     name: '100 Peso Bill',
            //     value: 100,
            //     country_code: 'PH',
            //     created_at: '2024-05-01T10:00:00Z',
            //     updated_at: '2024-05-10T12:00:00Z',
            //     deleted_at: null,
            // },
            // {
            //     id: 'b2c3d4e5-f678-9012-3456-789abcdef012',
            //     organization_id: '11111111-2222-3333-4444-555555555555',
            //     organization: {
            //         id: '11111111-2222-3333-4444-555555555555',
            //         name: 'Sample Organization',
            //     },
            //     branch_id: '22222222-3333-4444-5555-666666666666',
            //     branch: {
            //         id: '22222222-3333-4444-5555-666666666666',
            //         name: 'Main Branch',
            //     },
            //     created_by_id: '33333333-4444-5555-6666-777777777777',
            //     updated_by_id: '33333333-4444-5555-6666-777777777777',
            //     deleted_by_id: null,
            //     media_id: '55555555-6666-7777-8888-999999999999',
            //     media: {
            //         id: '55555555-6666-7777-8888-999999999999',
            //         download_url: 'https://example.com/image2.png',
            //     },
            //     name: '20 Peso Coin',
            //     value: 20,
            //     country_code: 'PH',
            //     created_at: '2024-05-02T11:00:00Z',
            //     updated_at: '2024-05-11T13:00:00Z',
            //     deleted_at: null,
            // },
            // {
            //     id: 'c3d4e5f6-7890-1234-5678-9abcdef01234',
            //     organization_id: '11111111-2222-3333-4444-555555555555',
            //     organization: {
            //         id: '11111111-2222-3333-4444-555555555555',
            //         name: 'Sample Organization',
            //     },
            //     branch_id: '22222222-3333-4444-5555-666666666666',
            //     branch: {
            //         id: '22222222-3333-4444-5555-666666666666',
            //         name: 'Main Branch',
            //     },
            //     created_by_id: '33333333-4444-5555-6666-777777777777',
            //     updated_by_id: '33333333-4444-5555-6666-777777777777',
            //     deleted_by_id: null,
            //     media_id: '66666666-7777-8888-9999-000000000000',
            //     media: {
            //         id: '66666666-7777-8888-9999-000000000000',
            //         download_url: 'https://example.com/image3.png',
            //     },
            //     name: '50 Peso Bill',
            //     value: 50,
            //     country_code: 'PH',
            //     created_at: '2024-05-03T09:00:00Z',
            //     updated_at: '2024-05-12T14:00:00Z',
            //     deleted_at: null,
            // },
            // {
            //     id: 'd4e5f678-9012-3456-789a-bcdef0123456',
            //     organization_id: '11111111-2222-3333-4444-555555555555',
            //     organization: {
            //         id: '11111111-2222-3333-4444-555555555555',
            //         name: 'Sample Organization',
            //     },
            //     branch_id: '22222222-3333-4444-5555-666666666666',
            //     branch: {
            //         id: '22222222-3333-4444-5555-666666666666',
            //         name: 'Main Branch',
            //     },
            //     created_by_id: '33333333-4444-5555-6666-777777777777',
            //     updated_by_id: '33333333-4444-5555-6666-777777777777',
            //     deleted_by_id: null,
            //     media_id: '77777777-8888-9999-0000-111111111111',
            //     media: {
            //         id: '77777777-8888-9999-0000-111111111111',
            //         download_url: 'https://example.com/image4.png',
            //     },
            //     name: '10 Peso Coin',
            //     value: 10,
            //     country_code: 'PH',
            //     created_at: '2024-05-04T08:00:00Z',
            //     updated_at: '2024-05-13T15:00:00Z',
            //     deleted_at: null,
            // },
            // {
            //     id: 'e5f67890-1234-5678-9abc-def012345678',
            //     organization_id: '11111111-2222-3333-4444-555555555555',
            //     organization: {
            //         id: '11111111-2222-3333-4444-555555555555',
            //         name: 'Sample Organization',
            //     },
            //     branch_id: '22222222-3333-4444-5555-666666666666',
            //     branch: {
            //         id: '22222222-3333-4444-5555-666666666666',
            //         name: 'Main Branch',
            //     },
            //     created_by_id: '33333333-4444-5555-6666-777777777777',
            //     updated_by_id: '33333333-4444-5555-6666-777777777777',
            //     deleted_by_id: null,
            //     media_id: '88888888-9999-0000-1111-222222222222',
            //     media: {
            //         id: '88888888-9999-0000-1111-222222222222',
            //         download_url: 'https://example.com/image5.png',
            //     },
            //     name: '5 Peso Coin',
            //     value: 5,
            //     country_code: 'PH',
            //     created_at: '2024-05-05T07:00:00Z',
            //     updated_at: '2024-05-14T16:00:00Z',
            //     deleted_at: null,
            // },
            // {
            //     id: 'f6789012-3456-789a-bcde-f01234567890',
            //     organization_id: '11111111-2222-3333-4444-555555555555',
            //     organization: {
            //         id: '11111111-2222-3333-4444-555555555555',
            //         name: 'Sample Organization',
            //     },
            //     branch_id: '22222222-3333-4444-5555-666666666666',
            //     branch: {
            //         id: '22222222-3333-4444-5555-666666666666',
            //         name: 'Main Branch',
            //     },
            //     created_by_id: '33333333-4444-5555-6666-777777777777',
            //     updated_by_id: '33333333-4444-5555-6666-777777777777',
            //     deleted_by_id: null,
            //     media_id: '99999999-0000-1111-2222-333333333333',
            //     media: {
            //         id: '99999999-0000-1111-2222-333333333333',
            //         download_url: 'https://example.com/image6.png',
            //     },
            //     name: '1 Peso Coin',
            //     value: 1,
            //     country_code: 'PH',
            //     created_at: '2024-05-06T06:00:00Z',
            //     updated_at: '2024-05-15T17:00:00Z',
            //     deleted_at: null,
            // },
        ] as unknown as IBillsAndCoin[],
        enabled,
        retry: 1,
    })
}

export const useFilteredPaginatedBillsAndCoin = ({
    sort,
    enabled,
    filterPayload,
    preloads = [],
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IBillsAndCoinPaginated, string> &
    IQueryProps = {}) => {
    return useQuery<IBillsAndCoinPaginated, string>({
        queryKey: [
            'bills-and-coin',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                BillsAndCoinService.getPaginatedBillsAndCoins({
                    preloads,
                    pagination,
                    sort: sort && toBase64(sort),
                    filters: filterPayload && toBase64(filterPayload),
                })
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        initialData: {
            data: [],
            pages: [],
            totalSize: 0,
            totalPage: 1,
            ...pagination,
        },
        enabled,
        retry: 1,
    })
}
