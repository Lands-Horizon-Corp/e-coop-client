import { TEntityId } from '@/types'
import { IQueryProps } from '@/types/api-hooks-types'
import { IAccount, IAccountRequest } from '@/types/coop-types/accounts/account'

import { createMutationHook } from './api-hook-factory'

import { serverRequestErrExtractor } from '@/helpers'
import { withCatchAsync } from '@/utils'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AccountServices } from '@/api-service/accounting-services'

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

export const useAllAccounts = ({ enabled = true }: IQueryProps = {}) => {
    return useQuery<IAccount[], string>({
        queryKey: ['accounts', 'all'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                AccountServices.getAllAccounts()
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                throw errorMessage
            }
            return result
        },
        initialData: [],
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
