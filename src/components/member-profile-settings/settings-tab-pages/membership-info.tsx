import { forwardRef } from 'react'

import MemberMembershipForm from '@/components/forms/member-forms/member-profile-settings-forms/member-membership-form'

import { IMemberProfile } from '@/types'

interface Props {
    memberProfile: IMemberProfile
}

const MembershipInfo = forwardRef<HTMLDivElement, Props>(
    ({ memberProfile }, ref) => {
        return (
            <div ref={ref}>
                <MemberMembershipForm
                    disabledFields={['passbook']}
                    defaultValues={memberProfile}
                    memberProfileId={memberProfile.id}
                />
            </div>
        )
    }
)

MembershipInfo.displayName = 'MembershipInfo'

export default MembershipInfo
