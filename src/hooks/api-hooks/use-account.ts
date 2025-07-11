import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { AccountServices } from '@/api-service/accounting-services'
import { serverRequestErrExtractor } from '@/helpers'
import {
    IAPIFilteredPaginatedHook,
    IAPIHook,
    IQueryProps,
} from '@/types/api-hooks-types'
import {
    IAccount,
    IAccountPaginated,
    IAccountRequest,
} from '@/types/coop-types/accounts/account'
import { toBase64, withCatchAsync } from '@/utils'

import { TEntityId, UpdateIndexRequest } from '@/types'

import {
    createMutationHook,
    createMutationInvalidateFn,
    deleteMutationInvalidationFn,
    updateMutationInvalidationFn,
} from '../../factory/api-hook-factory'

export const useAccountById = (
    id: TEntityId,
    { enabled = true }: IQueryProps = {}
) => {
    return useQuery<IAccount, string>({
        queryKey: ['account', id],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                AccountServices.getAccountById(id)
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

export const useAccount = ({
    id,
    enabled,
    showMessage = true,
    ...other
}: IAPIHook<IAccount> & IQueryProps<IAccount> & { id: TEntityId }) => {
    return useQuery<IAccount, string>({
        queryKey: ['account', id],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                AccountServices.getAccountById(id)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        enabled,
        retry: 1,
        ...other,
    })
}

export const useFilteredPaginatedAccount = ({
    sort,
    enabled,
    initialData,
    mode = 'all',
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IAccount, string> &
    IQueryProps<IAccountPaginated> & { mode?: 'all' | 'pendings' }) => {
    return useQuery<IAccountPaginated, string>({
        queryKey: [
            'account',
            'resource-query',
            mode,
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                AccountServices.getPaginatedAccount({
                    mode,
                    pagination,
                    sort: sort && toBase64(sort),
                    filters: filterPayload && toBase64(filterPayload),
                })
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        initialData: initialData ?? {
            data: [],
            pages: [],
            totalSize: 0,
            totalPage: 1,
            ...pagination,
        },
        enabled,
        retry: 1,
    })
}

export const useCreateAccount = createMutationHook<
    IAccount,
    string,
    IAccountRequest
>(
    (payload) => AccountServices.createAccount(payload),
    'New Account Created Successfully!',
    (args) => createMutationInvalidateFn('account', args)
)

export const useUpdateAccount = createMutationHook<
    IAccount,
    string,
    {
        accountId: TEntityId
        data: IAccountRequest
    }
>(
    (payload) => AccountServices.updateAccount(payload.accountId, payload.data),
    'Account Updated Successfully!',
    (args) => updateMutationInvalidationFn('account', args)
)

export const useDeleteAccount = createMutationHook<void, string, TEntityId>(
    (accountId) => AccountServices.deleteAccount(accountId),
    'Account Deleted Successfully!',
    (args) => deleteMutationInvalidationFn('account', args)
)

export const useUpdateAccountIndex = createMutationHook<
    IAccount,
    number,
    UpdateIndexRequest[]
>(
    (payload) => AccountServices.AccountUpdateIndex([...payload]),
    'Updated Account Index Successfully!',
    (args) =>
        updateMutationInvalidationFn('general-ledger-accounts-groupings', args)
)

export const useDeleteAccountFromGLDefintion = createMutationHook<
    IAccount,
    string,
    TEntityId
>(
    (payload) => AccountServices.deleteGLAccounts(payload),
    'general-ledger-definition-accounts-removed',
    (args) =>
        updateMutationInvalidationFn('general-ledger-accounts-groupings', args)
)
