import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'

import { withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import { createMutationHook } from './api-hook-factory'
import * as TransactionBatchService from '@/api-service/transaction-batch-service'

import {
    IAPIHook,
    TEntityId,
    IQueryProps,
    ITransactionBatch,
    IBatchFundingRequest,
    ITransactionBatchMinimal,
    TTransactionBatchFullorMin,
    ITransactionBatchEndRequest,
    ITransactionBatchSignatures,
    ITransactionBatchDepositInBankRequest,
} from '@/types'

export const useCurrentTransactionBatch = ({
    enabled,
    showMessage = true,
}: IAPIHook<TTransactionBatchFullorMin, string> & IQueryProps = {}) => {
    return useQuery<TTransactionBatchFullorMin, string>({
        queryKey: ['transaction-batch', 'current'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                TransactionBatchService.currentTransactionBatch()
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
    })
}

export const useTransactionBatch = ({
    id,
    enabled,
    showMessage = true,
}: IAPIHook<ITransactionBatch, string> & IQueryProps & { id: TEntityId }) => {
    return useQuery<ITransactionBatch, string>({
        queryKey: ['transaction-batch', id],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                TransactionBatchService.getTransactionBatchById(id)
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
    })
}

export const useCreateTransactionBatch = createMutationHook<
    ITransactionBatchMinimal,
    string,
    Omit<IBatchFundingRequest, 'transaction_batch_id'>
>((variables) => TransactionBatchService.createTransactionBatch(variables))

export const useTransactionBatchRequestBlotterView = createMutationHook<
    ITransactionBatchMinimal,
    string,
    TEntityId
>(
    (id) => TransactionBatchService.requestTransactionBatchBlotterView(id),
    'Requested batch view'
)

export const useTransactionBatchSetDepositInBank = createMutationHook<
    ITransactionBatchMinimal | ITransactionBatch,
    string,
    { id: TEntityId; data: ITransactionBatchDepositInBankRequest }
>(
    ({ id, data }) => TransactionBatchService.setDepositInBank(id, data),
    'Deposit in bank Saved'
)

export const useTransactionBatchEndCurrentBatch = createMutationHook<
    TTransactionBatchFullorMin,
    string,
    ITransactionBatchEndRequest
>(
    (data) => TransactionBatchService.endCurrentBatch(data),
    'Transaction Batch Ended'
)

// GET ALL TRANSACTION BATCH BLOTTER VIEW REQUEST
export const useTransactionBatchBlotterViewRequests = ({
    enabled,
    showMessage = true,
}: IAPIHook<ITransactionBatch, string> & IQueryProps = {}) => {
    return useQuery({
        queryKey: ['transaction-batch', 'view-requests'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                TransactionBatchService.getAllTransactionBatchViewRequest()
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
        initialData: [],
    })
}

// APPROVE A SPECIFIC TRANSACTION BATCH BLOTTER VIEW
export const useTransactionBatchAcceptBlotterView = createMutationHook<
    ITransactionBatch,
    string,
    TEntityId
>((id) => TransactionBatchService.allowBlotterView(id), 'Batch view allowed')

// GET ALL ENDED BATCH
export const useTransactionBatchEndApprovals = ({
    enabled,
    showMessage = true,
}: IAPIHook<ITransactionBatch[], string> & IQueryProps = {}) => {
    return useQuery({
        queryKey: ['transaction-batch', 'end-approvals'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                TransactionBatchService.getAllTransactionBatchViewRequest()
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
        initialData: [],
        // initialData: [
        //     {
        //         id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
        //         organization_id: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
        //         organization: {
        //             id: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
        //             name: 'Org One',
        //         },
        //         branch_id: 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f',
        //         branch: {
        //             id: 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f',
        //             name: 'Branch Alpha',
        //         },
        //         employee_user_id: 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a',
        //         employee_user: {
        //             id: 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a',
        //             username: 'user1',
        //         },
        //         batch_name: 'Batch 1',
        //         beginning_balance: 10000,
        //         deposit_in_bank: 2000,
        //         cash_count_total: 8000,
        //         grand_total: 10000,
        //         total_cash_collection: 5000,
        //         total_deposit_entry: 3000,
        //         petty_cash: 200,
        //         loan_releases: 100,
        //         time_deposit_withdrawal: 150,
        //         savings_withdrawal: 250,
        //         total_cash_handled: 9000,
        //         total_supposed_remitance: 9500,
        //         total_cash_on_hand: 500,
        //         total_check_remittance: 1000,
        //         total_online_remittance: 500,
        //         total_deposit_in_bank: 2000,
        //         total_actual_remittance: 9500,
        //         total_actual_supposed_comparison: 0,
        //         description: 'End of day batch 1',
        //         can_view: false,
        //         request_view: new Date().toISOString(),
        //         is_closed: true,
        //         ended_at: new Date().toISOString(),
        //         total_batch_time: '8h',
        //     },
        //     {
        //         id: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
        //         organization_id: 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f',
        //         organization: {
        //             id: 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f',
        //             name: 'Org Two',
        //         },
        //         branch_id: 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a',
        //         branch: {
        //             id: 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a',
        //             name: 'Branch Beta',
        //         },
        //         employee_user_id: 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b',
        //         employee_user: {
        //             id: 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b',
        //             username: 'user2',
        //         },
        //         batch_name: 'Batch 2',
        //         beginning_balance: 12000,
        //         deposit_in_bank: 2500,
        //         cash_count_total: 9500,
        //         grand_total: 12000,
        //         total_cash_collection: 6000,
        //         total_deposit_entry: 3500,
        //         petty_cash: 300,
        //         loan_releases: 200,
        //         time_deposit_withdrawal: 100,
        //         savings_withdrawal: 400,
        //         total_cash_handled: 11000,
        //         total_supposed_remitance: 11500,
        //         total_cash_on_hand: 500,
        //         total_check_remittance: 1200,
        //         total_online_remittance: 800,
        //         total_deposit_in_bank: 2500,
        //         total_actual_remittance: 11500,
        //         total_actual_supposed_comparison: 0,
        //         description: 'End of day batch 2',
        //         can_view: false,
        //         request_view: new Date().toISOString(),
        //         is_closed: true,
        //         ended_at: new Date().toISOString(),
        //         total_batch_time: '7h',
        //     },
        //     {
        //         id: 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f',
        //         organization_id: 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a',
        //         organization: {
        //             id: 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a',
        //             name: 'Org Three',
        //         },
        //         branch_id: 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b',
        //         branch: {
        //             id: 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b',
        //             name: 'Branch Gamma',
        //         },
        //         employee_user_id: 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c',
        //         employee_user: {
        //             id: 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c',
        //             username: 'user3',
        //         },
        //         batch_name: 'Batch 3',
        //         beginning_balance: 9000,
        //         deposit_in_bank: 1800,
        //         cash_count_total: 7200,
        //         grand_total: 9000,
        //         total_cash_collection: 4000,
        //         total_deposit_entry: 2500,
        //         petty_cash: 150,
        //         loan_releases: 120,
        //         time_deposit_withdrawal: 80,
        //         savings_withdrawal: 200,
        //         total_cash_handled: 8000,
        //         total_supposed_remitance: 8800,
        //         total_cash_on_hand: 400,
        //         total_check_remittance: 900,
        //         total_online_remittance: 600,
        //         total_deposit_in_bank: 1800,
        //         total_actual_remittance: 8800,
        //         total_actual_supposed_comparison: 0,
        //         description: 'End of day batch 3',
        //         can_view: false,
        //         request_view: new Date().toISOString(),
        //         is_closed: true,
        //         ended_at: new Date().toISOString(),
        //         total_batch_time: '6h',
        //     },
        //     {
        //         id: 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a',
        //         organization_id: 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b',
        //         organization: {
        //             id: 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b',
        //             name: 'Org Four',
        //         },
        //         branch_id: 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c',
        //         branch: {
        //             id: 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c',
        //             name: 'Branch Delta',
        //         },
        //         employee_user_id: 'a7b8c9d0-e1f2-4a3b-5c6d-7e8f9a0b1c2d',
        //         employee_user: {
        //             id: 'a7b8c9d0-e1f2-4a3b-5c6d-7e8f9a0b1c2d',
        //             username: 'user4',
        //         },
        //         batch_name: 'Batch 4',
        //         beginning_balance: 15000,
        //         deposit_in_bank: 3000,
        //         cash_count_total: 12000,
        //         grand_total: 15000,
        //         total_cash_collection: 7000,
        //         total_deposit_entry: 5000,
        //         petty_cash: 400,
        //         loan_releases: 250,
        //         time_deposit_withdrawal: 200,
        //         savings_withdrawal: 350,
        //         total_cash_handled: 14000,
        //         total_supposed_remitance: 14700,
        //         total_cash_on_hand: 300,
        //         total_check_remittance: 1500,
        //         total_online_remittance: 800,
        //         total_deposit_in_bank: 3000,
        //         total_actual_remittance: 14700,
        //         total_actual_supposed_comparison: 0,
        //         description: 'End of day batch 4',
        //         can_view: false,
        //         request_view: new Date().toISOString(),
        //         is_closed: true,
        //         ended_at: new Date().toISOString(),
        //         total_batch_time: '9h',
        //     },
        //     {
        //         id: 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b',
        //         organization_id: 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c',
        //         organization: {
        //             id: 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c',
        //             name: 'Org Five',
        //         },
        //         branch_id: 'a7b8c9d0-e1f2-4a3b-5c6d-7e8f9a0b1c2d',
        //         branch: {
        //             id: 'a7b8c9d0-e1f2-4a3b-5c6d-7e8f9a0b1c2d',
        //             name: 'Branch Epsilon',
        //         },
        //         employee_user_id: 'b8c9d0e1-f2a3-4b5c-6d7e-8f9a0b1c2d3e',
        //         employee_user: {
        //             id: 'b8c9d0e1-f2a3-4b5c-6d7e-8f9a0b1c2d3e',
        //             username: 'user5',
        //         },
        //         batch_name: 'Batch 5',
        //         beginning_balance: 8000,
        //         deposit_in_bank: 1000,
        //         cash_count_total: 7000,
        //         grand_total: 8000,
        //         total_cash_collection: 3500,
        //         total_deposit_entry: 2000,
        //         petty_cash: 100,
        //         loan_releases: 80,
        //         time_deposit_withdrawal: 60,
        //         savings_withdrawal: 120,
        //         total_cash_handled: 7500,
        //         total_supposed_remitance: 7900,
        //         total_cash_on_hand: 100,
        //         total_check_remittance: 400,
        //         total_online_remittance: 300,
        //         total_deposit_in_bank: 1000,
        //         total_actual_remittance: 7900,
        //         total_actual_supposed_comparison: 0,
        //         description: 'End of day batch 5',
        //         can_view: false,
        //         request_view: new Date().toISOString(),
        //         is_closed: true,
        //         ended_at: new Date().toISOString(),
        //         total_batch_time: '5h',
        //     },
        // ],
    })
}

export const useTransBatchUpdateSignApproval = createMutationHook<
    ITransactionBatch,
    string,
    { id: TEntityId; data: ITransactionBatchSignatures }
>(
    ({ id, data }) =>
        TransactionBatchService.updateEndedBatchApprovals(id, data),
    'Approval & Signature Saved!'
)
