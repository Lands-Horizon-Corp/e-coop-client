import { useCallback } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

import { SHORTCUT_SCOPES } from '@/constants'
import { IGeneralLedger } from '@/modules/general-ledger'
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
import { useHotkeys } from 'react-hotkeys-hook'

import PageContainer from '@/components/containers/page-container'
import { ResetIcon } from '@/components/icons'
import { useShortcutContext } from '@/components/shorcuts/general-shortcuts-wrapper'
import { Button } from '@/components/ui/button'

import { useSubscribe } from '@/hooks/use-pubsub'
import { useQeueryHookCallback } from '@/hooks/use-query-hook-cb'

import { TEntityId } from '@/types'

import PaymentWithTransactionForm from '../components/forms/create-payment-with-transaction-form'
import TransactionReverseRequestFormModal from '../components/modals/transaction-modal-request-reverse'
import TransactionAccountMemberLedger from '../components/tables/transaction-account-member-ledger'

type TTransactionProps = {
    transactionId: TEntityId
    fullPath: string
}

const Transaction = ({ transactionId, fullPath }: TTransactionProps) => {
    const queryClient = useQueryClient()
    const { hasNoTransactionBatch } = useTransactionBatchStore()
    const { modalData, isOpen, onClose } = useTransactionReverseSecurityStore()
    const { setActiveScope } = useShortcutContext()

    const {
        selectedMember,
        openSuccessModal,
        transactionFormSuccess,
        handleResetAll,
        setSelectedMember,
        setOpenSuccessModal,
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

    useHotkeys(
        'Escape',
        (e) => {
            e.preventDefault()
            handleResetAll()
            handleSetTransactionId({ fullPath })
        },
        {
            scopes: [SHORTCUT_SCOPES.PAYMENT],
            enableOnFormTags: ['INPUT', 'SELECT', 'TEXTAREA'],
        }
    )

    useHotkeys('Enter', (e) => {
        e.preventDefault()
        if (!selectedMember) {
            setOpenMemberPicker(true)
        }
    })

    return (
        <div
            onClick={() => {
                setActiveScope(SHORTCUT_SCOPES.PAYMENT)
            }}
        >
            <TransactionReverseRequestFormModal
                formProps={{
                    onSuccess: () => {
                        toast.success('success request verification')
                        modalData?.onSuccess?.()
                    },
                }}
                onOpenChange={onClose}
                open={isOpen}
                title={modalData?.title || 'Request Reverse Transaction'}
            />
            <PageContainer className="flex h-fit lg:h-[90vh] w-full !overflow-hidden">
                <div className="w-full flex justify-end pb-2">
                    <TransactionHistory fullPath={fullPath} />
                </div>
                <TransactionModalSuccessPayment
                    isOpen={openSuccessModal}
                    onClose={handleCloseSuccessModal}
                    onOpenChange={setOpenSuccessModal}
                    open={openSuccessModal}
                    transaction={transactionFormSuccess}
                />
                <TransactionMemberScanner
                    className="p-2"
                    fullPath={fullPath}
                    handleSetTransactionId={() =>
                        handleSetTransactionId({
                            transactionId: undefined,
                            fullPath,
                        })
                    }
                    transactionId={transactionId}
                />
                <div className="flex h-full flex-col lg:flex-row  w-full gap-2 overflow-hidden">
                    {/* Left Section (Payment) */}
                    <div className="w-full lg:w-[40%] ecoop-scroll flex flex-col py-2 overflow-y-auto">
                        <TransactionCurrentPaymentEntry
                            totalAmount={transaction?.amount}
                            transactionId={transactionId}
                        />
                        {hasSelectedTransactionId && (
                            <Button
                                className="w-full mb-2"
                                onClick={(e) => {
                                    e.preventDefault()
                                    handleResetAll()
                                    handleSetTransactionId({ fullPath })
                                }}
                                size="sm"
                                variant="outline"
                            >
                                <ResetIcon className="mr-2" />
                                reset current transaction
                            </Button>
                        )}
                    </div>
                    {/* Right Section (Ledger Table) */}
                    <div className="flex-1 w-full flex flex-col p-2 rounded-2xl bg-background ecoop-scroll overflow-y-auto">
                        <TransactionAccountMemberLedger
                            memberProfileId={selectedMember?.id as TEntityId}
                            onRowClick={(data) => {
                                setSelectedAccountId(data.original.account_id)
                                setSelectedAccount(data.original.account)
                            }}
                        />
                    </div>
                </div>
                {/* bottom Section (transaction  Payment) */}
            </PageContainer>
            {selectedMember && (
                <PaymentWithTransactionForm
                    memberJointId={selectedJointMember?.id}
                    memberProfileId={selectedMember?.id}
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
                            queryKey: ['transaction'],
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
                        setActiveScope(SHORTCUT_SCOPES.PAYMENT)
                    }}
                    readOnly={!hasNoTransactionBatch}
                    transactionId={transactionId}
                />
            )}
        </div>
    )
}
export default Transaction
