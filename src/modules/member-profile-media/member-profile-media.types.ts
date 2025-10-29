import z from 'zod'

import { IMedia } from '@/modules/media/media.types'
import { IMemberProfile } from '@/modules/member-profile/member-profile.types'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { MemberProfileMediaSchema } from './member-profile-media.validation'

export interface IMemberProfileMedia extends IBaseEntityMeta {
    member_profile_id?: string
    member_profile?: IMemberProfile
    media_id?: string
    media?: IMedia
    name: string
    description: string
}

export type IMemberProfileMediaRequest = z.infer<
    typeof MemberProfileMediaSchema
>

export interface IMemberProfileMediaPaginated
    extends IPaginatedResult<IMemberProfileMedia> {}

export type IMemberProfileMediaBulkRequest = {
    media_ids: TEntityId[]
}
