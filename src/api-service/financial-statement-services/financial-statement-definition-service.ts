import {
    IFinancialStatementDefinition,
    IFinancialStatementDefinitionRequest,
    TEntityId,
} from '@/types'

import APIService from '../api-service'

export const getAllFinancialStatementDefinition = async () => {
    const response =
        await APIService.get<IFinancialStatementDefinition[]>(
            `/financial-statement`
        )
    return response.data
}

export const getFinancialStatementDefinitionById = async (
    financialStatementDefinitionId: TEntityId
): Promise<IFinancialStatementDefinition> => {
    const response = await APIService.get<IFinancialStatementDefinition>(
        `/financial-statement/${financialStatementDefinitionId}`
    )
    return response.data
}

export const createFinancialStatementDefinition = async (
    payload: IFinancialStatementDefinitionRequest
): Promise<IFinancialStatementDefinition> => {
    const response = await APIService.post<
        IFinancialStatementDefinitionRequest,
        IFinancialStatementDefinition
    >(`/financial-statement`, payload)
    return response.data
}

export const updateFinancialStatementDefinition = async (
    financialStatementDefinitionId: TEntityId,
    data: IFinancialStatementDefinitionRequest
): Promise<IFinancialStatementDefinition> => {
    const response = await APIService.put<
        IFinancialStatementDefinitionRequest,
        IFinancialStatementDefinition
    >(`/financial-statement/${financialStatementDefinitionId}`, data)
    return response.data
}

export const deleteFinancialStatementDefinition = async (
    financialStatementDefinitionId: TEntityId
): Promise<void> => {
    const response = await APIService.delete<void>(
        `/financial-statement/${financialStatementDefinitionId}`
    )
    return response.data
}

export const deleteManyFinancialStatementDefinitions = async (
    ids: TEntityId[]
): Promise<void> => {
    const response = await APIService.post<{ ids: TEntityId[] }, void>(
        `/financial-statement/bulk-delete`,
        { ids }
    )
    return response.data
}
