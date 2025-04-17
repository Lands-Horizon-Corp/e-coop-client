import MemberFileMediaDisplay from './displays/member-file-medias-display'

import { cn } from '@/lib'
import { IBaseProps } from '@/types'
import { IMemberProfileResource, TEntityId } from '@/server'
import { useMemberProfile } from '@/hooks/api-hooks/member/use-member-profile'

interface Props extends IBaseProps {
    profileId: TEntityId
    defaultData?: IMemberProfileResource
}

const MemberMediasInfo = ({ profileId, className, defaultData }: Props) => {
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
            <MemberFileMediaDisplay memberId={data?.member?.id} />
        </div>
    )
}

export default MemberMediasInfo
