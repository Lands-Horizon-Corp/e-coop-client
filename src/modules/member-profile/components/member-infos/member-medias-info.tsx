import { forwardRef } from 'react'

import { cn } from '@/helpers'

import { IBaseProps, TEntityId } from '@/types'

import { IMemberProfile, useGetMemberProfileById } from '../..'
import MemberFileMediaDisplay from './displays/member-file-medias-display'

interface Props extends IBaseProps {
    profileId: TEntityId
    defaultData?: IMemberProfile
}

const MemberMediasInfo = forwardRef<HTMLDivElement, Props>(
    ({ profileId, className, defaultData }, ref) => {
        const { data } = useGetMemberProfileById({
            id: profileId,
            options: { initialData: defaultData },
        })

        return (
            <div
                className={cn(
                    'flex flex-1 flex-col gap-y-4 rounded-xl bg-background p-4',
                    className
                )}
                ref={ref}
            >
                <MemberFileMediaDisplay userId={data?.user_id} />
            </div>
        )
    }
)

MemberMediasInfo.displayName = 'MemberMediasInfo'

export default MemberMediasInfo
