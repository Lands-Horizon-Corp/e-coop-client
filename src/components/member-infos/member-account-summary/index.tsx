import { cn } from '@/lib'

import { WalletIcon } from '@/components/icons'

import { IBaseProps, IMemberProfile, TEntityId } from '@/types'

import SectionTitle from '../section-title'
import MemberAccountingLedger from './member-accounting-ledger'

interface Props extends IBaseProps {
    memberProfileId: TEntityId
    defaultMemberProfile?: IMemberProfile
}

const MemberAccountSummary = ({ className, memberProfileId }: Props) => {
    return (
        <div
            className={cn(
                'flex flex-1 flex-col gap-y-4 rounded-xl bg-background p-4',
                className
            )}
        >
            <SectionTitle title="Accounts Summary" Icon={WalletIcon} />
            <MemberAccountingLedger memberProfileId={memberProfileId} />
        </div>
    )
}

export default MemberAccountSummary
