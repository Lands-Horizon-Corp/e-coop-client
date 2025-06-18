import { IMemberProfile } from '@/types'
import MemberAssets from './member-assets'
import { Separator } from '@/components/ui/separator'
import MemberIncome from './member-income'
import MemberExpenses from './member-expenses'
import { forwardRef } from 'react'

type Props = {
    memberProfile: IMemberProfile
}

const MemberFinancial = forwardRef<HTMLDivElement, Props>(
    ({ memberProfile }, ref) => {
        return (
            <div ref={ref} className="space-y-4">
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
