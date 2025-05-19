import { IMemberProfile } from '@/types'
import MemberAssets from './member-assets'
import { Separator } from '@/components/ui/separator'
import MemberIncome from './member-income'
import MemberExpenses from './member-expenses'

type Props = {
    memberProfile: IMemberProfile
}

const MemberFinancial = ({ memberProfile }: Props) => {
    return (
        <div className="space-y-4">
            <MemberAssets memberProfile={memberProfile} />
            <Separator />
            <MemberIncome memberProfile={memberProfile} />
            <Separator />
            <MemberExpenses memberProfile={memberProfile} />
        </div>
    )
}

export default MemberFinancial
