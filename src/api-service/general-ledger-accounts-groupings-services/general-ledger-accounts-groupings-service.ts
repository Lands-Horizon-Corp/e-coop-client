import { IGeneralLedgerAccountsGrouping } from '@/types/coop-types/general-ledger-accounts-grouping'
import {
    IGeneralLedgerDefinition,
    IGeneralLedgerDefinitionRequest,
} from '@/types/coop-types/general-ledger-definitions'

import { TEntityId } from '@/types'

import APIService from '../api-service'

export const getAllGeneralLedgerAccountsGrouping = async () => {
    const response = await APIService.get<IGeneralLedgerAccountsGrouping[]>(
        `/general-ledger-accounts-grouping`
    )
    return response.data
}

export const getGeneralLedgerDefinitionById = async (
    generalLedgerDefinitionId: TEntityId
): Promise<IGeneralLedgerDefinition> => {
    const response = await APIService.get<IGeneralLedgerDefinition>(
        `/general-ledger-definition/${generalLedgerDefinitionId}`
    )
    return response.data
}

export const createGeneralLedgerDefinition = async (
    payload: IGeneralLedgerDefinitionRequest
): Promise<IGeneralLedgerDefinition> => {
    const response = await APIService.post<
        IGeneralLedgerDefinitionRequest,
        IGeneralLedgerDefinition
    >(`/general-ledger-definition`, payload)
    return response.data
}

export const updateGeneralLedgerDefinition = async (
    generalLedgerDefinitionId: TEntityId,
    data: IGeneralLedgerDefinitionRequest
): Promise<IGeneralLedgerDefinition> => {
    const response = await APIService.put<
        IGeneralLedgerDefinitionRequest,
        IGeneralLedgerDefinition
    >(`/general-ledger-definition/${generalLedgerDefinitionId}`, data)
    return response.data
}

export const deleteGeneralLedgerDefinition = async (
    generalLedgerDefinitionId: TEntityId
): Promise<void> => {
    const response = await APIService.delete<void>(
        `/general-ledger-definition/${generalLedgerDefinitionId}`
    )
    return response.data
}

export const deleteManyGeneralLedgerDefinitions = async (
    ids: TEntityId[]
): Promise<void> => {
    const response = await APIService.post<{ ids: TEntityId[] }, void>(
        `/general-ledger-definition/bulk-delete`,
        { ids }
    )
    return response.data
}

export const connectAccountToGeneralLedgerDefinition = async (
    generalLedgerDefinitionId: TEntityId,
    accountId: TEntityId
): Promise<IGeneralLedgerDefinition> => {
    const response = await APIService.post<
        { generalLedgerDefinitionId: TEntityId; accountId: TEntityId },
        IGeneralLedgerDefinition
    >(
        `/general-ledger-definition/${generalLedgerDefinitionId}/account/${accountId}/connect`
    )
    return response.data
}
