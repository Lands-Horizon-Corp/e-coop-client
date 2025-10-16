import { useState } from 'react'

import { toast } from 'sonner'

import { AccountTypeEnum, IAccount } from '@/modules/account'
import {
    ILoanTransaction,
    useGetLoanTransactionPayableAccounts,
} from '@/modules/loan-transaction'
import { LoanMicroInfoCard } from '@/modules/loan-transaction/components/loan-mini-info-card'
import LoanPickerAll from '@/modules/loan-transaction/components/loan-picker-all'
import {
    MemberAccountGeneralLedgerAction,
    MemberAccountingLedgerTable,
} from '@/modules/member-accounting-ledger'
import { IMemberProfile } from '@/modules/member-profile'
import MemberPicker from '@/modules/member-profile/components/member-picker'

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

function LoanPaymentPage() {
    const [member, setMember] = useState<IMemberProfile>()

    // FOR Loan Picker
    const loanPickerState = useModalState()
    const [loanAccountId, setLoanAccountId] = useState<TEntityId>()

    const [loanTransactionId, setLoanTransactionId] = useState<TEntityId>()

    const { data: payableAccounts } = useGetLoanTransactionPayableAccounts({
        loanTransactionId: loanTransactionId as TEntityId,
        options: {
            enabled: !!loanTransactionId,
            initialData: {
                payable_accounts: [
                    {
                        account: {
                            name: 'Jingoy Loan',
                            type: AccountTypeEnum.Loan,
                        } as IAccount,
                        account_id: 'XXXX-XXXX',
                        suggested_payment_amount: 200,
                        last_payment_date: new Date('10-1-2025').toISOString(),
                        is_past_due: false,
                        supposed_payment_date: new Date(
                            '10-15-2025'
                        ).toISOString(),
                    },
                    {
                        account: {
                            name: 'Interest Jingoy',
                            type: AccountTypeEnum.Interest,
                        } as IAccount,
                        account_id: 'XXXX-XXX1',
                        suggested_payment_amount: 100,
                        last_payment_date: new Date('10-2-2025').toISOString(),
                        is_past_due: true,
                        supposed_payment_date: new Date(
                            '10-10-2025'
                        ).toISOString(),
                    },
                    {
                        account: {
                            name: 'Fines Jingoy',
                            type: AccountTypeEnum.Fines,
                        } as IAccount,
                        account_id: 'XXXX-XXX2',
                        suggested_payment_amount: 50,
                        last_payment_date: new Date('10-1-2025').toISOString(),
                        is_past_due: false,
                        supposed_payment_date: new Date(
                            '10-15-2025'
                        ).toISOString(),
                    },
                ],
            },
        },
    })

    const handleAccountClick = (account: IAccount) => {
        if (account.type !== AccountTypeEnum.Loan)
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
                    onSelect={(selectedLoan) => {
                        setLoanTransactionId(selectedLoan.id)
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
                            onSelect={(member) => handleMemberSelect(member)}
                            value={member}
                        />
                        {member && (
                            <Button
                                className="shrink-0"
                                onClick={() => setMember(undefined)}
                                size="icon"
                                variant="destructive"
                            >
                                <XIcon />
                            </Button>
                        )}
                    </div>
                    <div>
                        <p>Paying for Loan</p>
                        <LoanMicroInfoCard
                            className="rounded-xl p-3 bg-accent/50"
                            loanTransaction={
                                {
                                    id: 'XNXXX99F-1256-4D3D-ABCD-1234567890AB',
                                    mode_of_payment: 'monthly',
                                    terms: 12,
                                    applied_1: 50000,
                                    loan_type: 'standard',
                                    released_date: '10-10-2025',
                                } as ILoanTransaction
                            }
                        />
                    </div>
                    {member && (
                        <LoanPayablesForm
                            loanTransacitonId={loanTransactionId as TEntityId}
                            memberProfileId={member.id}
                            payables={payableAccounts?.payable_accounts || []}
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
