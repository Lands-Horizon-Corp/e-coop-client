import { TEntityId } from '@/types'

import APIService from '../api-service'
import {
    IFinancialStatementDefinition,
    IFinancialStatementDefinitionRequest,
} from '@/types/coop-types/financial-statement-definition'

export const getAllFinancialStatementDefinition = async () => {
    const response = await APIService.get<IFinancialStatementDefinition[]>(
        `/general-ledger-definition`
    )
    return response.data
}

export const getFinancialStatementDefinitionById = async (
    financialStatementDefinitionId: TEntityId
): Promise<IFinancialStatementDefinition> => {
    const response = await APIService.get<IFinancialStatementDefinition>(
        `/general-ledger-definition/${financialStatementDefinitionId}`
    )
    return response.data
}

export const createFinancialStatementDefinition = async (
    payload: IFinancialStatementDefinitionRequest
): Promise<IFinancialStatementDefinition> => {
    const response = await APIService.post<
        IFinancialStatementDefinitionRequest,
        IFinancialStatementDefinition
    >(`/general-ledger-definition`, payload)
    return response.data
}

export const updateFinancialStatementDefinition = async (
    financialStatementDefinitionId: TEntityId,
    data: IFinancialStatementDefinitionRequest
): Promise<IFinancialStatementDefinition> => {
    const response = await APIService.put<
        IFinancialStatementDefinitionRequest,
        IFinancialStatementDefinition
    >(`/general-ledger-definition/${financialStatementDefinitionId}`, data)
    return response.data
}

export const deleteFinancialStatementDefinition = async (
    financialStatementDefinitionId: TEntityId
): Promise<void> => {
    const response = await APIService.delete<void>(
        `/general-ledger-definition/${financialStatementDefinitionId}`
    )
    return response.data
}

export const deleteManyFinancialStatementDefinitions = async (
    ids: TEntityId[]
): Promise<void> => {
    const response = await APIService.post<{ ids: TEntityId[] }, void>(
        `/general-ledger-definition/bulk-delete`,
        { ids }
    )
    return response.data
}
