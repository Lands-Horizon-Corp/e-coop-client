import { z } from 'zod'

import {
    IAuditable,
    IPaginatedResult,
    ITimeStamps,
    TEntityId,
    entityIdSchema,
} from '../common'
import { IMedia } from '../media/media.types'
import { ISubscriptionPlan } from '../subscription-plan'

export type TOrganizationMigrationStatus =
    | 'pending'
    | 'migrating'
    | 'seeding'
    | 'completed'
    | 'canceled'
    | 'error'

// auth/current/org - for separate fetching instead of relying in current
export interface IOrganization extends ITimeStamps, IAuditable {
    id: TEntityId

    name: string
    address?: string
    email?: string
    contact_number?: string

    description?: string
    color?: string

    media_id?: TEntityId
    media?: IMedia

    cover_media_id?: TEntityId
    cover_media?: IMedia

    organization_key: string
    subscription_plan_id?: TEntityId
    subscription_plan?: ISubscriptionPlan

    subscription_start_date: string
    subscription_end_date: string

    database_host?: string
    database_port?: string
    database_name?: string
    database_password?: string
    database_migration_status: TOrganizationMigrationStatus
    database_remark?: string

    // branches: IBranch[]
}

// Organization Request
export interface IOrganizationRequest {
    id?: TEntityId

    name: string
    address?: string
    email?: string
    contact_number?: string

    description?: string
    color?: string

    media_id?: TEntityId

    cover_media_id?: TEntityId

    subscription_plan_id?: TEntityId

    terms_and_conditions?: string
    privacy_policy?: string
    cookie_policy?: string
    refund_policy?: string
    user_agreement?: string
    is_private?: boolean
    // organization_categories?: IOrganizationCategoryRequest[]
}

export interface IOrganizationPaginated
    extends IPaginatedResult<IOrganization> {}

// export interface ICreateOrganizationResponse {
//     organization: IOrganization
//     user_organization: IUserOrganization
// }

export type IOrganizationWithPolicies = IOrganization & {
    privacy_policy: string
    refund_policy: string
    terms_and_conditions: string
    user_agreement: string
    cookie_policy: string
}

export const TOrganizationMigrationStatus = z.enum([
    'pending',
    'migrating',
    'seeding',
    'completed',
    'canceled',
    'error',
])

export const OrganizationSchema = z.object({
    name: z.string().min(1, 'Organization name is required'),
    subscription_plan_id: entityIdSchema,
    address: z.string().optional(),
    email: z
        .string()
        .min(1, 'Email is Required')
        .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
            message: 'Invalid email',
        }),
    contact_number: z.string().optional(),
    // description: descriptionSchema
    //     .optional()
    //     .transform(descriptionTransformerSanitizer),
    media_id: z.string().min(1, 'Organization Logo is required'),
    cover_media_id: z.string().min(1, 'Cover media is required'),
})

export const EditOrganizationSchema = OrganizationSchema.extend({
    id: entityIdSchema.optional(),
    is_private: z.boolean().optional(),
    terms_and_conditions: z.string().optional(),
    privacy_policy: z.string().optional(),
    cookie_policy: z.string().optional(),
    refund_policy: z.string().optional(),
    user_agreement: z.string().optional(),
    media_id: z.string().optional(),
    cover_media_id: z.string().optional(),
})

export type Organization = z.infer<typeof OrganizationSchema>
