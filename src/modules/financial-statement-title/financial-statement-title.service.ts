import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type {
    IFinancialStatementTitle,
    IFinancialStatementTitleRequest,
} from '../financial-statement-title'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: financialStatementTitleBaseKey,
} = createDataLayerFactory<
    IFinancialStatementTitle,
    IFinancialStatementTitleRequest
>({
    url: '/api/v1/financial-statement-title',
    baseKey: 'financial-statement-title',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: financialStatementTitleAPIRoute,

    create: createFinancialStatementTitle,
    updateById: updateFinancialStatementTitleById,

    deleteById: deleteFinancialStatementTitleById,
    deleteMany: deleteManyFinancialStatementTitle,

    getById: getFinancialStatementTitleById,
    getAll: getAllFinancialStatementTitle,
    getPaginated: getPaginatedFinancialStatementTitle,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { financialStatementTitleBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateFinancialStatementTitle,
    useUpdateById: useUpdateFinancialStatementTitleById,

    useGetAll: useGetAllFinancialStatementTitle,
    useGetById: useGetFinancialStatementTitleById,
    useGetPaginated: useGetPaginatedFinancialStatementTitle,

    useDeleteById: useDeleteFinancialStatementTitleById,
    useDeleteMany: useDeleteManyFinancialStatementTitle,
} = apiCrudHooks

export const useFinancialStatementTitleOrder = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (variables: { ids: string[] }) => {
            return (
                await API.put(
                    `${financialStatementTitleAPIRoute}/order`,
                    variables
                )
            ).data
        },
        onMutate: async (variables) => {
            await queryClient.cancelQueries({
                queryKey: [`${financialStatementTitleBaseKey}`, 'all'],
            })

            const previousFinancialStatementTitle = queryClient.getQueryData<
                IFinancialStatementTitle[]
            >([`${financialStatementTitleBaseKey}`, 'all'])

            queryClient.setQueryData<IFinancialStatementTitle[]>(
                [`${financialStatementTitleBaseKey}`, 'all'],
                (old) => {
                    if (!old) return old

                    const map = new Map(old.map((a) => [a.id, a]))

                    const idSet = new Set(variables.ids)

                    const reordered = variables.ids
                        .map((id) => map.get(id))
                        .filter(Boolean)

                    const remaining = old.filter((a) => !idSet.has(a.id))

                    return [
                        ...reordered,
                        ...remaining,
                    ] as IFinancialStatementTitle[]
                }
            )

            return { previousFinancialStatementTitle }
        },
        onError: (_err, _variables, context) => {
            if (context?.previousFinancialStatementTitle) {
                queryClient.setQueryData(
                    [`${financialStatementTitleBaseKey}`, 'all'],
                    context.previousFinancialStatementTitle
                )
            }
        },
        onSuccess: () => {
            // queryClient.invalidateQueries({
            //     queryKey: [`${financialStatementTitleBaseKey}`, 'all'],
            // })
        },
    })
}

export const logger = Logger.getInstance('financial-statement-title')
