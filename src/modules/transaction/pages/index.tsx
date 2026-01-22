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
    TransactionFromSchema,
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

const Transaction = ({ transactionId, fullPath }: TTransactionProps) => {
    const queryClient = useQueryClient()

    const { hasNoTransactionBatch, data: currentTransactionBatch } =
        useTransactionBatchStore()

    const { modalData, isOpen, onClose } = useTransactionReverseSecurityStore()

    const { payment_or_allow_user_input, userOrganization, ORWithPadding } =
        useGetUserSettings()
    const {
        openSuccessModal,
        transactionFormSuccess,
        setOpenSuccessModal,
        setSelectedAccountId,
        setTransactionFormSuccess,
        setOpenMemberPicker,
    } = useTransactionStore()

    const transactionForm = useForm<z.infer<typeof TransactionFromSchema>>({
        resolver: standardSchemaResolver(TransactionFromSchema),
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
            transactionForm.setValue('member_profile', data?.member_profile)
        },
        [transactionForm]
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

    const selectedMember = transactionForm.getValues('member_profile')
    const selectedMemberId = transactionForm.getValues('member_profile_id')

    useSubscribe(
        `member_occupation_history.create.member_profile.${selectedMember}`
    )
    useSubscribe(
        `member_occupation_history.update.member_profile.${selectedMember}`
    )
    useSubscribe(
        `member_occupation_history.delete.member_profile.${selectedMember}`
    )
    useSubscribe(`transaction.create.${transactionId}`)
    useSubscribe(`transaction.update.${transactionId}`)

    const handleOnSuccessPaymentCallBack = (transaction: IGeneralLedger) => {
        if (!transaction) return

        setTransactionFormSuccess(transaction)
        setOpenSuccessModal(true)
        setSelectedAccountId(undefined)

        transactionForm.reset(
            {
                ...transactionForm.getValues(),
                member_profile: transaction.member_profile,
                member_profile_id: transaction.member_profile_id,
                reference_number: transaction.reference_number,
            },
            {
                keepDirty: false,
                keepTouched: false,
            }
        )
    }

    const hasSelectedTransactionId = !!transactionId
    useHotkeys(
        'Escape',
        (e) => {
            e.preventDefault()
            e.stopPropagation()
            handleSetTransactionId({ fullPath })

            transactionForm.reset({
                member_join: undefined,
                member_profile: undefined,
                member_profile_id: undefined,
            })
            transactionForm.setValue(
                'reference_number',
                paymentORResolver(userOrganization)
            )
            transactionForm.setValue(
                'or_auto_generated',
                !payment_or_allow_user_input
            )
            if (payment_or_allow_user_input) {
                transactionForm.setValue('reference_number', ORWithPadding)
            }
        },
        {
            enableOnFormTags: true,
        },
        [transactionForm, userOrganization]
    )

    useHotkeys(
        'Enter',
        (e) => {
            e.preventDefault()
            const hasMember = !!transactionForm.getValues('member_profile_id')
            if (hasMember) return
            setOpenMemberPicker(true)
        },
        { enabled: !openSuccessModal, enableOnFormTags: false }
    )

    useHotkeys(
        'alt + W',
        (e) => {
            e.preventDefault()
            transactionForm.setFocus('reference_number')
        },
        { enableOnFormTags: true },
        []
    )
    useHotkeys(
        'alt + E',
        (e) => {
            e.preventDefault()
            transactionForm.setValue('or_auto_generated', true)
            transactionForm.setValue(
                'reference_number',
                paymentORResolver(userOrganization)
            )
        },
        { enableOnFormTags: true },
        []
    )

    const isTransactionMismatchCurrentBatch = !transaction
        ? false
        : currentTransactionBatch?.id !== transaction?.transaction_batch_id

    useEffect(() => {
        if (!payment_or_allow_user_input) {
            transactionForm.setValue('or_auto_generated', true)
            transactionForm.setValue(
                'reference_number',
                paymentORResolver(userOrganization)
            )
        } else {
            transactionForm.setValue('reference_number', ORWithPadding)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
            <PageContainer className="flex h-fit lg:h-[90vh] w-full overflow-hidden!">
                <TransactionModalSuccessPayment
                    isOpen={openSuccessModal}
                    onClose={handleCloseSuccessModal}
                    onOpenChange={setOpenSuccessModal}
                    open={openSuccessModal}
                    transaction={transactionFormSuccess}
                />

                <div className="flex h-full flex-col lg:flex-row w-full gap-2 overflow-hidden">
                    {/* Left Section (Payment) */}
                    <div className="w-full lg:w-[40%] ecoop-scroll pr-px flex flex-col overflow-y-auto">
                        <TransactionCurrentPaymentEntry
                            form={transactionForm}
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
                    <div className="flex-1 flex flex-col p-2 rounded-2xl bg-background ecoop-scroll overflow-y-auto">
                        <TransactionMemberScanner
                            className="p-2"
                            form={transactionForm}
                            fullPath={fullPath}
                            handleRemoveMember={() => {
                                handleSetTransactionId({
                                    transactionId: undefined,
                                    fullPath,
                                })
                                transactionForm.reset()
                            }}
                            transactionId={transactionId}
                        />
                        <TransactionAccountMemberLedger
                            memberProfileId={selectedMemberId as TEntityId}
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

                                transactionForm.setValue(
                                    'account',
                                    data.original.account
                                )
                                transactionForm.setValue(
                                    'account_id',
                                    data.original.account_id
                                )
                            }}
                        />
                    </div>
                </div>
                {/* bottom Section (transaction  Payment) */}
            </PageContainer>
            {selectedMemberId && !isTransactionMismatchCurrentBatch && (
                <PaymentWithTransactionForm
                    currentTransactionBatch={currentTransactionBatch}
                    handleResetTransaction={() => {
                        handleSetTransactionId({ fullPath })
                    }}
                    memberJointId={transactionForm.getValues('member_join_id')}
                    memberProfileId={transactionForm.getValues(
                        'member_profile_id'
                    )}
                    onSuccess={(transaction) => {
                        queryClient.invalidateQueries({
                            queryKey: [
                                'member-accounting-ledger',
                                'filtered-paginated',
                                'member',
                                selectedMemberId,
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
                    transaction={transaction}
                    transactionForm={transactionForm}
                    transactionId={transactionId}
                />
            )}
        </div>
    )
}
export default Transaction
