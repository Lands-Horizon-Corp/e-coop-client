import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { GeneralLedgerDefinitionServices } from '@/api-service/general-ledger-accounts-groupings-services'
import { serverRequestErrExtractor } from '@/helpers'
import { IGeneralLedgerAccountsGrouping } from '@/types/coop-types/general-ledger-accounts-grouping'
import {
    IGeneralLedgerDefinition,
    IGeneralLedgerDefinitionRequest,
} from '@/types/coop-types/general-ledger-definitions'
import { withCatchAsync } from '@/utils'

import { IAPIHook, IQueryProps, TEntityId } from '@/types'

import {
    createMutationHook,
    createMutationInvalidateFn,
    deleteMutationInvalidationFn,
    updateMutationInvalidationFn,
} from '../../../factory/api-hook-factory'

export const useCreateGeneralLedgerDefinition = createMutationHook<
    IGeneralLedgerDefinition,
    string,
    IGeneralLedgerDefinitionRequest
>(
    (payload) =>
        GeneralLedgerDefinitionServices.createGeneralLedgerDefinition(payload),
    'New General Ledger Definition Created',
    (args) =>
        createMutationInvalidateFn('general-ledger-accounts-groupings', args)
)

export const useUpdateGeneralLedgerDefinition = createMutationHook<
    IGeneralLedgerDefinition,
    string,
    {
        generalLedgerDefinitionId: TEntityId
        data: IGeneralLedgerDefinitionRequest
    }
>(
    (payload) =>
        GeneralLedgerDefinitionServices.updateGeneralLedgerDefinition(
            payload.generalLedgerDefinitionId,
            payload.data
        ),
    'General Ledger Definition Updated',
    (args) =>
        updateMutationInvalidationFn('general-ledger-accounts-groupings', args)
)

export const useDeleteGeneralLedgerDefinition = createMutationHook<
    void,
    string,
    TEntityId
>(
    (generalLedgerDefinitionId) =>
        GeneralLedgerDefinitionServices.deleteGeneralLedgerDefinition(
            generalLedgerDefinitionId
        ),
    'General Ledger Definition Deleted',
    (args) =>
        deleteMutationInvalidationFn('general-ledger-accounts-groupings', args)
)

export const useGetAllGeneralLedgerAccountsGroupings = ({
    enabled,
    showMessage = true,
}: IAPIHook<IGeneralLedgerAccountsGrouping[], string> & IQueryProps = {}) => {
    return useQuery<IGeneralLedgerAccountsGrouping[], string>({
        queryKey: ['general-ledger-accounts-groupings', 'all'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                GeneralLedgerDefinitionServices.getAllGeneralLedgerAccountsGrouping()
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
