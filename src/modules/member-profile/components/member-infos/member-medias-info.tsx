import { forwardRef } from 'react'

import { cn } from '@/helpers'

import { IBaseProps, TEntityId } from '@/types'

import { IMemberProfile, useGetById } from '../..'
import MemberFileMediaDisplay from './displays/member-file-medias-display'

interface Props extends IBaseProps {
    profileId: TEntityId
    defaultData?: IMemberProfile
}

const MemberMediasInfo = forwardRef<HTMLDivElement, Props>(
    ({ profileId, className, defaultData }, ref) => {
        const { data } = useGetById({
            id: profileId,
            options: { initialData: defaultData },
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
