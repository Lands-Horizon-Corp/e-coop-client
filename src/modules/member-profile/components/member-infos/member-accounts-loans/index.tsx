import { cn } from '@/helpers'

import { WalletIcon } from '@/components/icons'

import { IBaseProps, TEntityId } from '@/types'

import SectionTitle from '../section-title'
import { IMemberProfile } from '@/modules/member-profile'
import MemberAccountingLedger from './member-accounting-ledger'

interface Props extends IBaseProps {
    memberProfileId: TEntityId
    defaultMemberProfile?: IMemberProfile
}

const MemberAccountsLoans = ({ className, memberProfileId }: Props) => {
    return (
        <div
            className={cn(
                'flex flex-1 flex-col gap-y-4 rounded-xl bg-background p-4',
                className
            )}
        >
            <div className="space-y-4">
                <SectionTitle title="Accounts Summary" Icon={WalletIcon} />
                <MemberAccountingLedger
                    memberProfileId={memberProfileId}
                    className="h-[500px]"
                />
            </div>
            <div className="space-y-4">
                <SectionTitle title="Loan Summary" Icon={WalletIcon} />
                {/* <MemberAccountingLedger
                    memberProfileId={memberProfileId}
                    className="h-[500px]"
                /> */}
            </div>
        </div>
    )
}

export default MemberAccountsLoans
