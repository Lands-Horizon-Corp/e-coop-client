import { IMemberProfile } from '@/types'
import MemberProfileAddress from './member-profile-addresses'
import MemberContactReferences from './member-contact-references'
import { Separator } from '@/components/ui/separator'

type Props = {
    memberProfile: IMemberProfile
}

const MemberAddressContact = ({ memberProfile }: Props) => {
    return (
        <div className="space-y-4">
            <MemberProfileAddress memberProfile={memberProfile} />
            <Separator />
            <MemberContactReferences memberProfile={memberProfile} />
        </div>
    )
}

export default MemberAddressContact
