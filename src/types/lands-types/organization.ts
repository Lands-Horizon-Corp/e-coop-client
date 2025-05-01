import { ISubscriptionPlan } from './subscription-plan'
import { IBranch, IMedia, IPaginatedResult } from '../coop-types'
import { IAuditable, ITimeStamps, TEntityId } from '../common'

export type TOrganizationMigrationStatus =
    | 'pending'
    | 'migrating'
    | 'seeding'
    | 'completed'
    | 'canceled'
    | 'error'

// Organization Resource
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

    branches: IBranch[]
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

    organization_key: string
    subscription_plan_id: TEntityId

    subscription_start_date: string
    subscription_end_date: string

    database_host?: string
    database_port?: string
    database_name?: string
    database_password?: string
    database_remark?: string
}

export interface IOrganizationPaginated
    extends IPaginatedResult<IOrganization> {}
