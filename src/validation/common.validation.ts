// This handles all common validations that are handles everywhere
import z from 'zod'

import {
    CIVIL_STATUS,
    GENERAL_STATUS,
    LETTERS_REGEX,
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

export const SexSchema = z.enum(SEX, 'Please select a valid sex')
