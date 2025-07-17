import qs from 'query-string'

import {
    IMemberAccountingLedgerPaginated,
    IMemberAccountingLedgerTotal,
    TEntityId,
} from '@/types'

import APIService from '../api-service'

export const getMemberAccountingLedgerTotal = async (id: TEntityId) => {
    const response = await APIService.get<IMemberAccountingLedgerTotal>(
        `/member-accounting-ledger/member-profile/${id}/total`
    )
    return response.data
}

export const getMemberAccountingLedger = async ({
    memberProfileId,
    sort,
    filters,
    pagination,
}: {
    memberProfileId: TEntityId
    sort?: string
    filters?: string
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const url = qs.stringifyUrl(
        {
            url: `/member-accounting-ledger/member-profile/${memberProfileId}/searchsdasfa`,
            query: {
                sort,
                filter: filters,
                pageSize: pagination?.pageSize,
                pageIndex: pagination?.pageIndex,
            },
        },
        { skipNull: true }
    )

    const response = await APIService.get<IMemberAccountingLedgerPaginated>(url)
    return response.data
}

export default { getMemberAccountingLedgerTotal, getMemberAccountingLedger }
