import z from 'zod'

import {
    IAuditable,
    IPaginatedResult,
    ITimeStamps,
    TEntityId,
    descriptionSchema,
    descriptionTransformerSanitizer,
} from '../common'
import { IMedia } from '../media/media.types'
import { IOrganization } from '../organization'

export enum branchTypeEnum {
    CooperativeBranch = 'cooperative branch',
    BusinessBranch = 'business branch',
    BankingBranch = 'banking branch',
}

// Resource
export interface IBranch extends ITimeStamps, IAuditable {
    id: TEntityId

    organization_id: TEntityId
    organization: IOrganization

    media_id: string | null
    media: IMedia

    type: branchTypeEnum
    name: string
    email: string

    description?: string
    country_code?: string
    contact_number?: string

    address: string
    province: string
    city: string
    region: string
    barangay: string
    postal_code: string

    latitude: number
    longitude: number

    is_main_branch: boolean

    // branch_setting: IBranchSettings
}

export interface IBranchRequest {
    id?: TEntityId

    media_id: string | null

    type: branchTypeEnum
    name: string
    email: string

    description: string
    country_code: string
    contact_number: string

    address: string
    province: string
    city: string
    region: string
    barangay: string
    postal_code: string

    latitude?: number
    longitude?: number

    is_main_branch: boolean
    is_admin_verified?: boolean
}

export interface IBranchPaginated extends IPaginatedResult<IBranch> {}

export const branchRequestSchema = z.object({
    media: z.any(),
    type: z.nativeEnum(branchTypeEnum),
    name: z.string().min(1, 'Name is Required'),
    email: z.string().email('Invalid Email').min(1, 'Email is Required'),
    description: descriptionSchema
        .min(15, 'Description is Required, Min of 15 Characters')
        .max(150, 'Description only 150 characters long')
        .transform(descriptionTransformerSanitizer),
    country_code: z.string().min(2, 'Country code is required'),
    contact_number: z
        .string()
        .min(11, 'Contact Number is at least 11 Characters'),
    address: z.string().min(1, 'Address is required'),
    province: z.string().min(1, 'Province is required'),
    city: z.string().min(1, 'City is required'),
    region: z.string().min(1, 'Region is required'),
    barangay: z.string().min(1, 'Barangay is required'),
    postal_code: z.string().min(4, 'Postal code is required'),
    latitude: z.coerce.number().optional(),
    longitude: z.coerce.number().optional(),
    is_main_branch: z.boolean().optional().default(false),
})
