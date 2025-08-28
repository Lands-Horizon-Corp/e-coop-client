import { useCallback } from 'react'

import { useNavigate } from '@tanstack/react-router'

import {
    ITransaction,
    TransactionActions,
    // TransactionCurrentPaymentEntry,
    TransactionForm,
    TransactionHistory,
    TransactionMemberProfile,
    TransactionModalSuccessPayment,
    TransactionNoFoundBatch,
    TransactionViewNoMemberSelected,
    useGetById,
} from '@/modules/transaction'
import { useTransactionBatchStore } from '@/modules/transaction-batch/store/transaction-batch-store'
import { useTransactionStore } from '@/store/transaction/transaction-store'

import PageContainer from '@/components/containers/page-container'
import { ResetIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable'

import { useSubscribe } from '@/hooks/use-pubsub'
import { useQeueryHookCallback } from '@/hooks/use-query-hook-cb'

import { TEntityId } from '@/types'

type TTransactionProps = {
    transactionId: TEntityId
    fullPath: string
}
const Transaction = ({ transactionId, fullPath }: TTransactionProps) => {
    const { data: transactionBatch } = useTransactionBatchStore()
    const navigate = useNavigate()
    const hasTransactionBatch = !!transactionBatch

    const {
        selectedMember,
        openSuccessModal,
        transactionFormSuccess,
        handleResetAll,
        setSelectedMember,
        setOpenSuccessModal,
        setFocusTypePayment,
        setOpenMemberPicker,
        // setSelectedAccountId,
        setTransactionFormSuccess,
        // setOpenPaymentWithTransactionModal,
        // setSelectedAccount,
    } = useTransactionStore()

    const { data: transaction } = useGetById({
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
        error: undefined,
        onSuccess: handleGetTransactionByIdSuccess,
    })

    const handleSetTransactionId = (transactionId?: TEntityId) => {
        navigate({
            to: fullPath,
            search: {
                transactionId: transactionId ?? '',
            },
        })
    }

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

    const hasSelectedMember = !!selectedMember
    const hasSelectedTransactionId = !!transactionId

    const disAbledActionButtons = !hasSelectedMember || !hasTransactionBatch

    return (
        <PageContainer className="flex h-[90vh] items-center w-full !overflow-y-hidden">
            <TransactionNoFoundBatch />
            <TransactionModalSuccessPayment
                open={openSuccessModal}
                onOpenChange={setOpenSuccessModal}
                transaction={transactionFormSuccess}
                onClose={handleCloseSuccessModal}
                isOpen={openSuccessModal}
            />
            <div className="flex h-full w-full over-flow-y-auto ">
                <ResizablePanelGroup
                    direction="vertical"
                    className="grow px-5 flex !overflow-y-auto"
                >
                    <ResizablePanel
                        defaultSize={50}
                        maxSize={50}
                        className="p-2 !h-fit !overflow-y-auto ecoop-scroll"
                    >
                        <div className="flex w-full bg-secondary/10 p-5 rounded-2xl flex-col gap-y-2">
                            <TransactionViewNoMemberSelected
                                onClick={(e) => {
                                    e.preventDefault()
                                    setOpenMemberPicker(true)
                                }}
                                disabledSelectTrigger={hasSelectedTransactionId}
                                isDisplay={!hasSelectedMember}
                            />
                            <TransactionMemberProfile
                                memberInfo={selectedMember}
                                onSelectMember={() => {
                                    setOpenMemberPicker(true)
                                }}
                                hasTransaction={hasSelectedTransactionId}
                            />
                            <TransactionForm
                                transactionId={transactionId}
                                hasSelectedTransactionId={
                                    hasSelectedTransactionId
                                }
                                handleSetTransactionId={handleSetTransactionId}
                                hasSelectedMember={hasSelectedMember}
                            />
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel className="p-2 h-full !overflow-y-auto ecoop-scroll">
                        <div className="w-full p-2">
                            {/* <MemberAccountingLedgerTable
                                mode="member"
                                memberProfileId={
                                    (selectedMember?.id ??
                                        undefined) as TEntityId
                                }
                                onRowClick={(data) => {
                                    setOpenPaymentWithTransactionModal(true)
                                    setSelectedAccountId(
                                        data.original.account_id
                                    )
                                    setSelectedAccount(data.original.account)
                                    setFocusTypePayment('payment')
                                }}
                                actionComponent={() => {
                                    return (
                                        <MemberAccountGeneralLedgerAction
                                            memberAccountLedger={
                                                props.row.original
                                            }
                                        />
                                    )
                                }}
                                className="w-full min-h-[40vh] h-full"
                            /> */}
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
                <div className="ecoop-scroll w-[40%] py-2">
                    <TransactionHistory fullPath={fullPath} />
                    <TransactionActions
                        paymentLabel="Add Payment"
                        paymentOnClick={() => {
                            setFocusTypePayment('payment')
                        }}
                        depositOnClick={() => {
                            setFocusTypePayment('deposit')
                        }}
                        withdrawOnClick={() => {
                            setFocusTypePayment('withdraw')
                        }}
                        PaymentButtonProps={{
                            disabled: disAbledActionButtons,
                        }}
                        DepositButtonProps={{
                            disabled: disAbledActionButtons,
                        }}
                        withdrawButtonProps={{
                            disabled: disAbledActionButtons,
                        }}
                    />
                    {hasSelectedTransactionId && (
                        <Button
                            size="sm"
                            variant={'secondary'}
                            onClick={(e) => {
                                e.preventDefault()
                                handleResetAll()
                                handleSetTransactionId(undefined)
                            }}
                            className="w-full mb-2"
                        >
                            <ResetIcon className="mr-2" />
                            reset current transaction
                        </Button>
                    )}
                    {/* <TransactionCurrentPaymentEntry
                        totalAmount={transaction?.amount}
                        transactionId={transactionId}
                    /> */}
                </div>
            </div>
        </PageContainer>
    )
}
export default Transaction
