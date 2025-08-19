import z from 'zod'

import { TPermission } from '@/constants/permission'
import {
    IAuditable,
    IPaginatedResult,
    ITimeStamps,
    TEntityId,
    TUserType,
} from '@/types/common'
import {
    descriptionSchema,
    descriptionTransformerSanitizer,
    stringDateSchema,
    userAccountTypeSchema,
} from '@/validation'

import { IBranch } from '../branch/branch.types'
import { IOrganization } from '../organization'

// Invitation Code Resource
export interface IInvitationCode extends ITimeStamps, IAuditable {
    id: TEntityId

    user_type: TUserType
    code: string

    expiration_date?: string
    max_use: number
    current_use: number

    permission_name: string
    permission_description: string
    // permissions: TPermission[];

    description: string
    branch: IBranch
    organization: IOrganization
}

export interface IInvitationCodeRequest {
    id?: TEntityId

    user_type: TUserType
    code: string

    expiration_date?: string
    max_use: number
    current_use?: number

    permission_name: string
    permission_description: string
    permissions: TPermission[]

    description: string
}

export interface IInvitationCodePaginated
    extends IPaginatedResult<IInvitationCode> {}

export const InviationCodeSchema = z.object({
    code: z.string().min(1, 'invitation code is required'),
    expiration_date: stringDateSchema,
    current_use: z.coerce.number().min(0, 'Current use cannot be negative'),
    max_use: z.coerce.number().min(0, 'Current use cannot be negative'),
    description: descriptionSchema.transform(descriptionTransformerSanitizer),
    user_type: userAccountTypeSchema,

    permission_name: z.string(),
    permission_description: descriptionSchema.transform(
        descriptionTransformerSanitizer
    ),
    permissions: z.array(z.string()),
})

export type TInvitationCodeFormValues = z.infer<typeof InviationCodeSchema>
