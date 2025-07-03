import { forwardRef } from 'react'

import { Separator } from '@/components/ui/separator'

import { IMemberProfile } from '@/types'

import MemberContactReferences from './member-contact-references'
import MemberProfileAddress from './member-profile-addresses'

type Props = {
    memberProfile: IMemberProfile
}

const MemberAddressContact = forwardRef<HTMLDivElement, Props>(
    ({ memberProfile }, ref) => {
        return (
            <div ref={ref} className="space-y-4">
                <MemberProfileAddress memberProfile={memberProfile} />
                <Separator />
                <MemberContactReferences memberProfile={memberProfile} />
            </div>
        )
    }
)

MemberAddressContact.displayName = 'MemberAddressContact'

export default MemberAddressContact
