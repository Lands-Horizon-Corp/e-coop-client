import { forwardRef } from 'react'

import { Separator } from '@/components/ui/separator'

import { IMemberProfile } from '@/types'

import MemberJointAccounts from './joint-accounts'
import MemberRelativeAccounts from './member-relative-accounts'

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
