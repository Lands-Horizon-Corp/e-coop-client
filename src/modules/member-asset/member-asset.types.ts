import z from 'zod'

import { IBaseEntityMeta, TEntityId } from '@/types/common'

import { IBranch } from '../branch'
import { IMedia } from '../media/media.types'
import { IMemberProfile } from '../member-profile/member-profile.types'
import { MemberAssetSchema } from './member-asset-validation'

export interface IMemberAsset extends IBaseEntityMeta {
    id: TEntityId
    media_id?: TEntityId
    media?: IMedia

    member_profile_id: TEntityId
    member_profile: IMemberProfile

    branch_id: TEntityId
    branch: IBranch

    name: string
    entry_date: string
    description?: string
    cost: number
}

export type IMemberAssetRequest = z.infer<typeof MemberAssetSchema>
