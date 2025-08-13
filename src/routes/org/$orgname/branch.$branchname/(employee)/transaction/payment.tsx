import { useTransactionBatchStore } from '@/store/transaction-batch-store'
import { useTransactionStore } from '@/store/transaction/transaction-store'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import { ResetIcon } from '@/components/icons'
import MemberAccountingLedgerTable from '@/components/tables/ledgers-tables/member-accounting-ledger-table'
import MemberAccountGeneralLedgerAction from '@/components/tables/ledgers-tables/member-accounting-ledger-table/member-account-general-ledger-table/actions'
import { Button } from '@/components/ui/button'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable'

import { useGetTransactionById } from '@/hooks/api-hooks/use-transaction'
import { useSubscribe } from '@/hooks/use-pubsub'

import { TEntityId } from '@/types'

import CurrentPaymentsEntry from './-components/current-payments-entry'
import TransactionCardList from './-components/current-transaction-history'
import MemberProfileTransactionView from './-components/member-profile-view-card'
import NoMemberSelectedView from './-components/no-member-selected-view'
import NoTransactionBatchWarningModal from './-components/no-transaction-batch'
import PaymentSuccessModal from './-components/payment-success-modal'
import TransactionForm from './-components/tansaction-form'
import TransactionActions from './-components/transaction-actions'

type TransactionSearch = {
    transactionId: TEntityId
}

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/transaction/payment'
)({
    validateSearch: (search: Record<string, unknown>): TransactionSearch => {
        return {
            transactionId: String(search?.transactionId ?? ''),
        }
    },
    component: RouteComponent,
})

function RouteComponent() {
    const { data: transactionBatch } = useTransactionBatchStore()
    const navigate = useNavigate({ from: Route.fullPath })
    const { transactionId } = Route.useSearch()

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
        setSelectedAccountId,
        setTransactionFormSuccess,
        setOpenPaymentWithTransactionModal,
    } = useTransactionStore()

    const { data: transaction } = useGetTransactionById({
        transactionId,
        enabled: !!transactionId,
        onSuccess: (transaction) => {
            setSelectedMember(transaction?.member_profile)
        },
    })

    const handleSetTransactionId = (transactionId?: TEntityId) => {
        navigate({
            to: Route.fullPath,
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
            <PaymentSuccessModal
                open={openSuccessModal}
                onOpenChange={setOpenSuccessModal}
                transaction={transactionFormSuccess}
                onClose={handleCloseSuccessModal}
                isOpen={openSuccessModal}
            />
            <NoTransactionBatchWarningModal />
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
                            <NoMemberSelectedView
                                onClick={(e) => {
                                    e.preventDefault()
                                    setOpenMemberPicker(true)
                                }}
                                disabledSelectTrigger={hasSelectedTransactionId}
                                isDisplay={!hasSelectedMember}
                            />
                            <MemberProfileTransactionView
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
                            <MemberAccountingLedgerTable
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
                                    setFocusTypePayment('payment')
                                }}
                                actionComponent={(props) => {
                                    return (
                                        <MemberAccountGeneralLedgerAction
                                            memberAccountLedger={
                                                props.row.original
                                            }
                                        />
                                    )
                                }}
                                className="w-full"
                            />
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
                <div className="ecoop-scroll w-[40%] py-2">
                    <TransactionCardList fullPath={Route.fullPath} />
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
                    <CurrentPaymentsEntry
                        totalAmount={transaction?.amount}
                        transactionId={transactionId}
                    />
                </div>
            </div>
        </PageContainer>
    )
}
