import z from 'zod'

import {
    mediaSchema,
    entityIdSchema,
    civilStatusSchema,
    generalStatusSchema,
    stringDateSchema,
} from '../common'
import { memberCenterSchema } from './member-center-schema'
import { memberAssetsSchema } from './member-assets-schema'
import { memberIncomeSchema } from './member-income-schema'
import { memberAddressSchema } from './member-address-schema'
import { memberExpenseSchema } from './member-expense-schema'
import { memberDescriptionSchema } from './member-description-schema'
import { memberCloseRemarkSchema } from './member-close-remark-schema'
import { memberGovernmentBenefitSchema } from './member-government-benefit'
import { memberJointAccountsSchema } from './member-joint-accounts-schema'
import { memberRelativeAccountsSchema } from './member-relative-accounts-schema'
import { memberContactReferenceSchema } from './member-contact-number-references-schema'

export const createMemberProfileSchema = z.object({
    id: entityIdSchema.optional(),
    oldReferenceId: z.string().optional(),
    passbookNumber: z.string().optional(),

    middleName: z.string().optional(),
    lastName: z.string().min(1, 'Lastname is required'),
    firstName: z.string().min(1, 'Firstname is required'),
    suffix: z.string().max(15).optional(),

    notes: z.string().min(1, 'Notes are required'),
    description: z.string().min(1, 'Description is required'),
    contactNumber: z.string().min(1, 'Contact number is required'),
    civilStatus: z
        .enum(['Married', 'Single', 'Widowed', 'Separated', 'N/A'])
        .default('Single'),
    occupationId: entityIdSchema.optional(),
    businessAddress: z.string().optional(),
    businessContact: z.string().optional(),

    status: z.enum(['Pending', 'Verified', 'Not Allowed']).default('Pending'),
    isClosed: z.boolean(),

    recruitedByMemberProfileId: entityIdSchema.optional(),
    recruitedByMemberProfile: z.any().optional(),

    isMutualFundMember: z.boolean().default(false),
    isMicroFinanceMember: z.boolean().default(false),

    memberCenterId: entityIdSchema.optional(),
    memberCenter: memberCenterSchema.optional(),

    mediaId: entityIdSchema.optional(),
    memberId: entityIdSchema.optional(),
    media: mediaSchema.optional(),

    signatureMediaId: entityIdSchema.optional(),
    signatureMedia: mediaSchema.optional(),

    memberTypeId: z
        .string()
        .min(1, 'Member Type is required')
        .uuid('Invalid member type'),
    branchId: entityIdSchema.optional(),
    memberGenderId: entityIdSchema.optional(),
    memberClassificationId: entityIdSchema.optional(),
    memberEducationalAttainmentId: entityIdSchema.optional(),

    member_addresses: z
        .array(memberAddressSchema)
        .min(1, 'Must provide at least 1 address'),

    memberContactNumberReferences: z
        .array(memberContactReferenceSchema)
        .min(1, 'Must provide at least 1 contact number'),

    memberIncome: z.array(memberIncomeSchema).optional(),
    memberAssets: z.array(memberAssetsSchema).optional(),
    memberExpenses: z.array(memberExpenseSchema).optional(),
    memberCloseRemarks: z.array(memberCloseRemarkSchema).optional(),
    memberDescriptions: z.array(memberDescriptionSchema).optional(),
    memberJointAccounts: z.array(memberJointAccountsSchema).optional(),
    memberGovernmentBenefitSchema: z
        .array(memberGovernmentBenefitSchema)
        .optional(),
    memberRelativeAccounts: z.array(memberRelativeAccountsSchema).optional(),
})

export const quickCreateMemberProfileSchema = z.object({
    old_reference_id: z.string().optional(),
    passbook: z.string().optional(),

    organization_id: entityIdSchema.optional(),
    branch_id: entityIdSchema.optional(),

    first_name: z.string().min(1, 'First name is required'),
    middle_name: z.string().optional(),
    last_name: z.string().min(1, 'Last name is required'),
    full_name: z.string().optional(),
    suffix: z.string().max(15).optional(),
    contact_number: z.string().optional(),
    birth_date: stringDateSchema.transform((val) =>
        new Date(val).toISOString()
    ),
    member_gender_id: entityIdSchema.optional(),

    civil_status: civilStatusSchema,
    occupation_id: entityIdSchema.optional(),

    status: generalStatusSchema.default('verified'),

    is_mutual_fund_member: z.boolean().default(false),
    is_micro_finance_member: z.boolean().default(false),

    member_type_id: entityIdSchema,
})
