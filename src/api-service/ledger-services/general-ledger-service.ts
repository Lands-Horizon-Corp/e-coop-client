import qs from 'query-string'

import {
    IGeneralLedgerPaginated,
    IMemberGeneralLedgerTotal,
    TEntityId,
} from '@/types'

import APIService from '../api-service'

export const getMemberAccountGeneralLedger = async ({
    memberProfileId,
    accountId,
    sort,
    filters,
    pagination,
}: {
    memberProfileId: TEntityId
    accountId: TEntityId
    sort?: string
    filters?: string
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const url = qs.stringifyUrl(
        {
            url: `/general-ledger/member-profile/${memberProfileId}/account/${accountId}/search`,
            query: {
                sort,
                filter: filters,
                pageSize: pagination?.pageSize,
                pageIndex: pagination?.pageIndex,
            },
        },
        { skipNull: true }
    )

    const response = await APIService.get<IGeneralLedgerPaginated>(url)
    return response.data
}

export const getMemberAccountGeneralLedgerTotal = async (
    memberProfileId: TEntityId,
    accountId: TEntityId
) => {
    const response = await APIService.get<IMemberGeneralLedgerTotal>(
        `/general-ledger/member-profile/${memberProfileId}/account/${accountId}/total`
    )
    return response.data
}

export const getPaginatedGeneralLedger = async ({
    sort,
    filters,
    pagination,
    accountId,
}: {
    accountId: TEntityId
} & {
    sort?: string
    filters?: string
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const url = qs.stringifyUrl(
        {
            url: `/general-ledger/account/${accountId}/search`,
            query: {
                sort,
                filter: filters,
                pageIndex: pagination?.pageIndex,
                pageSize: pagination?.pageSize,
            },
        },
        { skipNull: true }
    )

    const response = await APIService.get<IGeneralLedgerPaginated>(url)
    return response.data
}

export default {
    getMemberAccountGeneralLedger,
    getMemberAccountGeneralLedgerTotal,
    getPaginatedGeneralLedger,
}
