import {
    IGeneralLedgerAccountsGrouping,
    IGeneralLedgerAccountsGroupingRequest,
} from '@/types/coop-types/general-ledger-accounts-grouping'

import { TEntityId } from '@/types'

import APIService from '../api-service'

export const getAllGeneralLedgerAccountsGrouping = async () => {
    const response = await APIService.get<IGeneralLedgerAccountsGrouping[]>(
        `/api/v1/general-ledger-accounts-grouping`
    )
    return response.data
}

export const updateGeneralLedgerAccountsGrouping = async (
    generalLedgerAccountsGroupingId: TEntityId,
    data: IGeneralLedgerAccountsGroupingRequest
): Promise<IGeneralLedgerAccountsGrouping> => {
    const response = await APIService.put<
        IGeneralLedgerAccountsGroupingRequest,
        IGeneralLedgerAccountsGrouping
    >(
        `/api/v1/general-ledger-accounts-grouping/${generalLedgerAccountsGroupingId}`,
        data
    )
    return response.data
}
