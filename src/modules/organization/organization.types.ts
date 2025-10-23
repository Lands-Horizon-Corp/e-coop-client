import {
    IAuditable,
    IPaginatedResult,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { IMedia } from '../media/media.types'
import { IOrganizationCategory } from '../organization-category'
import { IOrganizationMedia } from '../organization-media'
import { ISubscriptionPlan } from '../subscription-plan'
import { IUserOrganization } from '../user-organization'

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

    organization_medias: IOrganizationMedia[]

    organization_categories?: IOrganizationCategory[]
    currency_id: TEntityId
    is_private?: boolean
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
    currency_id?: TEntityId
}

export interface IOrganizationPaginated
    extends IPaginatedResult<IOrganization> {}

export interface ICreateOrganizationResponse {
    organization: IOrganization
    user_organization: IUserOrganization
}

export type IOrganizationWithPolicies = IOrganization & {
    privacy_policy: string
    refund_policy: string
    terms_and_conditions: string
    user_agreement: string
    cookie_policy: string
}
