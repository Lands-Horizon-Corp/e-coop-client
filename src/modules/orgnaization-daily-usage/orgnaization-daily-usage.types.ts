import z from 'zod'

import { TEntityId, entityIdSchema } from '../common'
import { IOrganization } from '../organization'

export interface IOrganizationDailyUsageRequest {
    id?: TEntityId
    organization_id: TEntityId
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

export interface IOrganizationDailyUsageResponse {
    id: TEntityId
    created_at: string
    updated_at: string
    organization_id: TEntityId
    organization?: IOrganization
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

export const organizationDailyUsageRequestSchema = z.object({
    id: entityIdSchema.optional(),
    organization_id: entityIdSchema,
    total_members: z.number().min(0),
    total_branches: z.number().min(0),
    total_employees: z.number().min(0),
    cash_transaction_count: z.number().min(0),
    check_transaction_count: z.number().min(0),
    online_transaction_count: z.number().min(0),
    cash_transaction_amount: z.number().min(0),
    check_transaction_amount: z.number().min(0),
    online_transaction_amount: z.number().min(0),
    total_email_send: z.number().min(0),
    total_message_send: z.number().min(0),
    total_upload_size: z.number().min(0),
    total_report_render_time: z.number().min(0),
})
