import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import DisbursementService from '@/api-service/disbursement-service'
import { serverRequestErrExtractor } from '@/helpers'
import { toBase64, withCatchAsync } from '@/utils'

import {
    IAPIFilteredPaginatedHook,
    IAPIHook,
    IDisbursement,
    IDisbursementPaginated,
    IDisbursementRequest,
    IQueryProps,
    TEntityId,
} from '@/types'

import {
    createMutationHook,
    createMutationInvalidateFn,
    deleteMutationInvalidationFn,
    updateMutationInvalidationFn,
} from '../../factory/api-hook-factory'

export const useCreateDisbursement = createMutationHook<
    IDisbursement,
    string,
    IDisbursementRequest
>(
    (data) => DisbursementService.create(data),
    'Disbursement created',
    (args) => createMutationInvalidateFn('disbursement', args)
)

export const useUpdateDisbursement = createMutationHook<
    IDisbursement,
    string,
    { disbursementId: TEntityId; data: IDisbursementRequest }
>(
    ({ disbursementId, data }) =>
        DisbursementService.updateById(disbursementId, data),
    'Disbursement updated',
    (args) => updateMutationInvalidationFn('disbursement', args)
)

export const useDeleteDisbursement = createMutationHook<
    void,
    string,
    TEntityId
>(
    (id) => DisbursementService.deleteById(id),
    'Disbursement deleted',
    (args) => deleteMutationInvalidationFn('disbursement', args)
)

export const useDisbursements = ({
    enabled,
    showMessage = true,
}: IAPIHook<IDisbursement[], string> & IQueryProps = {}) => {
    return useQuery<IDisbursement[], string>({
        queryKey: ['disbursement', 'all'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                DisbursementService.allList()
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

export const useFilteredPaginatedDisbursements = ({
    sort,
    enabled,
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IDisbursementPaginated, string> &
    IQueryProps = {}) => {
    return useQuery<IDisbursementPaginated, string>({
        queryKey: [
            'disbursement',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                DisbursementService.search({
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
