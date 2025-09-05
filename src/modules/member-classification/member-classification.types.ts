import z from 'zod'

import {
    IAuditable,
    IPaginatedResult,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { MemberClassificationSchema } from './member-classification.validation'

export interface IMemberClassification extends ITimeStamps, IAuditable {
    id: TEntityId

    name: string
    icon: string
    description: string

    // history?: IMemberClassificationHistory[]
}

export type IMemberClassificationRequest = z.infer<
    typeof MemberClassificationSchema
>

export interface IMemberClassificationPaginated
    extends IPaginatedResult<IMemberClassification> {}
