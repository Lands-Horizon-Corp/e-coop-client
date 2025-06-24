import { TEntityId } from '@/types'
import {
    IAccount,
    IAccountRequest,
    IAccountPaginated,
} from '@/types/coop-types/accounts/account'
import { IAPIFilteredPaginatedHook, IQueryProps } from '@/types/api-hooks-types'

import { createMutationHook } from '../../factory/api-hook-factory'
import { AccountServices } from '@/api-service/accounting-services'

import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'
import { toBase64, withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'

import ACCOUNT_DATA from './paginatedAccountSample.json'

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

export const useFilteredPaginatedAccount = ({
    sort,
    enabled,
    // initialData,
    mode = 'all',
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IAccount, string> &
    IQueryProps<IAccountPaginated> & { mode?: 'all' | 'pendings' }) => {
    return useQuery<IAccountPaginated, string>({
        queryKey: [
            'gender',
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
        initialData: ACCOUNT_DATA as unknown as IAccountPaginated,
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
    'New Account Created Successfully!'
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
    'Account Updated Successfully!'
)

export const useDeleteAccount = createMutationHook<void, string, TEntityId>(
    (accountId) => AccountServices.deleteAccount(accountId),
    'Account Deleted Successfully!'
)
