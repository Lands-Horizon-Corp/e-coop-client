import { useCallback } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

import { IGeneralLedger } from '@/modules/general-ledger'
import MemberAccountingLedgerTable from '@/modules/member-accounting-ledger/components/member-accounting-ledger-table'
import MemberAccountGeneralLedgerAction from '@/modules/member-accounting-ledger/components/member-accounting-ledger-table/member-account-general-ledger-table/actions'
import {
    ITransaction,
    TransactionCurrentPaymentEntry,
    TransactionHistory,
    TransactionModalSuccessPayment,
    useGetById,
} from '@/modules/transaction'
import { useTransactionBatchStore } from '@/modules/transaction-batch/store/transaction-batch-store'
import TransactionMemberScanner from '@/modules/transaction/components/transaction-member-scanner'
import { useTransactionReverseSecurityStore } from '@/store/transaction-reverse-security-store'
import { useTransactionStore } from '@/store/transaction/transaction-store'
import { HotkeysProvider, useHotkeys } from 'react-hotkeys-hook'

import PageContainer from '@/components/containers/page-container'
import { ResetIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'

import { useSubscribe } from '@/hooks/use-pubsub'
import { useQeueryHookCallback } from '@/hooks/use-query-hook-cb'
import { useShortcut } from '@/hooks/use-shorcuts'

import { TEntityId } from '@/types'

import PaymentWithTransactionForm from '../components/forms/create-payment-with-transaction-form'
import TransactionReverseRequestFormModal from '../components/modals/transaction-modal-request-reverse'

type TTransactionProps = {
    transactionId: TEntityId
    fullPath: string
}
const Transaction = ({ transactionId, fullPath }: TTransactionProps) => {
    const queryClient = useQueryClient()
    const { hasNoTransactionBatch } = useTransactionBatchStore()
    const { modalData, isOpen, onClose } = useTransactionReverseSecurityStore()
    const {
        selectedMember,
        openSuccessModal,
        transactionFormSuccess,
        handleResetAll,
        setSelectedMember,
        setOpenSuccessModal,
        setFocusTypePayment,
        setSelectedAccountId,
        setTransactionFormSuccess,
        setOpenPaymentWithTransactionModal,
        setSelectedAccount,
        selectedJointMember,
        setOpenMemberPicker,
    } = useTransactionStore()
    const navigate = useNavigate()

    const handleSetTransactionId = ({
        transactionId,
        fullPath,
    }: {
        transactionId?: TEntityId
        fullPath: string
    }) => {
        navigate({
            to: fullPath,
            search: {
                transactionId: transactionId ?? '',
            },
        })
    }

    const {
        data: transaction,
        isError,
        isSuccess,
        error,
    } = useGetById({
        id: transactionId,
        options: {
            enabled: !!transactionId,
        },
    })

    const handleGetTransactionByIdSuccess = useCallback(
        (data: ITransaction) => {
            setSelectedMember(data?.member_profile)
        },
        [setSelectedMember]
    )

    useQeueryHookCallback({
        data: transaction,
        error: error,
        isError: isError,
        isSuccess: isSuccess,
        onSuccess: handleGetTransactionByIdSuccess,
    })

    const handleCloseSuccessModal = () => {
        setOpenSuccessModal(false)
        setTransactionFormSuccess(null)
    }

    useSubscribe(
        `member_occupation_history.create.member_profile.${selectedMember?.id}`
    )
    useSubscribe(
        `member_occupation_history.update.member_profile.${selectedMember?.id}`
    )
    useSubscribe(
        `member_occupation_history.delete.member_profile.${selectedMember?.id}`
    )
    useSubscribe(`transaction.create.${transactionId}`)
    useSubscribe(`transaction.update.${transactionId}`)

    const handleOnSuccessPaymentCallBack = (transaction: IGeneralLedger) => {
        setTransactionFormSuccess(transaction)
        setOpenSuccessModal(true)
        setOpenPaymentWithTransactionModal(false)
        setSelectedMember(transaction.member_profile)
        setSelectedAccountId(undefined)
    }

    const hasSelectedTransactionId = !!transactionId

    useShortcut(
        'Escape',
        (e) => {
            e.preventDefault()
            handleResetAll()
            handleSetTransactionId({ fullPath })
        },
        {
            disableActiveButton: true,
            disableTextInputs: true,
        }
    )

    useHotkeys('Enter', (e) => {
        e.preventDefault()
        if (!selectedMember) {
            setOpenMemberPicker(true)
        }
    })
    return (
        <>
            <TransactionReverseRequestFormModal
                open={isOpen}
                onOpenChange={onClose}
                title={modalData?.title || 'Request Reverse Transaction'}
                formProps={{
                    onSuccess: () => {
                        toast.success('success request verification')
                        modalData?.onSuccess?.()
                    },
                }}
            />

            <PageContainer className="flex h-fit lg:h-[90vh] w-full !overflow-hidden">
                <div className="w-full flex justify-end pb-2">
                    <TransactionHistory fullPath={fullPath} />
                </div>
                <TransactionModalSuccessPayment
                    open={openSuccessModal}
                    onOpenChange={setOpenSuccessModal}
                    transaction={transactionFormSuccess}
                    onClose={handleCloseSuccessModal}
                    isOpen={openSuccessModal}
                />
                <HotkeysProvider
                    initiallyActiveScopes={['member-scanner-view']}
                >
                    <TransactionMemberScanner
                        fullPath={fullPath}
                        handleSetTransactionId={() =>
                            handleSetTransactionId({
                                transactionId: undefined,
                                fullPath,
                            })
                        }
                        className="p-2"
                        transactionId={transactionId}
                    />
                </HotkeysProvider>
                <div className="flex h-full flex-col lg:flex-row  w-full gap-2 overflow-hidden">
                    {/* Left Section (Payment) */}
                    <div className="w-full lg:w-[40%] ecoop-scroll flex flex-col py-2 overflow-y-auto">
                        <TransactionCurrentPaymentEntry
                            totalAmount={transaction?.amount}
                            transactionId={transactionId}
                        />
                        {hasSelectedTransactionId && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                    e.preventDefault()
                                    handleResetAll()
                                    handleSetTransactionId({ fullPath })
                                }}
                                className="w-full mb-2"
                            >
                                <ResetIcon className="mr-2" />
                                reset current transaction
                            </Button>
                        )}
                    </div>
                    {/* Right Section (Ledger Table) */}
                    <div className="flex-1 w-full flex flex-col p-2 rounded-2xl bg-background ecoop-scroll overflow-y-auto">
                        <MemberAccountingLedgerTable
                            mode="member"
                            memberProfileId={
                                (selectedMember?.id ?? undefined) as TEntityId
                            }
                            onRowClick={(data) => {
                                setOpenPaymentWithTransactionModal(true)
                                setSelectedAccountId(data.original.account_id)
                                setSelectedAccount(data.original.account)
                                setFocusTypePayment('payment')
                            }}
                            actionComponent={(props) => (
                                <MemberAccountGeneralLedgerAction
                                    memberAccountLedger={props.row.original}
                                />
                            )}
                            className="w-full min-h-[40vh] h-full"
                        />
                    </div>
                </div>
                {/* bottom Section (transaction  Payment) */}
            </PageContainer>
            {selectedMember && (
                <HotkeysProvider initiallyActiveScopes={['transaction']}>
                    <PaymentWithTransactionForm
                        readOnly={!hasNoTransactionBatch}
                        transactionId={transactionId}
                        memberProfileId={selectedMember?.id}
                        memberJointId={selectedJointMember?.id}
                        onSuccess={(transaction) => {
                            queryClient.invalidateQueries({
                                queryKey: [
                                    'member-accounting-ledger',
                                    'filtered-paginated',
                                    'member',
                                    selectedMember?.id,
                                ],
                            })
                            queryClient.invalidateQueries({
                                queryKey: ['transaction', 'current-user'],
                            })
                            queryClient.invalidateQueries({
                                queryKey: [
                                    'general-ledger',
                                    'filtered-paginated',
                                    'transaction',
                                ],
                                exact: false,
                            })
                            handleSetTransactionId({
                                transactionId: transaction.transaction_id,
                                fullPath,
                            })
                            handleOnSuccessPaymentCallBack(transaction)
                        }}
                    />
                </HotkeysProvider>
            )}
        </>
    )
}
export default Transaction
