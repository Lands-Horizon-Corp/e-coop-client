import { useQuery } from '@tanstack/react-query'

import { Logger } from '@/helpers/loggers'
import { HookQueryOptions } from '@/providers/repositories/data-layer-factory'

import { TAPIQueryOptions } from '@/types'

import { ITransactionPaginated, getPaginated, route } from '../transaction'

export type TTransactionHookMode =
    | 'current-branch'
    | 'current-user'
    | 'member-profile'
    | 'employee'
    | 'transaction-batch'
export const useFilteredPaginatedTransaction = ({
    mode = 'current-branch', // Default mode
    userId,
    memberProfileId,
    transactionBatchId,
    query,
    options,
}: {
    mode?: TTransactionHookMode
    userId?: string
    memberProfileId?: string
    transactionBatchId?: string
    query?: TAPIQueryOptions
    options?: HookQueryOptions<ITransactionPaginated, Error>
}) => {
    return useQuery<ITransactionPaginated, Error>({
        ...options,
        queryKey: [
            'transaction',
            getPaginated,
            mode,
            memberProfileId,
            userId,
            transactionBatchId,
            query,
        ].filter(Boolean),
        queryFn: async () => {
            let url: string

            switch (mode) {
                case 'current-branch':
                    url = `${route}/branch/search`
                    break

                case 'current-user':
                    url = `${route}/current/search`
                    break

                case 'member-profile':
                    if (!memberProfileId) {
                        throw new Error(
                            'memberProfileId is required for member-profile mode'
                        )
                    }
                    url = `${route}/member-profile/${memberProfileId}/search`
                    break

                case 'employee':
                    if (!userId) {
                        throw new Error('userId is required for employee mode')
                    }
                    url = `${route}/employee/${userId}/search`
                    break

                case 'transaction-batch':
                    if (!transactionBatchId) {
                        throw new Error(
                            'transactionBatchId is required for transaction-batch mode'
                        )
                    }
                    url = `${route}/transaction-batch/${transactionBatchId}/search`
                    break

                default:
                    throw new Error(`Unsupported mode: ${mode}`)
            }

            return getPaginated({
                url,
                query,
            })
        },
    })
}

export const logger = Logger.getInstance('transactions')
