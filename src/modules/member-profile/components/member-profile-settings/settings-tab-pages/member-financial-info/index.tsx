import { forwardRef } from 'react'

import { IMemberProfile } from '@/modules/member-profile'

import { Separator } from '@/components/ui/separator'

import MemberAssets from './member-assets'
import MemberExpenses from './member-expenses'
import MemberIncome from './member-income'

type Props = {
    memberProfile: IMemberProfile
}

const MemberFinancial = forwardRef<HTMLDivElement, Props>(
    ({ memberProfile }, ref) => {
        return (
            <div className="space-y-4" ref={ref}>
                <MemberAssets memberProfile={memberProfile} />
                <Separator />
                <MemberIncome memberProfile={memberProfile} />
                <Separator />
                <MemberExpenses memberProfile={memberProfile} />
            </div>
        )
    }
)

MemberFinancial.displayName = 'MemberFinancial'

export default MemberFinancial
