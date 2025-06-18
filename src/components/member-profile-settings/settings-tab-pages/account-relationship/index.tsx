import { forwardRef } from 'react'

import MemberJointAccounts from './joint-accounts'
import { Separator } from '@/components/ui/separator'
import MemberRelativeAccounts from './member-relative-accounts'

import { IMemberProfile } from '@/types'

type Props = { memberProfile: IMemberProfile }

const MemberAccountRelationship = forwardRef<HTMLDivElement, Props>(
    ({ memberProfile }, ref) => {
        return (
            <div ref={ref} className="space-y-4">
                <MemberJointAccounts memberProfile={memberProfile} />
                <Separator />
                <MemberRelativeAccounts memberProfile={memberProfile} />
            </div>
        )
    }
)

MemberAccountRelationship.displayName = 'MemberAccountRelationship'

export default MemberAccountRelationship
