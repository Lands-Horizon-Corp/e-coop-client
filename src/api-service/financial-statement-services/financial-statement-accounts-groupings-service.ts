import { FinancialStatementGrouping } from '@/types/coop-types/financial-statement-accounts-grouping'

import APIService from '../api-service'

export const getAllFinancialStatementAccountsGrouping = async () => {
    const response = await APIService.get<FinancialStatementGrouping[]>(
        `/financial-statement-grouping`
    )
    return response.data
}
