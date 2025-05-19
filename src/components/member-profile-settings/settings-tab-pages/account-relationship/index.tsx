import MemberJointAccounts from './joint-accounts'
import { Separator } from '@/components/ui/separator'

import { IMemberProfile } from '@/types'
import MemberRelativeAccounts from './member-relative-accounts'

type Props = { memberProfile: IMemberProfile }

const MemberAccountRelationship = ({ memberProfile }: Props) => {
    return (
        <div className="space-y-4">
            <MemberJointAccounts memberProfile={memberProfile} />
            <Separator />
            <MemberRelativeAccounts memberProfile={memberProfile} />
        </div>
    )
}

export default MemberAccountRelationship
