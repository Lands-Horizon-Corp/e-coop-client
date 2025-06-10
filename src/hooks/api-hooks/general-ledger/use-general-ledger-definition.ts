import { IAPIFilteredPaginatedHook, IQueryProps } from '@/types/api-hooks-types'

import { GeneralLedgerDefinitionServices } from '@/api-service/general-ledger-services'

import { serverRequestErrExtractor } from '@/helpers'
import { withCatchAsync, toBase64 } from '@/utils'

import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    IGeneralLedgerDefinition,
    IGeneralLedgerDefinitionRequest,
    IPaginatedGeneralLedgerDefinition,
} from '@/types/coop-types/general-ledger-definitions'
import { createMutationHook } from '../api-hook-factory'

export const useFilteredPaginatedGeneralLedgerDefinition = ({
    sort,
    enabled,
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IPaginatedGeneralLedgerDefinition, string> &
    IQueryProps = {}) => {
    return useQuery<IPaginatedGeneralLedgerDefinition, string>({
        queryKey: [
            'general_ledger_definition',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                GeneralLedgerDefinitionServices.getPaginatedGeneralLedgerDefinition(
                    {
                        pagination,
                        sort: sort && toBase64(sort),
                        filters: filterPayload && toBase64(filterPayload),
                    }
                )
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

export const useCreateGeneralLedgerDefinition = createMutationHook<
    IGeneralLedgerDefinition,
    string,
    IGeneralLedgerDefinitionRequest
>(
    (payload) =>
        GeneralLedgerDefinitionServices.createGeneralLedgerDefinition(payload),
    'New General Ledger Definition Created'
)

// export const useUpdateGeneralLedgerDefinition = createMutationHook<
//     IGeneralLedgerDefinition,
//     string,
//     {
//         generalLedgerDefinitionId: TEntityId
//         data: IGeneralLedgerDefinitionRequest
//     }
// >(
//     (payload) =>
//         updateGeneralLedgerDefinition(
//             payload.generalLedgerDefinitionId,
//             payload.data
//         ),
//     'General Ledger Definition Updated'
// )

// export const useDeleteGeneralLedgerDefinition = createMutationHook<
//     void,
//     string,
//     TEntityId
// >(
//     (generalLedgerDefinitionId) =>
//         deleteGeneralLedgerDefinition(
//             generalLedgerDefinitionId,
//             'dummy_org_id',
//             'dummy_branch_id'
//         ),
//     'General Ledger Definition Deleted'
// )

// export const useGetGeneralLedgerDefinitionById = (
//     generalLedgerDefinitionId?: TEntityId,
//     showMessage = true
// ) => {
//     return useQuery<IGeneralLedgerDefinition, string>({
//         queryKey: ['general_ledger_definition', generalLedgerDefinitionId],
//         queryFn: async () => {
//             if (!generalLedgerDefinitionId) {
//                 throw new Error(
//                     'General Ledger Definition ID is required to fetch details.'
//                 )
//             }
//             const [error, result] = await withCatchAsync(
//                 getGeneralLedgerDefinitionById(generalLedgerDefinitionId)
//             )

//             if (error) {
//                 const errorMessage = serverRequestErrExtractor({ error })
//                 if (showMessage) toast.error(errorMessage)
//                 throw errorMessage
//             }

//             return result
//         },
//         enabled: !!generalLedgerDefinitionId, // Only run the query if ID is provided
//         retry: 1, // Number of retries on failure
//     })
// }

// /**
//  * Hook to delete multiple General Ledger Definitions.
//  */
// export const useDeleteManyGeneralLedgerDefinitions = createMutationHook<
//     void,
//     string,
//     TEntityId[]
// >(
//     (ids) => deleteManyGeneralLedgerDefinitions(ids),
//     'Selected General Ledger Definitions Deleted'
// )
