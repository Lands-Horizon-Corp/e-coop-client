import {
    IGeneralLedgerDefinition,
    IGeneralLedgerDefinitionRequest,
} from '@/types/coop-types/general-ledger-definitions'

import { TEntityId, UpdateIndexRequest } from '@/types'

import APIService from '../api-service'

export const getGeneralLedgerDefinitionById = async (
    generalLedgerDefinitionId: TEntityId
): Promise<IGeneralLedgerDefinition> => {
    const response = await APIService.get<IGeneralLedgerDefinition>(
        `/api/v1/general-ledger-definition/${generalLedgerDefinitionId}`
    )
    return response.data
}

export const createGeneralLedgerDefinition = async (
    payload: IGeneralLedgerDefinitionRequest
): Promise<IGeneralLedgerDefinition> => {
    const response = await APIService.post<
        IGeneralLedgerDefinitionRequest,
        IGeneralLedgerDefinition
    >(`/api/v1/general-ledger-definition`, payload)
    return response.data
}

export const updateGeneralLedgerDefinition = async (
    generalLedgerDefinitionId: TEntityId,
    data: IGeneralLedgerDefinitionRequest
): Promise<IGeneralLedgerDefinition> => {
    const response = await APIService.put<
        IGeneralLedgerDefinitionRequest,
        IGeneralLedgerDefinition
    >(`/api/v1/general-ledger-definition/${generalLedgerDefinitionId}`, data)
    return response.data
}

export const deleteGeneralLedgerDefinition = async (
    generalLedgerDefinitionId: TEntityId
): Promise<void> => {
    const response = await APIService.delete<void>(
        `/api/v1/general-ledger-definition/${generalLedgerDefinitionId}`
    )
    return response.data
}

export const deleteManyGeneralLedgerDefinitions = async (
    ids: TEntityId[]
): Promise<void> => {
    const response = await APIService.post<{ ids: TEntityId[] }, void>(
        `/api/v1/general-ledger-definition/bulk-delete`,
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
        `/api/v1/general-ledger-definition/${generalLedgerDefinitionId}/account/${accountId}/connect`
    )
    return response.data
}

export const generalLedgerUpdateIndex = async (
    changedItems: UpdateIndexRequest[]
): Promise<IGeneralLedgerDefinition> => {
    const response = await Promise.all(
        changedItems.map((item) =>
            APIService.put<
                { generalLedgerDefinitionId: TEntityId; index: number },
                IGeneralLedgerDefinition
            >(
                `/api/v1/general-ledger-definition/${item.id}/index/${item.index}`
            )
        )
    )
    return response[0].data
}
