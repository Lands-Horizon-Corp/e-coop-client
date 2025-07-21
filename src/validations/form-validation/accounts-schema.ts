import { z } from 'zod'

import { descriptionSchema, descriptionTransformerSanitizer } from '../common'

export const TAccountingAccountsEnum = z.enum([
    'Deposit',
    'Loan',
    'A/R-Ledger',
    'A/R-Aging',
    'Fines',
    'Interest',
    'SVF-Ledger',
    'W-Off',
    'A/P-Ledger',
    'Other',
])

export const TEarnedUnearnedInterestEnum = z.enum([
    'By Formula',
    'By Formula + Actual Pay',
    'By Advance Int. + Actual Pay',
    'None',
])

export const TOtherAccountInformationEnum = z.enum([
    'None',
    'Jewelry',
    'Field',
    'Grocery',
    'Track Loan Ded',
    'CIB/CIK Acct.',
    'COH Acct.',
])

export const TAccountingDefaultEnum = z.enum([
    'Loan',
    'Savings',
    'Withdraw',
    'None',
    'Time',
])

export const AccountRequestSchema = z.object({
    id: z.string(),
    companyId: z.string(),
    accountCode: z.string().min(5, 'Account Code is required'),
    description: descriptionSchema.transform(descriptionTransformerSanitizer),
    altDescription: descriptionSchema
        .optional()
        .transform(descriptionTransformerSanitizer),
    type: TAccountingAccountsEnum.default('Deposit'),
    maxAmount: z.coerce.number().optional(),
    minAmount: z.coerce.number().optional(),
    computationType: z.string().optional(),
    headerRow: z.coerce.number().optional(),
    centerRow: z.coerce.number().optional(),
    totalRow: z.coerce.number().optional(),
    print: z.boolean().optional(),
    addOn: z.boolean().optional(),
    allowRebate: z.boolean().optional(),
    taxable: z.boolean().optional(),
    finesAmort: z.coerce.number().optional(),
    finesMaturity: z.coerce.number().optional(),
    interestStandard: z.coerce.number().optional(),
    interestSecured: z.coerce.number().optional(),
    schemeNo: z.coerce.number().optional(),
    altCode: z.coerce.number().optional(),
    glCode: z.coerce.number().optional(),
    finesGpAmort: z.coerce.number().optional(),
    addtlGp: z.string().optional(),
    noGracePeriodDaily: z.boolean(),
    finesGpMaturity: z.coerce.number().optional(),
    earnedUnearnedInterest: TEarnedUnearnedInterestEnum.optional(),
    otherInformationOfAnAccount: TOtherAccountInformationEnum.optional(),
    accountingDefault: TAccountingDefaultEnum.optional(),
})

export const AccountResourceSchema = AccountRequestSchema.extend({
    createdAt: z.string(),
    updatedAt: z.string(),
    deletedAt: z.string().nullable().optional(),
})

export const AccountPaginatedResourceSchema = z.object({
    data: z.array(AccountResourceSchema),
    total: z.number(),
    page: z.number(),
    perPage: z.number(),
})
