import { IOrganization } from './organization'
import { IPaginatedResult } from '../coop-types'
import { ITimeStamps, TEntityId } from '../common'

export interface IOrganizationDailyUsage extends ITimeStamps {
    id: TEntityId
    organization_id: TEntityId
    organization: IOrganization

    total_members: number
    total_branches: number
    total_employees: number

    cash_transaction_count: number
    check_transaction_count: number
    online_transaction_count: number

    cash_transaction_amount: number
    check_transaction_amount: number
    online_transaction_amount: number

    total_email_send: number
    total_message_send: number
    total_upload_size: number
    total_report_render_time: number
}

export interface IOrganizationDailyUsagePaginated
    extends IPaginatedResult<IOrganizationDailyUsage> {}
