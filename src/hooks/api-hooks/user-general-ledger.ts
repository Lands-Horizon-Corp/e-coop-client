import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { GeneralLedgerService } from '@/api-service/ledger-services'
import { serverRequestErrExtractor } from '@/helpers'
import { toBase64, withCatchAsync } from '@/utils'

import {
    EntryType,
    IAPIFilteredPaginatedHook,
    IGeneralLedger,
    IGeneralLedgerPaginated,
    IQueryProps,
    TEntityId,
} from '@/types'

export const useGeneralLedgerByID = (
    id: TEntityId,
    { enabled = true }: IQueryProps = {}
) => {
    return useQuery<IGeneralLedger, string>({
        queryKey: ['general-ledger ', id],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                GeneralLedgerService.getGeneralLedgerByID(id)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                throw errorMessage
            }
            return result
        },
        enabled,
        retry: 1,
    })
}

// 1. Branch
export const useFilteredPaginatedBranchGeneralLedger = ({
    sort,
    filterPayload,
    pagination = { pageSize: 10, pageIndex: 0 },
    entryType = '',
    showMessage = true,
    enabled,
    ...other
}: {
    entryType?: EntryType
} & IAPIFilteredPaginatedHook<IGeneralLedgerPaginated> &
    IQueryProps) => {
    return useQuery<IGeneralLedgerPaginated, string>({
        queryKey: [
            'branch-general-ledger',
            entryType,
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                GeneralLedgerService.getPaginatedBranchGeneralLedger(
                    {
                        pagination,
                        sort: sort && toBase64(sort),
                        filters: filterPayload && toBase64(filterPayload),
                    },
                    entryType
                )
            )
            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }
            return result
        },
        initialData: {
            data: [],
            pages: [],
            totalSize: 0,
            totalPage: 1,
            ...pagination,
        },
        enabled,
        retry: 1,
        ...other,
    })
}

// 2. Employee (requires userOrganizationId)
export const useFilteredPaginatedEmployeeGeneralLedger = ({
    userOrganizationId,
    sort,
    filterPayload,
    pagination = { pageSize: 10, pageIndex: 0 },
    entryType = '',
    showMessage = true,
    enabled,
    ...other
}: {
    userOrganizationId: TEntityId
    entryType?: EntryType
} & IAPIFilteredPaginatedHook<IGeneralLedgerPaginated> &
    IQueryProps) => {
    return useQuery<IGeneralLedgerPaginated, string>({
        queryKey: [
            'employee-general-ledger',
            userOrganizationId,
            entryType,
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                GeneralLedgerService.getPaginatedEmployeeGeneralLedger(
                    userOrganizationId,
                    {
                        pagination,
                        sort: sort && toBase64(sort),
                        filters: filterPayload && toBase64(filterPayload),
                    },
                    entryType
                )
            )
            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }
            return result
        },
        initialData: {
            data: [],
            pages: [],
            totalSize: 0,
            totalPage: 1,
            ...pagination,
        },
        enabled,
        retry: 1,
        ...other,
    })
}

// 3. Member (requires memberProfileId)
export const useFilteredPaginatedMemberGeneralLedger = ({
    memberProfileId,
    sort,
    filterPayload,
    pagination = { pageSize: 10, pageIndex: 0 },
    entryType = '',
    showMessage = true,
    enabled,
    ...other
}: {
    memberProfileId: TEntityId
    entryType?: EntryType
} & IAPIFilteredPaginatedHook<IGeneralLedgerPaginated> &
    IQueryProps) => {
    return useQuery<IGeneralLedgerPaginated, string>({
        queryKey: [
            'member-general-ledger',
            memberProfileId,
            entryType,
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                GeneralLedgerService.getPaginatedMemberGeneralLedger(
                    memberProfileId,
                    {
                        pagination,
                        sort: sort && toBase64(sort),
                        filters: filterPayload && toBase64(filterPayload),
                    },
                    entryType
                )
            )
            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }
            return result
        },
        initialData: {
            data: [],
            pages: [],
            totalSize: 0,
            totalPage: 1,
            ...pagination,
        },
        enabled,
        retry: 1,
        ...other,
    })
}

// 4. Member Account (requires memberProfileId, accountId)
export const useFilteredPaginatedMemberAccountGeneralLedger = ({
    memberProfileId,
    accountId,
    sort,
    filterPayload,
    pagination = { pageSize: 10, pageIndex: 0 },
    entryType = '',
    showMessage = true,
    enabled,
    ...other
}: {
    memberProfileId: TEntityId
    accountId: TEntityId
    entryType?: EntryType
} & IAPIFilteredPaginatedHook<IGeneralLedgerPaginated> &
    IQueryProps) => {
    return useQuery<IGeneralLedgerPaginated, string>({
        queryKey: [
            'member-account-general-ledger',
            memberProfileId,
            accountId,
            entryType,
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                GeneralLedgerService.getPaginatedMemberAccountGeneralLedger(
                    memberProfileId,
                    accountId,
                    {
                        pagination,
                        sort: sort && toBase64(sort),
                        filters: filterPayload && toBase64(filterPayload),
                    },
                    entryType
                )
            )
            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }
            return result
        },
        initialData: {
            data: [],
            pages: [],
            totalSize: 0,
            totalPage: 1,
            ...pagination,
        },
        enabled,
        retry: 1,
        ...other,
    })
}

// 5. Current (me)
export const useFilteredPaginatedCurrentGeneralLedger = ({
    sort,
    filterPayload,
    pagination = { pageSize: 10, pageIndex: 0 },
    entryType = '',
    showMessage = true,
    enabled,
    ...other
}: {
    entryType?: EntryType
} & IAPIFilteredPaginatedHook<IGeneralLedgerPaginated> &
    IQueryProps) => {
    return useQuery<IGeneralLedgerPaginated, string>({
        queryKey: [
            'current-general-ledger',
            entryType,
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                GeneralLedgerService.getPaginatedCurrentGeneralLedger(
                    {
                        pagination,
                        sort: sort && toBase64(sort),
                        filters: filterPayload && toBase64(filterPayload),
                    },
                    entryType
                )
            )
            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }
            return result
        },
        initialData: {
            data: [],
            pages: [],
            totalSize: 0,
            totalPage: 1,
            ...pagination,
        },
        enabled,
        retry: 1,
        ...other,
    })
}

// 6. Transaction Batch
export const useFilteredPaginatedTransactionBatchGeneralLedger = ({
    transactionBatchId,
    sort,
    filterPayload,
    pagination = { pageSize: 10, pageIndex: 0 },
    entryType = '',
    showMessage = true,
    enabled,
    ...other
}: {
    transactionBatchId: TEntityId
    entryType?: EntryType
} & IAPIFilteredPaginatedHook<IGeneralLedgerPaginated> &
    IQueryProps) => {
    return useQuery<IGeneralLedgerPaginated, string>({
        queryKey: [
            'transaction-batch-general-ledger',
            transactionBatchId,
            entryType,
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                GeneralLedgerService.getPaginatedTransactionBatchGeneralLedger(
                    transactionBatchId,
                    {
                        pagination,
                        sort: sort && toBase64(sort),
                        filters: filterPayload && toBase64(filterPayload),
                    },
                    entryType
                )
            )
            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }
            return result
        },
        initialData: {
            data: [],
            pages: [],
            totalSize: 0,
            totalPage: 1,
            ...pagination,
        },
        enabled,
        retry: 1,
        ...other,
    })
}

// 7. Transaction
export const useFilteredPaginatedTransactionGeneralLedger = ({
    transactionId,
    sort,
    filterPayload,
    pagination = { pageSize: 10, pageIndex: 0 },
    entryType = '',
    showMessage = true,
    enabled,
    ...other
}: {
    transactionId: TEntityId
    entryType?: EntryType
} & IAPIFilteredPaginatedHook<IGeneralLedgerPaginated> &
    IQueryProps) => {
    return useQuery<IGeneralLedgerPaginated, string>({
        queryKey: [
            'transaction-general-ledger',
            transactionId,
            entryType,
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                GeneralLedgerService.getPaginatedTransactionGeneralLedger(
                    transactionId,
                    {
                        pagination,
                        sort: sort && toBase64(sort),
                        filters: filterPayload && toBase64(filterPayload),
                    },
                    entryType
                )
            )
            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }
            return result
        },
        initialData: {
            data: [],
            pages: [],
            totalSize: 0,
            totalPage: 1,
            ...pagination,
        },
        enabled,
        retry: 1,
        ...other,
    })
}

// 8. Account
export const useFilteredPaginatedAccountGeneralLedger = ({
    accountId,
    sort,
    filterPayload,
    pagination = { pageSize: 10, pageIndex: 0 },
    entryType = '',
    showMessage = true,
    enabled,
    ...other
}: {
    accountId: TEntityId
    entryType?: EntryType
} & IAPIFilteredPaginatedHook<IGeneralLedgerPaginated> &
    IQueryProps) => {
    return useQuery<IGeneralLedgerPaginated, string>({
        queryKey: [
            'account-general-ledger',
            accountId,
            entryType,
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                GeneralLedgerService.getPaginatedAccountGeneralLedger(
                    accountId,
                    {
                        pagination,
                        sort: sort && toBase64(sort),
                        filters: filterPayload && toBase64(filterPayload),
                    },
                    entryType
                )
            )
            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }
            return result
        },
        initialData: {
            data: [],
            pages: [],
            totalSize: 0,
            totalPage: 1,
            ...pagination,
        },
        enabled,
        retry: 1,
        ...other,
    })
}
