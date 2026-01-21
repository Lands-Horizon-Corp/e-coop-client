import { useCallback, useEffect } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { IGeneralLedger } from '@/modules/general-ledger'
import {
    ITransaction,
    TransactionCurrentPaymentEntry,
    TransactionModalSuccessPayment,
    useGetTransactionById,
} from '@/modules/transaction'
import { useTransactionBatchStore } from '@/modules/transaction-batch/store/transaction-batch-store'
import TransactionMemberScanner from '@/modules/transaction/components/transaction-member-scanner'
import { useGetUserSettings } from '@/modules/user-profile'
import { useTransactionReverseSecurityStore } from '@/store/transaction-reverse-security-store'
import { useTransactionStore } from '@/store/transaction/transaction-store'
import { useHotkeys } from 'react-hotkeys-hook'

import PageContainer from '@/components/containers/page-container'
import { ResetIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'

import { useSubscribe } from '@/hooks/use-pubsub'
import { useQeueryHookCallback } from '@/hooks/use-query-hook-cb'

import { TEntityId } from '@/types'

import PaymentWithTransactionForm from '../components/forms/create-payment-with-transaction-form'
import TransactionReverseRequestFormModal from '../components/modals/transaction-modal-request-reverse'
import TransactionAccountMemberLedger from '../components/tables/transaction-account-member-ledger'
import { paymentORResolver } from '../transaction.utils'

type TTransactionProps = {
    transactionId: TEntityId
    fullPath: string
}

export const ReferenceNumberSchema = z.object({
    reference_number: z.string().min(1, 'Reference number is required'),
    or_auto_generated: z.boolean().optional(),
})

const Transaction = ({ transactionId, fullPath }: TTransactionProps) => {
    const queryClient = useQueryClient()

    const { hasNoTransactionBatch, data: currentTransactionBatch } =
        useTransactionBatchStore()

    const { modalData, isOpen, onClose } = useTransactionReverseSecurityStore()

    const { payment_or_allow_user_input, userOrganization } =
        useGetUserSettings()

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

    const referenceNumberForm = useForm<z.infer<typeof ReferenceNumberSchema>>({
        resolver: standardSchemaResolver(ReferenceNumberSchema),
        defaultValues: {
            reference_number: paymentORResolver(userOrganization),
            or_auto_generated: false,
        },
    })

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
    } = useGetTransactionById({
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
            e.stopPropagation()
            handleResetAll()
            handleSetTransactionId({ fullPath })
            referenceNumberForm.setValue(
                'reference_number',
                paymentORResolver(userOrganization)
            )
            referenceNumberForm.clearErrors('reference_number')
        },
        [referenceNumberForm]
    )

    useHotkeys('Enter', (e) => {
        e.preventDefault()
        if (!selectedMember) {
            setOpenMemberPicker(true)
        }
    })

    const isTransactionMismatchCurrentBatch = !transaction
        ? false
        : currentTransactionBatch?.id !== transaction?.transaction_batch_id

    useEffect(() => {
        if (!payment_or_allow_user_input) {
            referenceNumberForm.setValue('or_auto_generated', true)
            referenceNumberForm.setValue(
                'reference_number',
                paymentORResolver(userOrganization)
            )
        }
    }, [referenceNumberForm, payment_or_allow_user_input])

    // useEffect(() => {

    //     if (referenceNumber === resolvedOR) {
    //         return
    //     }

    //     const timeoutId = setTimeout(() => {
    //         onOpen({
    //             title: 'Reference Number Changed',
    //             description: 'Confirm to reset and create new Transaction.',
    //             onConfirm: () => {
    //                 handleResetAll()
    //                 handleSetTransactionId({fullPath})
    //             },
    //         })
    //     }, 1500)

    //     return () => {
    //         clearTimeout(timeoutId)
    //     }
    // }, [userOrganization, referenceNumberForm.watch('reference_number')])

    return (
        <div>
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
            {/* {selectedMember && (
                <LoanPicker
                    memberProfileId={selectedMember.id}
                    modalState={loanPickerState}
                    mode="member-profile"
                    triggerClassName="hidden"
                />
            )} */}
            <PageContainer className="flex h-fit lg:h-[90vh] w-full !overflow-hidden">
                <TransactionModalSuccessPayment
                    isOpen={openSuccessModal}
                    onClose={handleCloseSuccessModal}
                    onOpenChange={setOpenSuccessModal}
                    open={openSuccessModal}
                    transaction={transactionFormSuccess}
                />

                <div className="flex h-full flex-col lg:flex-row w-full gap-2 overflow-hidden">
                    {/* Left Section (Payment) */}
                    <div className="w-full lg:w-[40%] ecoop-scroll pr-[1px] flex flex-col overflow-y-auto">
                        <TransactionCurrentPaymentEntry
                            form={referenceNumberForm}
                            fullPath={fullPath}
                            totalAmount={transaction?.amount}
                            transaction={transaction as ITransaction}
                            transactionId={transactionId}
                        />
                        {hasSelectedTransactionId && (
                            <Button
                                className="w-full mb-2"
                                onClick={(e) => {
                                    e.preventDefault()
                                    handleResetAll()
                                    handleSetTransactionId({ fullPath })
                                    queryClient.resetQueries({
                                        queryKey: ['transaction'],
                                    })
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
                        <TransactionMemberScanner
                            className="p-2"
                            fullPath={fullPath}
                            handleRemoveMember={() =>
                                handleSetTransactionId({
                                    transactionId: undefined,
                                    fullPath,
                                })
                            }
                            transactionId={transactionId}
                        />
                        <TransactionAccountMemberLedger
                            memberProfileId={selectedMember?.id as TEntityId}
                            onRowClick={(data) => {
                                if (!currentTransactionBatch) {
                                    return toast.warning(
                                        'You do not have an active transaction batch. Please create a transaction batch to proceed.'
                                    )
                                }

                                // if (data.original.account?.type === 'Loan') {
                                //     return loanPickerState.onOpenChange(true)
                                // }

                                if (
                                    data.original.account.currency_id !==
                                    currentTransactionBatch?.currency_id
                                ) {
                                    return toast.warning(
                                        'The account currency does not match the current transaction batch currency.'
                                    )
                                }

                                setSelectedAccountId(data.original.account_id)
                                setSelectedAccount(data.original.account)
                            }}
                        />
                    </div>
                </div>
                {/* bottom Section (transaction  Payment) */}
            </PageContainer>
            {selectedMember && !isTransactionMismatchCurrentBatch && (
                <PaymentWithTransactionForm
                    currentTransactionBatch={currentTransactionBatch}
                    handleResetTransaction={() => {
                        handleSetTransactionId({ fullPath })
                    }}
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
                    }}
                    readOnly={!hasNoTransactionBatch}
                    referenceNumberForm={referenceNumberForm}
                    transaction={transaction}
                    transactionId={transactionId}
                />
            )}
        </div>
    )
}
export default Transaction
