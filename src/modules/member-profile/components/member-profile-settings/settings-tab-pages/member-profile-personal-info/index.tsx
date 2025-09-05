import { forwardRef } from 'react'

import { IMemberProfile } from '@/modules/member-profile'

import MemberPersonalInfoForm from '../../../forms/member-personal-info-form'

interface Props {
    memberProfile: IMemberProfile
}

const MemberProfilePersonalInfo = forwardRef<HTMLDivElement, Props>(
    ({ memberProfile }, ref) => {
        return (
            <div className="space-y-4" ref={ref}>
                <MemberPersonalInfoForm
                    defaultValues={memberProfile}
                    memberProfileId={memberProfile.id}
                />
            </div>
        )
    }
)

MemberProfilePersonalInfo.displayName = 'MemberProfilePersonalInfo'

export default MemberProfilePersonalInfo
