import { GeneralLedgerDefinitionServices } from '@/api-service/general-ledger-services'
import {
    IGeneralLedgerDefinition,
    IGeneralLedgerDefinitionRequest,
    IGeneralLedgerUpdateIndexRequest,
} from '@/types/coop-types/general-ledger-definitions'

import { TEntityId } from '@/types'

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

export const useConnectAccountToGeneralLedgerDefinition = createMutationHook<
    IGeneralLedgerDefinition,
    string,
    {
        generalLedgerDefinitionId: TEntityId
        accountId: TEntityId
    }
>(
    (payload) =>
        GeneralLedgerDefinitionServices.connectAccountToGeneralLedgerDefinition(
            payload.generalLedgerDefinitionId,
            payload.accountId
        ),
    'Account Connected to General Ledger Definition',
    (args) =>
        createMutationInvalidateFn('general-ledger-accounts-groupings', args)
)

export const useUpdateIndexGeneralLedgerDefinition = createMutationHook<
    IGeneralLedgerDefinition,
    number,
    IGeneralLedgerUpdateIndexRequest[]
>(
    (payload) =>
        GeneralLedgerDefinitionServices.generalLedgerUpdateIndex([...payload]),
    undefined,
    (args) =>
        updateMutationInvalidationFn('general-ledger-accounts-groupings', args)
)
