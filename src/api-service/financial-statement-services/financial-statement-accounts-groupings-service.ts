import {
    IFinancialStatementAccountsGrouping,
    IFinancialStatementAccountsGroupingRequest,
} from '@/types/coop-types/financial-statement-accounts-grouping'

import { TEntityId } from '@/types'

import APIService from '../api-service'

export const getAllFinancialStatementAccountsGrouping = async () => {
    const response = await APIService.get<
        IFinancialStatementAccountsGrouping[]
    >(`/financial-statement-grouping`)
    return response.data
}

export const updateFinancialStatementAccountsGrouping = async (
    financialStatementAccountsGroupingId: TEntityId,
    data: IFinancialStatementAccountsGroupingRequest
): Promise<IFinancialStatementAccountsGrouping> => {
    const response = await APIService.put<
        IFinancialStatementAccountsGroupingRequest,
        IFinancialStatementAccountsGrouping
    >(
        `/financial-statement-grouping/${financialStatementAccountsGroupingId}`,
        data
    )
    return response.data
}
