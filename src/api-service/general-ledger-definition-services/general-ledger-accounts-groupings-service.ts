import { IGeneralLedgerAccountsGrouping } from '@/types/coop-types/general-ledger-accounts-grouping'

import APIService from '../api-service'

export const getAllGeneralLedgerAccountsGrouping = async () => {
    const response = await APIService.get<IGeneralLedgerAccountsGrouping[]>(
        `/general-ledger-accounts-grouping`
    )
    return response.data
}
