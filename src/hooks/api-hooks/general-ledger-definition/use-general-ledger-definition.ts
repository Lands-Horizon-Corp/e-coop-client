import { GeneralLedgerDefinitionServices } from '@/api-service/general-ledger-definition-services'
import {
    IGeneralLedgerDefinition,
    IGeneralLedgerDefinitionRequest,
} from '@/types/coop-types/general-ledger-definitions'

import { TEntityId } from '@/types'

import { createMutationHook } from '../../../factory/api-hook-factory'

export const useCreateGeneralLedgerDefinition = createMutationHook<
    IGeneralLedgerDefinition,
    string,
    IGeneralLedgerDefinitionRequest
>(
    (payload) =>
        GeneralLedgerDefinitionServices.createGeneralLedgerDefinition(payload),
    'New General Ledger Definition Created'
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
    'General Ledger Definition Updated'
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
    'General Ledger Definition Deleted'
)
