import MemberMembershipForm from '@/components/forms/member-forms/member-profile-settings-forms/member-membership-form'
import { IMemberProfile } from '@/types'
import { forwardRef } from 'react'

interface Props {
    memberProfile: IMemberProfile
}

const MembershipInfo = forwardRef<HTMLDivElement, Props>(
    ({ memberProfile }, ref) => {
        return (
            <div ref={ref}>
                <MemberMembershipForm
                    defaultValues={memberProfile}
                    memberProfileId={memberProfile.id}
                />
            </div>
        )
    }
)

MembershipInfo.displayName = 'MembershipInfo'

export default MembershipInfo
