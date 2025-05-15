import MemberMembershipForm from '@/components/forms/member-forms/member-profile-settings-forms/member-membership-form'
import { IMemberProfile } from '@/types'

interface Props {
    memberProfile: IMemberProfile
}

const MembershipInfo = ({ memberProfile }: Props) => {
    return (
        <div>
            <MemberMembershipForm
                defaultValues={memberProfile}
                memberProfileId={memberProfile.id}
            />
        </div>
    )
}

export default MembershipInfo
