import { useState } from 'react'

import { toast } from 'sonner'

import { IAccount } from '@/modules/account'
import { ICurrency } from '@/modules/currency'
import {
    ILoanPaymentPerAccount,
    ILoanTransaction,
    useLoanPaymentSchedule,
} from '@/modules/loan-transaction'
import { LoanMicroInfoCard } from '@/modules/loan-transaction/components/loan-mini-info-card'
import LoanPickerAll from '@/modules/loan-transaction/components/loan-picker-all'
import {
    MemberAccountGeneralLedgerAction,
    MemberAccountingLedgerTable,
} from '@/modules/member-accounting-ledger'
import { IMemberProfile } from '@/modules/member-profile'
import MemberPicker from '@/modules/member-profile/components/member-picker'
import { useTransactionBatchStore } from '@/modules/transaction-batch/store/transaction-batch-store'

import PageContainer from '@/components/containers/page-container'
import { HandCoinsIcon, XIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable'

import { useModalState } from '@/hooks/use-modal-state'

import { TEntityId } from '@/types'

import LoanPayablesForm from '../components/forms/loan-payables-form'
import { ILoanPayableAccount } from '../loan-payment.types'

const getCurrentPayable = ({
    account,
    last_payment_date,
    loan_payment_schedule,
    next_payment_date,
}: ILoanPaymentPerAccount): ILoanPayableAccount => {
    const payable = loan_payment_schedule.find((p) => !p.paid)

    return {
        account: account,
        account_id: account.id,
        suggested_payment_amount: payable?.amount || 0,
        is_past_due: payable?.due,
        last_payment_date: last_payment_date,
        supposed_payment_date: next_payment_date,
        payment_schedule: payable,
    }
}

function LoanPaymentPage() {
    const { data: currentTransactionBatch } = useTransactionBatchStore()
    const [member, setMember] = useState<IMemberProfile>()

    // FOR Loan Picker
    const loanPickerState = useModalState()
    const [loanAccountId, setLoanAccountId] = useState<TEntityId>()

    const [selectedLoan, setSelectedLoan] = useState<
        ILoanTransaction | undefined
    >()

    const { data: paymentSchedule } = useLoanPaymentSchedule({
        loanTransactionId: selectedLoan?.id as TEntityId,
        options: {
            enabled: !!selectedLoan?.id,
        },
    })

    const payables =
        paymentSchedule?.account_payments.map((smry) =>
            getCurrentPayable(smry)
        ) || []

    const handleAccountClick = (account: IAccount) => {
        if (account.type !== 'Loan')
            return toast.warning(
                'Not a loan account, please select a valid loan account'
            )
        setLoanAccountId(account.id)
        loanPickerState.onOpenChange(true)
    }

    const handleMemberSelect = (selectedMember: IMemberProfile) => {
        if (selectedMember.id === member?.id) return
        setMember(selectedMember)
        setLoanAccountId(undefined)
        setSelectedLoan(undefined)
    }

    return (
        <PageContainer className="items-start space-y-4 px-6">
            <div className="mx-4 space-y-2">
                <p className="text-xl">
                    <HandCoinsIcon className="inline mr-1" /> Loan Payment
                </p>
                <p className="text-sm text-muted-foreground/70">
                    Pay member loans quickly.
                </p>
            </div>
            {loanAccountId && member && (
                <LoanPickerAll
                    accountId={loanAccountId}
                    memberProfileId={member.id}
                    modalState={loanPickerState}
                    mode="member-profile-loan-account"
                    onSelect={(loan) => {
                        setSelectedLoan(loan)
                        toast.success('Loan selected')
                    }}
                    triggerClassName="hidden"
                />
            )}
            <ResizablePanelGroup className="!h-[80dvh]" direction="horizontal">
                <ResizablePanel
                    className="!overflow-auto flex flex-col gap-y-4 pr-4 ecoop-scroll"
                    defaultSize={70}
                    maxSize={70}
                    minSize={60}
                >
                    <div className="flex items-center gap-x-2 w-full">
                        <MemberPicker
                            mainTriggerClassName="w-full overflow-hidden"
                            onSelect={(member) => {
                                handleMemberSelect(member)
                                setLoanAccountId(undefined)
                                setSelectedLoan(undefined)
                            }}
                            value={member}
                        />
                        {member && (
                            <Button
                                className="shrink-0"
                                onClick={() => {
                                    setMember(undefined)
                                    setLoanAccountId(undefined)
                                    setSelectedLoan(undefined)
                                }}
                                size="icon"
                                variant="destructive"
                            >
                                <XIcon />
                            </Button>
                        )}
                    </div>
                    <div>
                        <p>Paying for Loan</p>
                        {selectedLoan && (
                            <LoanMicroInfoCard
                                className="rounded-xl p-3 bg-accent/50"
                                loanTransaction={selectedLoan}
                            />
                        )}
                    </div>
                    {member && (
                        <LoanPayablesForm
                            currency={
                                (currentTransactionBatch?.currency ||
                                    selectedLoan?.account
                                        ?.currency) as ICurrency
                            }
                            memberProfileId={member.id}
                            payables={payables}
                        />
                    )}
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel
                    className="!overflow-y-auto px-5 ecoop-scroll !relative"
                    defaultSize={30}
                >
                    {member ? (
                        <MemberAccountingLedgerTable
                            actionComponent={(props) => (
                                <>
                                    <MemberAccountGeneralLedgerAction
                                        memberAccountLedger={props.row.original}
                                    />
                                </>
                            )}
                            className="w-full min-h-[40vh] h-full"
                            memberProfileId={member.id}
                            mode="member"
                            onRowClick={({ original: { account } }) =>
                                handleAccountClick(account)
                            }
                        />
                    ) : (
                        <div className="space-y-2 h-[70vh] mt-8">
                            <div className="flex items-center justify-between">
                                <div className="h-8 bg-accent/20 rounded-md w-1/3" />
                                <div className="h-8 bg-accent/20 rounded-md w-1/4" />
                            </div>
                            <div className="h-full bg-accent/20 rounded-md flex items-center justify-center w-full">
                                <p className="text-muted-foreground/70 text-sm">
                                    Select a member to see their loans
                                </p>
                            </div>
                        </div>
                    )}
                </ResizablePanel>
            </ResizablePanelGroup>
        </PageContainer>
    )
}

export default LoanPaymentPage
