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

const MemberGovernmentBenefits = ({
    profileId,
    className,
    defaultData,
}: Props) => {
    const { data } = useMemberProfile({
        profileId,
        initialData: defaultData,
    })

    return (
        <div
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
                governmentBenefits={data?.memberGovernmentBenefits}
            />
        </div>
    )
}

export default MemberGovernmentBenefits
