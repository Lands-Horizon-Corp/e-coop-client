import { useCallback } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { IGeneralLedger } from '@/modules/general-ledger'
import MemberAccountingLedgerTable from '@/modules/member-accounting-ledger/components/member-accounting-ledger-table'
import MemberAccountGeneralLedgerAction from '@/modules/member-accounting-ledger/components/member-accounting-ledger-table/member-account-general-ledger-table/actions'
import {
    ITransaction,
    TransactionCurrentPaymentEntry,
    TransactionHistory,
    TransactionModalSuccessPayment,
    TransactionNoFoundBatch,
    useGetById,
} from '@/modules/transaction'
import TransactionMemberScanner from '@/modules/transaction/components/transaction-member-scanner'
import { useTransactionStore } from '@/store/transaction/transaction-store'
import { HotkeysProvider, useHotkeys } from 'react-hotkeys-hook'

import PageContainer from '@/components/containers/page-container'
import { ResetIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import { useSubscribe } from '@/hooks/use-pubsub'
import { useQeueryHookCallback } from '@/hooks/use-query-hook-cb'
import { useShortcut } from '@/hooks/use-shorcuts'

import { TEntityId } from '@/types'

import PaymentWithTransactionForm from '../components/forms/create-payment-with-transaction-form'
import TransactionShortcuts from '../components/transaction-shorcuts'

type TTransactionProps = {
    transactionId: TEntityId
    fullPath: string
}
const Transaction = ({ transactionId, fullPath }: TTransactionProps) => {
    const queryClient = useQueryClient()
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
    }

    const hasSelectedTransactionId = !!transactionId

    useShortcut(
        'Escape',
        () => {
            handleResetAll()
            handleSetTransactionId({ fullPath })
        },
        {
            disableActiveButton: true,
            disableTextInputs: true,
        }
    )

    useHotkeys('Enter', () => {
        if (!selectedMember) {
            setOpenMemberPicker(true)
        }
    })

    return (
        <PageContainer className="flex h-[90vh] w-full !overflow-hidden">
            <TransactionNoFoundBatch />
            <TransactionModalSuccessPayment
                open={openSuccessModal}
                onOpenChange={setOpenSuccessModal}
                transaction={transactionFormSuccess}
                onClose={handleCloseSuccessModal}
                isOpen={openSuccessModal}
            />
            <HotkeysProvider initiallyActiveScopes={['member-scanner-view']}>
                <TransactionMemberScanner
                    fullPath={fullPath}
                    handleSetTransactionId={() =>
                        handleSetTransactionId({
                            transactionId: undefined,
                            fullPath,
                        })
                    }
                    className="p-1"
                    transactionId={transactionId}
                />
            </HotkeysProvider>

            <div className="flex h-full w-full gap-2 !overflow-hidden">
                {/* Right Section: History & Payment */}
                <div className="lg:w-[40%] ecoop-scroll flex flex-col py-2 overflow-y-auto">
                    <TransactionHistory fullPath={fullPath} />
                    <TransactionCurrentPaymentEntry
                        totalAmount={transaction?.amount}
                        transactionId={transactionId}
                    />
                    {hasSelectedTransactionId && (
                        <Button
                            size="sm"
                            variant={'outline'}
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

                <div className="flex-1 flex flex-col p-2 rounded-2xl bg-background ecoop-scroll overflow-y-auto">
                    <div className="flex justify-end mb-2">
                        <TransactionShortcuts />
                    </div>
                    <div className="w-full p-2">
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
            </div>
            {selectedMember && (
                <Card className="sticky top-0 m-2 w-full !p-0 h-fit">
                    <CardContent className="h-fit grid grid-cols-1 !p-2 items-center !w-full">
                        <HotkeysProvider
                            initiallyActiveScopes={['transaction']}
                        >
                            <PaymentWithTransactionForm
                                className="max-w-2xl"
                                transactionId={transactionId}
                                memberProfileId={selectedMember?.id}
                                memberJointId={selectedJointMember?.id}
                                onSuccess={(transaction) => {
                                    queryClient.invalidateQueries({
                                        queryKey: ['member-accounting-ledger'],
                                    })
                                    queryClient.invalidateQueries({
                                        queryKey: [
                                            'member-profile',
                                            'paginated',
                                        ],
                                    })
                                    queryClient.invalidateQueries({
                                        queryKey: [
                                            'member-joint-account',
                                            'paginated',
                                        ],
                                    })
                                    queryClient.invalidateQueries({
                                        queryKey: ['transaction'],
                                    })
                                    queryClient.invalidateQueries({
                                        queryKey: ['general-ledger'],
                                    })

                                    setOpenPaymentWithTransactionModal(false)
                                    setSelectedMember(
                                        transaction.member_profile
                                    )
                                    setSelectedAccountId(undefined)
                                    handleSetTransactionId({
                                        transactionId:
                                            transaction.transaction_id,
                                        fullPath,
                                    })
                                    handleOnSuccessPaymentCallBack(transaction)
                                }}
                            />
                        </HotkeysProvider>
                    </CardContent>
                </Card>
            )}
        </PageContainer>
    )
}
export default Transaction
