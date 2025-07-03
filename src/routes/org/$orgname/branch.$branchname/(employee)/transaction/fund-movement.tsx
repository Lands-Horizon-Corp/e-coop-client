import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CloseIcon, ReceiptIcon } from '@/components/icons'
import MemberPicker from '@/components/pickers/member-picker'
import PageContainer from '@/components/containers/page-container'
import MemberAccountingLedgerTable from '@/components/tables/transaction-tables'
import { GradientBackground } from '@/components/gradient-background/gradient-background'

import TransactionEntryModal from './-components/transaction-entry'
import CurrentPaymentsEntry from './-components/current-payments-entry'
import MemberProfileTransactionView from './-components/member-profile'
import NoSelectedMemberView from './-components/no-member-selected-view'

import {
    usePaymentsDataStore,
    usePaymentsModalStore,
} from '@/store/transaction/payments-entry-store'

import { ITransactionEntryRequest } from '@/types'
import { createFileRoute } from '@tanstack/react-router'
import { payment_bg, withdraw_bg, deposit_bg } from '@/assets/transactions'

import TRANSACTIION_DUMMY_DATA from './-components/transactionEntrySamplea.json'
import MemberAccountSampleData from './-components/memberAccountingLegdgerSample.json'

import { cn } from '@/lib'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable'
import { commaSeparators } from '@/helpers'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useState } from 'react'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/transaction/fund-movement'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const {
        selectedMember,
        setSelectedMember,
        setFocusTypePayment,
        focusTypePayment,
    } = usePaymentsDataStore()

    const { setOpenPaymentsEntryModal, openPaymentsEntryModal } =
        usePaymentsModalStore()

    const [openMemberSelectModalState, setOpenMemberSelectModal] =
        useState(false)

    const resetSelectedMember = () => {
        setSelectedMember(null)
    }

    const hasSelectedMember = !selectedMember

    let transactionTitle = ''
    let transactionDescription = ''

    if (focusTypePayment === 'payment') {
        transactionTitle = 'Add Payment'
    } else if (focusTypePayment === 'withdraw') {
        transactionTitle = 'Withdraw'
    } else if (focusTypePayment === 'deposit') {
        transactionTitle = 'Deposit'
    }

    if (focusTypePayment === 'payment') {
        transactionDescription = 'Add a payment for the selected member.'
    } else if (focusTypePayment === 'withdraw') {
        transactionDescription = 'Withdraw funds from the selected member.'
    } else if (focusTypePayment === 'deposit') {
        transactionDescription = 'Deposit funds for the selected member.'
    }

    if (!openPaymentsEntryModal) {
        transactionTitle = ''
        transactionDescription = ''
    }

    const referenceNumber = 'RF-6J8C-1M9P-2K3Q-4T5R'
    const totalAmount = 12431231

    return (
        <PageContainer className="flex h-full w-full items-center">
            <TransactionEntryModal
                onOpenChange={setOpenPaymentsEntryModal}
                open={openPaymentsEntryModal}
                title={transactionTitle}
                description={transactionDescription}
                formProps={{
                    onSuccess() {
                        setOpenPaymentsEntryModal(false)
                    },
                }}
            />
            <ResizablePanelGroup
                direction="horizontal"
                className="h-full min-h-[100vh] w-full !flex-col gap-4 md:!flex-row"
            >
                <ResizablePanel defaultSize={70} minSize={40}>
                    <ResizablePanelGroup direction="vertical">
                        <ResizablePanel defaultSize={50} className="p-2">
                            <div className="flex w-full min-w-[30vw] flex-col gap-y-2">
                                <div className="flex gap-x-2">
                                    <Button
                                        disabled={hasSelectedMember}
                                        variant={'destructive'}
                                        onClick={resetSelectedMember}
                                    >
                                        <CloseIcon />
                                    </Button>
                                    <MemberPicker
                                        modalState={{
                                            open: openMemberSelectModalState,
                                            onOpenChange:
                                                setOpenMemberSelectModal,
                                        }}
                                        onSelect={(member) => {
                                            setSelectedMember(member)
                                        }}
                                    />
                                </div>
                                <div className="relative w-full">
                                    <Input
                                        value={referenceNumber}
                                        className={cn(
                                            'pr-9 text-lg font-semibold placeholder:text-sm placeholder:font-normal placeholder:text-foreground/40'
                                        )}
                                        id="OR number"
                                        placeholder="Enter the OR Number"
                                        autoComplete="off"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg font-bold text-secondary">
                                        <ReceiptIcon />
                                    </span>
                                </div>
                                <div className="flex w-full flex-col justify-evenly space-y-2 py-2 lg:flex-row lg:space-x-2 lg:space-y-0">
                                    <GradientBackground
                                        gradientOnly
                                        className="w-full rounded-xl"
                                    >
                                        <Button
                                            variant={'outline'}
                                            disabled={hasSelectedMember}
                                            className="relative h-14 w-full overflow-hidden rounded-xl !border-primary/20 hover:bg-primary/10"
                                            onClick={() => {
                                                setFocusTypePayment('payment')
                                                setOpenPaymentsEntryModal(true)
                                            }}
                                        >
                                            Add Payment
                                            <span
                                                className="absolute -right-5 -top-16 size-52 -rotate-45"
                                                style={{
                                                    backgroundImage: `url(${payment_bg})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition:
                                                        'center',
                                                    backgroundRepeat:
                                                        'no-repeat',
                                                    opacity: 0.2,
                                                }}
                                            />
                                        </Button>
                                    </GradientBackground>
                                    <GradientBackground
                                        gradientOnly
                                        className="w-full rounded-xl"
                                    >
                                        <Button
                                            disabled={hasSelectedMember}
                                            variant={'outline'}
                                            className="relative h-14 w-full overflow-hidden rounded-xl !border-primary/20 hover:bg-primary/10"
                                            onClick={() => {
                                                setFocusTypePayment('withdraw')
                                                setOpenPaymentsEntryModal(true)
                                            }}
                                        >
                                            Withdraw
                                            <span
                                                className="absolute -right-5 -top-16 size-52 -rotate-45"
                                                style={{
                                                    backgroundImage: `url(${withdraw_bg})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition:
                                                        'center',
                                                    backgroundRepeat:
                                                        'no-repeat',
                                                    opacity: 0.2,
                                                }}
                                            />
                                        </Button>
                                    </GradientBackground>
                                    <GradientBackground
                                        gradientOnly
                                        className="w-full rounded-xl border-0"
                                    >
                                        <Button
                                            variant={'outline'}
                                            disabled={hasSelectedMember}
                                            className="z-30 h-14 w-full rounded-xl border-primary/20 hover:bg-primary/10"
                                            onClick={() => {
                                                setFocusTypePayment('deposit')
                                                setOpenPaymentsEntryModal(true)
                                            }}
                                        >
                                            Deposit
                                            <span
                                                className="absolute -right-5 -top-16 size-52 -rotate-45"
                                                style={{
                                                    backgroundImage: `url(${deposit_bg})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition:
                                                        'center',
                                                    backgroundRepeat:
                                                        'no-repeat',
                                                    opacity: 0.2,
                                                }}
                                            />
                                        </Button>
                                    </GradientBackground>
                                </div>
                                {selectedMember ? (
                                    <MemberProfileTransactionView
                                        memberInfo={selectedMember}
                                    />
                                ) : (
                                    <NoSelectedMemberView
                                        onOpenChange={setOpenMemberSelectModal}
                                    />
                                )}
                            </div>
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={50} className="p-2">
                            <div className="w-full p-2">
                                <MemberAccountingLedgerTable
                                    data={MemberAccountSampleData}
                                />
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
                <ResizableHandle withHandle className="hidden md:flex" />
                <ResizablePanel
                    defaultSize={40}
                    className="!flex-col p-2 md:!flex-row"
                >
                    <div className="w-full min-w-[30vw] p-2">
                        <div className="flex items-center gap-x-2">
                            <div className="to-indigo-background/10 flex-grow rounded-xl border-[0.1px] border-primary/30 bg-gradient-to-br from-primary/10 p-2">
                                <div className="flex items-center justify-between gap-x-2">
                                    <label className="text-sm font-bold uppercase text-muted-foreground">
                                        Total Amount
                                    </label>
                                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                        ₱{' '}
                                        {totalAmount
                                            ? commaSeparators(
                                                  totalAmount.toString()
                                              )
                                            : '0.00'}
                                    </p>
                                </div>
                            </div>
                            <Button>Save</Button>
                        </div>
                        <ScrollArea className="ecoop-scroll w-full overflow-auto py-2">
                            <CurrentPaymentsEntry
                                data={
                                    TRANSACTIION_DUMMY_DATA as unknown as ITransactionEntryRequest[]
                                }
                            />
                        </ScrollArea>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </PageContainer>
    )
}
