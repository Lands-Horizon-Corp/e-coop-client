import { forwardRef } from 'react'
import MemberFileMediaDisplay from './displays/member-file-medias-display'

import { cn } from '@/lib'
import { useMemberProfile } from '@/hooks/api-hooks/member/use-member-profile'

import { IBaseProps, IMemberProfile, TEntityId } from '@/types'

interface Props extends IBaseProps {
    profileId: TEntityId
    defaultData?: IMemberProfile
}

const MemberMediasInfo = forwardRef<HTMLDivElement, Props>(
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
                <MemberFileMediaDisplay userId={data?.user_id} />
            </div>
        )
    }
)

MemberMediasInfo.displayName = 'MemberMediasInfo'

export default MemberMediasInfo
