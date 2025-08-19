import z from 'zod'

import { entityIdSchema } from '@/validation'

export const organizationDailyUsageSchema = z.object({
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

export type OrganizationDailyUsageSchema = z.infer<
    typeof organizationDailyUsageSchema
>
