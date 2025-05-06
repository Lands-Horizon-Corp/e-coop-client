import z from 'zod'
import {
    LETTERS_REGEX,
    NUMBER_LETTER_REGEX,
    PASSWORD_MIN_LENGTH,
} from '@/constants'

const AccountTypes = ['Member', 'Owner', 'Admin', 'Employee'] as const

export const userAccountTypeSchema = z.enum(AccountTypes, {
    required_error: 'Account type is required',
    message: `Valid options are ${AccountTypes.join(',')}`,
    invalid_type_error: `Valid options are ${AccountTypes.join(',')}`,
})

export const emailSchema = z
    .string({ required_error: 'Email is required' })
    .email('Invalid email')

export const userNameSchema = z
    .string({ required_error: 'Username is required' })
    .min(1, 'Username is required')

export const firstNameSchema = z
    .string({ required_error: 'First Name is required' })
    .min(1, 'First Name too short')
    .regex(LETTERS_REGEX, 'First Name must contain only letters')

export const middleNameSchema = z
    .string()
    .transform((val) => val || undefined)
    .optional()

export const lastNameSchema = z
    .string({ required_error: 'Last Name is required' })
    .min(1, 'Last Name is required')
    .regex(LETTERS_REGEX, 'Last Name must contain only letters')

export const permanentAddressSchema = z
    .string()
    .min(1, 'Permanent address is required')

export const passwordSchema = z
    .string({ required_error: 'Password is required' })
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

export const otpCodeSchema = z
    .string()
    .min(6, 'OTP must be 6 alphanumeric characters')
    .max(6, 'OTP must be 6 alphanumeric characters')
    .regex(NUMBER_LETTER_REGEX, 'OTP must be valid alphanumeric characters')

export const contactNumberSchema = z.string().min(1, 'Contact Number is empty')

export const accountStatusSchema = z.enum([
    'Pending',
    'Verified',
    'Not Allowed',
])

export const civilStatusSchema = z.enum([
    'Married',
    'Single',
    'Widowed',
    'Separated',
    'N/A',
])

export const entityIdSchema = z.coerce.string().uuid('Invalid Id')

export const mediaSchema = z.object({
    id: entityIdSchema,
    fileName: z.string(),
    fileSize: z.number(),
    fileType: z.string(),
    storageKey: z.string(),
    url: z.string().optional().default(''),
    bucketName: z.string(),
    createdAt: z.string(),
    updatedAt: z.string().optional(),
    downloadURL: z.string(),
})
