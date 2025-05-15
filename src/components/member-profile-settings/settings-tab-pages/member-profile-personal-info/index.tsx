import { IMemberProfile } from '@/types'
import MemberPersonalInfoForm from '@/components/forms/member-forms/member-profile-settings-forms/member-personal-info-form'

interface Props {
    memberProfile: IMemberProfile
}

const MemberProfilePersonalInfo = ({ memberProfile }: Props) => {
    return (
        <div className="space-y-4">
            <MemberPersonalInfoForm
                defaultValues={memberProfile}
                memberProfileId={memberProfile.id}
            />
        </div>
    )
}

export default MemberProfilePersonalInfo
