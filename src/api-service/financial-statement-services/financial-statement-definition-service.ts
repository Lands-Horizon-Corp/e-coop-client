import {
    IFinancialStatementDefinition,
    IFinancialStatementDefinitionRequest,
    TEntityId,
    UpdateIndexRequest,
} from '@/types'

import APIService from '../api-service'

export const getAllFinancialStatementDefinition = async () => {
    const response = await APIService.get<IFinancialStatementDefinition[]>(
        `/api/v1/financial-statement-definition`
    )
    return response.data
}

export const getFinancialStatementDefinitionById = async (
    financialStatementDefinitionId: TEntityId
): Promise<IFinancialStatementDefinition> => {
    const response = await APIService.get<IFinancialStatementDefinition>(
        `/api/v1/financial-statement-definition/${financialStatementDefinitionId}`
    )
    return response.data
}

export const createFinancialStatementDefinition = async (
    payload: IFinancialStatementDefinitionRequest
): Promise<IFinancialStatementDefinition> => {
    const response = await APIService.post<
        IFinancialStatementDefinitionRequest,
        IFinancialStatementDefinition
    >(`/api/v1/financial-statement-definition`, payload)
    return response.data
}

export const updateFinancialStatementDefinition = async (
    financialStatementDefinitionId: TEntityId,
    data: IFinancialStatementDefinitionRequest
): Promise<IFinancialStatementDefinition> => {
    const response = await APIService.put<
        IFinancialStatementDefinitionRequest,
        IFinancialStatementDefinition
    >(
        `/api/v1/financial-statement-definition/${financialStatementDefinitionId}`,
        data
    )
    return response.data
}

export const deleteFinancialStatementDefinition = async (
    financialStatementDefinitionId: TEntityId
): Promise<void> => {
    const response = await APIService.delete<void>(
        `/api/v1/financial-statement-definition/${financialStatementDefinitionId}`
    )
    return response.data
}

export const connectAccountToFinancialStatementDefinition = async (
    financialStatementDefinitionId: TEntityId,
    accountId: TEntityId
): Promise<IFinancialStatementDefinition> => {
    const response = await APIService.post<
        { financialStatementDefinitionId: TEntityId; accountId: TEntityId },
        IFinancialStatementDefinition
    >(
        `/api/v1/financial-statement-definition/${financialStatementDefinitionId}/account/${accountId}/connect`
    )
    return response.data
}

export const financialStatementUpdateIndex = async (
    changedItems: UpdateIndexRequest[]
): Promise<IFinancialStatementDefinition> => {
    const response = await Promise.all(
        changedItems.map((item) =>
            APIService.put<
                { FinancialStatementDefinitionId: TEntityId; index: number },
                IFinancialStatementDefinition
            >(
                `/api/v1/financial-statement-definition/${item.id}/index/${item.index}`
            )
        )
    )
    return response[0].data
}
