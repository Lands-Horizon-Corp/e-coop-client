import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types/common'

import { MemberGroupSchema } from './member-group.validation'

export interface IMemberGroup extends IBaseEntityMeta {
    id: TEntityId

    name: string
    description: string
}

export type IMemberGroupRequest = z.infer<typeof MemberGroupSchema>
// organization_id: TEntityId
// branch_id: TEntityId

export interface IMemberGroupPaginated extends IPaginatedResult<IMemberGroup> {}
