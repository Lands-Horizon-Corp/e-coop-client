import z from 'zod'

import { IMedia } from '@/modules/media/media.types'
import { IMemberProfile } from '@/modules/member-profile/member-profile.types'

import { IBaseEntityMeta, IPaginatedResult } from '@/types'

import {
    MemberProfileArchiveSchema,
    TMemberProfileArchiveBulkUpdateSchema,
} from './member-profile-archive.validation'

export interface IMemberProfileArchive extends IBaseEntityMeta {
    member_profile_id?: string
    member_profile?: IMemberProfile
    media_id?: string
    media?: IMedia
    name: string
    description: string
    category: string
}

export type IMemberProfileArchiveRequest = z.infer<
    typeof MemberProfileArchiveSchema
>

export interface IMemberProfileArchivePaginated extends IPaginatedResult<IMemberProfileArchive> {}

export type IMemberProfileArchiveBulkRequest =
    TMemberProfileArchiveBulkUpdateSchema

export interface IMemberProfileArchiveCategory {
    name: string
    count: number
}
