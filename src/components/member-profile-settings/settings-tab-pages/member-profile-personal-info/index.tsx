import { forwardRef } from 'react'

import MemberPersonalInfoForm from '@/components/forms/member-forms/member-profile-settings-forms/member-personal-info-form'

import { IMemberProfile } from '@/types'

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
