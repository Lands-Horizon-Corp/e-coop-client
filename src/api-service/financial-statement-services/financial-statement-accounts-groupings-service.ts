import { IGeneralLedgerAccountsGrouping } from '@/types/coop-types/general-ledger-accounts-grouping'

import APIService from '../api-service'

export const getAllFinancialStatementAccountsGrouping = async () => {
    const response = await APIService.get<IGeneralLedgerAccountsGrouping[]>(
        `/financial-statement-accounts-grouping`
    )
    return response.data
}
