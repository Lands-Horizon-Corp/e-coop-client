import { useState } from 'react'

import { toast } from 'sonner'

import { dateAgo } from '@/helpers/date-utils'
import { AccountTypeBadge, AccountTypeEnum, IAccount } from '@/modules/account'
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
import { CalendarNumberIcon, HandCoinsIcon, XIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Separator } from '@/components/ui/separator'

import { useModalState } from '@/hooks/use-modal-state'

import { TEntityId } from '@/types'

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
                        suggested_payment_amount: 500,
                        last_payment_date: new Date('10-1-2025').toISOString(),
                    },
                    {
                        account: {
                            name: 'Interest Jingoy',
                            type: AccountTypeEnum.Interest,
                        } as IAccount,
                        account_id: 'XXXX-XXX1',
                        suggested_payment_amount: 500,
                        last_payment_date: new Date('10-2-2025').toISOString(),
                    },
                    {
                        account: {
                            name: 'Fines Jingoy',
                            type: AccountTypeEnum.Fines,
                        } as IAccount,
                        account_id: 'XXXX-XXX2',
                        suggested_payment_amount: 500,
                        last_payment_date: new Date('10-1-2025').toISOString(),
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
                    defaultSize={40}
                    maxSize={40}
                    minSize={30}
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
                    <div className="space-y-2 bg-popover/40 rounded-xl p-4">
                        <p>Payable Accounts</p>
                        <div className="flex items-center justify-between gap-x-4">
                            <Input />
                            <Button>
                                <CalendarNumberIcon /> Amort
                            </Button>
                        </div>
                        <Separator />
                        <div className="space-y-4">
                            {payableAccounts?.payable_accounts.map(
                                (payable) => (
                                    <div
                                        className="rounded-xl p-3 space-y-1 bg-popover"
                                        key={payable.account_id}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="mb-2">
                                                <p className="inline mr-1">
                                                    {payable?.account?.name || (
                                                        <span className="text-xs text-muted-foreground/80">
                                                            Unknown
                                                        </span>
                                                    )}
                                                </p>
                                                {payable?.account?.type && (
                                                    <AccountTypeBadge
                                                        type={
                                                            payable.account.type
                                                        }
                                                    />
                                                )}
                                            </div>
                                            {payable?.last_payment_date && (
                                                <p className="text-xs text-right text-muted-foreground/60">
                                                    Last Pay :{' '}
                                                    {dateAgo(
                                                        payable.last_payment_date
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-x-2">
                                            <Input placeholder="Reference no" />
                                            <Input
                                                className="w-6/12"
                                                placeholder="Amount"
                                            />
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel
                    className="!overflow-y-auto px-5 ecoop-scroll !relative"
                    defaultSize={65}
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
