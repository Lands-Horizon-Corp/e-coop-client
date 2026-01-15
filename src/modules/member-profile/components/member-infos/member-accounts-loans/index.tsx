import { ReactNode } from 'react'

import { cn } from '@/helpers'
import { IMemberProfile } from '@/modules/member-profile'

import { WalletIcon } from '@/components/icons'

import { IBaseProps, TEntityId } from '@/types'

import MemberAccountingLedger, {
    MemberAccountingLedgerTotal,
} from './member-accounting-ledger'
import MemberLoanSummary from './member-loan-summary'

interface Props extends IBaseProps {
    memberProfileId: TEntityId
    defaultMemberProfile?: IMemberProfile
}

interface SectionCardProps {
    icon: ReactNode
    title: string
    subtitle?: string
    children: ReactNode
}

const SectionCard = ({ icon, title, subtitle, children }: SectionCardProps) => {
    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
                <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                    {icon}
                </div>
                <div>
                    <h2 className="font-semibold text-foreground">{title}</h2>
                    {subtitle && (
                        <p className="text-sm text-muted-foreground">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            <div className="p-5">{children}</div>
        </div>
    )
}

const MemberAccountsLoans = ({ className, memberProfileId }: Props) => {
    return (
        <div
            className={cn(
                'flex flex-1 flex-col gap-y-4 rounded-xl bg-background',
                className
            )}
        >
            <SectionCard
                icon={<WalletIcon className="h-5 w-5" />}
                subtitle="Member ledger balances and transactions"
                title="Accounts Summary"
            >
                <MemberAccountingLedger
                    className="h-[500px]"
                    memberProfileId={memberProfileId}
                />

                <div className="mt-4 flex justify-end">
                    <MemberAccountingLedgerTotal
                        memberProfileId={memberProfileId}
                    />
                </div>
            </SectionCard>

            <SectionCard
                icon={<WalletIcon className="h-5 w-5" />}
                subtitle="Overview of active and completed loans"
                title="Loan Summary"
            >
                <MemberLoanSummary memberProfileId={memberProfileId} />
            </SectionCard>
        </div>
    )
}

export default MemberAccountsLoans
