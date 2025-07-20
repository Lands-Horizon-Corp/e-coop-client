import z from 'zod'

import {
    entityIdSchema,
    organizationBranchIdsSchema,
} from '@/validations/common'

export const browseExcludeIncludeAccountsSchema = z
    .object({
        computation_sheet_id: entityIdSchema?.optional(),

        fines_account_id: entityIdSchema?.optional(),
        comaker_account_id: entityIdSchema?.optional(),
        interest_account_id: entityIdSchema?.optional(),
        deliquent_account_id: entityIdSchema?.optional(),
        include_existing_loan_account_id: entityIdSchema?.optional(),
    })
    .merge(organizationBranchIdsSchema)
