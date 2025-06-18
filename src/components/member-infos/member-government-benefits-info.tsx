import { forwardRef } from 'react'
import SectionTitle from './section-title'
import { BankDuoToneIcon } from '../icons'
import MemberGovernmentBenefitsDisplay from './displays/member-government-benefits-display'

import { cn } from '@/lib'
import { IClassProps } from '@/types'
import { IMemberProfile, TEntityId } from '@/types'
import { useMemberProfile } from '@/hooks/api-hooks/member/use-member-profile'

interface Props extends IClassProps {
    profileId: TEntityId
    defaultData?: IMemberProfile
}

const MemberGovernmentBenefits = forwardRef<HTMLDivElement, Props>(
    ({ profileId, className, defaultData }, ref) => {
        const { data } = useMemberProfile({
            profileId,
            initialData: defaultData,
        })

        return (
            <div
                ref={ref}
                className={cn(
                    'flex flex-1 flex-col gap-y-4 rounded-xl bg-background p-4',
                    className
                )}
            >
                <SectionTitle
                    title="Government Benefits"
                    Icon={BankDuoToneIcon}
                    subTitle="View all government benefits and ID this member have."
                />
                <MemberGovernmentBenefitsDisplay
                    governmentBenefits={data?.member_government_benefits}
                />
            </div>
        )
    }
)

MemberGovernmentBenefits.displayName = 'MemberGovernmentBenefits'

export default MemberGovernmentBenefits
