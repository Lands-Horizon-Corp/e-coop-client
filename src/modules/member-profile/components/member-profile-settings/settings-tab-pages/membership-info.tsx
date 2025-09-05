import { forwardRef } from 'react'

import { IMemberProfile } from '@/modules/member-profile'

import MemberMembershipForm from '../../forms/member-membership-form'

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
