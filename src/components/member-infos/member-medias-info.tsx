import MemberFileMediaDisplay from './displays/member-file-medias-display'

import { cn } from '@/lib'
import { useMemberProfile } from '@/hooks/api-hooks/member/use-member-profile'

import { IBaseProps, IMemberProfile, TEntityId } from '@/types'

interface Props extends IBaseProps {
    profileId: TEntityId
    defaultData?: IMemberProfile
}

const MemberMediasInfo = ({ profileId, className, defaultData }: Props) => {
    const { data: data } = useMemberProfile({
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
            <MemberFileMediaDisplay userId={data?.user_id} />
        </div>
    )
}

export default MemberMediasInfo
