import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types/common'

import { GenderSchema } from './member-gender.validation'

export interface IMemberGender extends IBaseEntityMeta {
    id: TEntityId

    name: string
    description: string
}

export type IMemberGenderRequest = z.infer<typeof GenderSchema>

export interface IMemberGenderPaginated
    extends IPaginatedResult<IMemberGender> {}
