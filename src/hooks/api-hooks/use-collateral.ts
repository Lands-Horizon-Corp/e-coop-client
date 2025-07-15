import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import CollateralService from '@/api-service/collateral-service'
import {
    createMutationHook,
    createMutationInvalidateFn,
    deleteMutationInvalidationFn,
    updateMutationInvalidationFn,
} from '@/factory/api-hook-factory'
import { serverRequestErrExtractor } from '@/helpers'
import { toBase64, withCatchAsync } from '@/utils'

import {
    IAPIFilteredPaginatedHook,
    IAPIHook,
    ICollateral,
    ICollateralPaginated,
    ICollateralRequest,
    IQueryProps,
    TEntityId,
} from '@/types'

export const useCreateCollateral = createMutationHook<
    ICollateral,
    string,
    ICollateralRequest
>(
    (data) => CollateralService.create(data),
    'New Collateral Created',
    (args) => createMutationInvalidateFn('collateral', args)
)

export const useUpdateCollateral = createMutationHook<
    ICollateral,
    string,
    { id: TEntityId; data: ICollateralRequest }
>(
    ({ id, data }) => CollateralService.updateById(id, data),
    'Collateral Updated',
    (args) => updateMutationInvalidationFn('collateral', args)
)

export const useDeleteCollateral = createMutationHook<void, string, TEntityId>(
    (id) => CollateralService.deleteById(id),
    'Collateral Deleted',
    (args) => deleteMutationInvalidationFn('collateral', args)
)

export const useDeleteManyCollateral = createMutationHook<
    void,
    string,
    TEntityId[]
>((ids) => CollateralService.deleteMany(ids), 'Collateral Items Deleted')

export const useCollaterals = ({
    enabled,
    showMessage = true,
}: IAPIHook<ICollateral[], string> & IQueryProps = {}) => {
    return useQuery<ICollateral[], string>({
        queryKey: ['collateral', 'all'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                CollateralService.allList()
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        initialData: [],
        enabled,
        retry: 1,
    })
}

export const useFilteredPaginatedCollateral = ({
    sort,
    enabled,
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<ICollateralPaginated, string> &
    IQueryProps = {}) => {
    return useQuery<ICollateralPaginated, string>({
        queryKey: [
            'collateral',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                CollateralService.search({
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
