import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import computationSheetService from '@/api-service/loan-service/loan-scheme/computation-sheet-service'
import {
    createMutationHook,
    createMutationInvalidateFn,
    deleteMutationInvalidationFn,
    updateMutationInvalidationFn,
} from '@/factory/api-hook-factory'
import { serverRequestErrExtractor } from '@/helpers'
import { withCatchAsync } from '@/utils'

import {
    IAPIHook,
    IComputationSheet,
    IComputationSheetRequest,
    IQueryProps,
    TEntityId,
} from '@/types'

export const useCreateComputationSheet = createMutationHook<
    IComputationSheet,
    string,
    IComputationSheetRequest
>(
    (data) => computationSheetService.create(data),
    'Computation sheet created',
    (args) => createMutationInvalidateFn('computation-sheet', args)
)

export const useUpdateComputationSheet = createMutationHook<
    IComputationSheet,
    string,
    { id: TEntityId; data: IComputationSheetRequest }
>(
    ({ id, data }) => computationSheetService.updateById(id, data),
    'Computation sheet updated',
    (args) => updateMutationInvalidationFn('computation-sheet', args)
)

export const useDeleteComputationSheet = createMutationHook<
    void,
    string,
    TEntityId
>(
    (id) => computationSheetService.deleteById(id),
    'Computation sheet deleted',
    (args) => deleteMutationInvalidationFn('computation-sheet', args)
)

export const useComputationSheet = ({
    enabled,
    schemeId,
    showMessage = true,
    ...rest
}: IAPIHook<IComputationSheet, string> &
    IQueryProps<IComputationSheet> & { schemeId: TEntityId }) => {
    return useQuery<IComputationSheet | undefined, string>({
        queryKey: ['computation-sheet', schemeId],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                computationSheetService.getById(schemeId)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        enabled,
        retry: 1,
        ...rest,
    })
}

export const useComputationSheets = ({
    enabled,
    showMessage = true,
}: IAPIHook<IComputationSheet[], string> & IQueryProps = {}) => {
    return useQuery<IComputationSheet[], string>({
        queryKey: ['computation-sheet', 'all'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                computationSheetService.allList()
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
