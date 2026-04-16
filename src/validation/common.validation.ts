// This handles all common validations that are handles everywhere
import z from 'zod'

import {
    CIVIL_STATUS,
    GENERAL_STATUS,
    LETTERS_REGEX,
    MONTHS,
    NUMBER_LETTER_REGEX,
    PASSWORD_MIN_LENGTH,
    SEX,
} from '@/constants'

export const entityIdSchema = z.uuidv4()
export const EntityIdSchema = (fieldName: string = 'Field') =>
    z.uuidv4({ error: `${fieldName} is required` })

export const descriptionSchema = z.coerce.string({
    error: 'Description is required',
})

export const organizationBranchIdsSchema = z.object({
    organization_id: entityIdSchema.optional(),
    branch_id: entityIdSchema.optional(),
})

export const mediaSchema = z.object({
    id: entityIdSchema.optional(),
    file_name: z.string(),
    file_size: z.number(),
    file_type: z.string(),
    storage_key: z.string(),
    url: z.string().optional().default(''),
    download_url: z.string(),
    bucket_name: z.string(),
    created_at: z.string(),
    updated_at: z.string().optional(),
    deleted_at: z.string().optional(),
})

export const emailSchema = z.email('Invalid email address')

export const userNameSchema = z.string().min(1, 'Username is required')

export const firstNameSchema = z
    .string('First Name is required')
    .min(1, 'First Name too short')
    .regex(LETTERS_REGEX, 'First Name must contain only letters')

export const middleNameSchema = z
    .string()
    .transform((val) => val || undefined)
    .optional()

export const lastNameSchema = z
    .string()
    .min(1, 'Last Name is required')
    .regex(LETTERS_REGEX, 'Last Name must contain only letters')

export const permanentAddressSchema = z
    .string()
    .min(1, 'Permanent address is required')

export const passwordSchema = z
    .string()
    .min(1, 'Password is required')
    .min(
        PASSWORD_MIN_LENGTH,
        `Password must atleast ${PASSWORD_MIN_LENGTH} characters`
    )

export const birthDateSchema = z.coerce.date().refine(
    (date) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return date < today
    },
    { message: 'Birthdate cannot be today or in the future' }
)

export const stringDateSchema = z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format',
    })

export const stringDateWithTransformSchema = z.coerce
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format',
    })
    .transform((val) => new Date(val).toISOString())

export const otpCodeSchema = z
    .string()
    .min(6, 'OTP must be 6 alphanumeric characters')
    .max(6, 'OTP must be 6 alphanumeric characters')
    .regex(NUMBER_LETTER_REGEX, 'OTP must be valid alphanumeric characters')

export const contactNumberSchema = z.string().min(1, 'Contact Number is empty')

export const generalStatusSchema = z.enum(GENERAL_STATUS)

export const civilStatusSchema = z.enum(CIVIL_STATUS) //TODO: MOVE TO member profile constant.ts

export const PercentageSchema = z.coerce
    .number('Must be valid percentage')
    .min(0, 'Minimum 0 %')
    .max(100, 'Max is 100 %')

export const DaySchema = z.coerce.number('Must be a number').int().nonnegative()

export const MonthSchema = z.union(
    MONTHS.map((m) => z.literal(m.value)) as [
        z.ZodLiteral<number>,
        ...z.ZodLiteral<number>[],
    ]
)

export const YearSchema = z.coerce
    .number({ error: 'Invalid year' })
    .min(1900, 'Year must be 1900 or later')

export const SexSchema = z.enum(SEX, 'Please select a valid sex')

export const SignatureSchema = z.object({
    prepared_by_signature_media_id: entityIdSchema.optional(),
    prepared_by_signature_media: z.any(),
    prepared_by_name: z.coerce.string().optional(),
    prepared_by_position: z.coerce.string().optional(),

    certified_by_signature_media_id: entityIdSchema.optional(),
    certified_by_signature_media: z.any(),
    certified_by_name: z.coerce.string().optional(),
    certified_by_position: z.coerce.string().optional(),

    approved_by_signature_media_id: entityIdSchema.optional(),
    approved_by_signature_media: z.any(),
    approved_by_name: z.coerce.string().optional(),
    approved_by_position: z.coerce.string().optional(),

    verified_by_signature_media_id: entityIdSchema.optional(),
    verified_by_signature_media: z.any(),
    verified_by_name: z.coerce.string().optional(),
    verified_by_position: z.coerce.string().optional(),

    check_by_signature_media_id: entityIdSchema.optional(),
    check_by_signature_media: z.any(),
    check_by_name: z.coerce.string().optional(),
    check_by_position: z.coerce.string().optional(),

    acknowledge_by_signature_media_id: entityIdSchema.optional(),
    acknowledge_by_signature_media: z.any(),
    acknowledge_by_name: z.coerce.string().optional(),
    acknowledge_by_position: z.coerce.string().optional(),

    noted_by_signature_media_id: entityIdSchema.optional(),
    noted_by_signature_media: z.any(),
    noted_by_name: z.coerce.string().optional(),
    noted_by_position: z.coerce.string().optional(),

    posted_by_signature_media_id: entityIdSchema.optional(),
    posted_by_signature_media: z.any(),
    posted_by_name: z.coerce.string().optional(),
    posted_by_position: z.coerce.string().optional(),

    paid_by_signature_media_id: entityIdSchema.optional(),
    paid_by_signature_media: z.any(),
    paid_by_name: z.coerce.string().optional(),
    paid_by_position: z.coerce.string().optional(),
})

export const WithSignatureSchema = z.object({
    signatures: SignatureSchema,
})
