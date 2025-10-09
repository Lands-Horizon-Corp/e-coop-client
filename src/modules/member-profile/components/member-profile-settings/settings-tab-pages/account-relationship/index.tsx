import { forwardRef } from 'react'

import { IMemberProfile } from '@/modules/member-profile'

import { Separator } from '@/components/ui/separator'

import MemberJointAccounts from './joint-accounts'
import MemberRelativeAccounts from './member-relative-accounts'

type Props = { memberProfile: IMemberProfile }

const MemberAccountRelationship = forwardRef<HTMLDivElement, Props>(
    ({ memberProfile }, ref) => {
        return (
            <div className="space-y-4" ref={ref}>
                <MemberJointAccounts memberProfile={memberProfile} />
                <Separator />
                <MemberRelativeAccounts memberProfile={memberProfile} />
            </div>
        )
    }
)

MemberAccountRelationship.displayName = 'MemberAccountRelationship'

export default MemberAccountRelationship
