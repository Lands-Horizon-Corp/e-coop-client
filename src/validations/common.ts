import z from 'zod'

import {
    CIVIL_STATUS,
    EDUCATIONAL_ATTAINMENT,
    FAMILY_RELATIONSHIP,
    GENERAL_STATUS,
    LETTERS_REGEX,
    NUMBER_LETTER_REGEX,
    PASSWORD_MIN_LENGTH,
    USER_TYPE,
} from '@/constants'
import { sanitizeNumberInput } from '@/helpers'
import { sanitizeHtml } from '@/utils/sanitizer'

export const entityIdSchema = z.coerce.string().uuid('Invalid')

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

export const userAccountTypeSchema = z.enum(USER_TYPE, {
    required_error: 'Account type is required',
    message: `Valid options are ${USER_TYPE.join(',')}`,
    invalid_type_error: `Valid options are ${USER_TYPE.join(',')}`,
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

export const stringDateSchema = z.string().date()

export const stringDateWithTransformSchema = z.coerce
    .string()
    .date()
    .transform((val) => new Date(val).toISOString())

export const otpCodeSchema = z
    .string()
    .min(6, 'OTP must be 6 alphanumeric characters')
    .max(6, 'OTP must be 6 alphanumeric characters')
    .regex(NUMBER_LETTER_REGEX, 'OTP must be valid alphanumeric characters')

export const contactNumberSchema = z.string().min(1, 'Contact Number is empty')

export const generalStatusSchema = z.enum(GENERAL_STATUS)

export const civilStatusSchema = z.enum(CIVIL_STATUS)

export const educationalAttainmentSchema = z.enum(EDUCATIONAL_ATTAINMENT)

export const familyRelationshipSchema = z.enum(FAMILY_RELATIONSHIP)

export const TEntityId = z.string()

// export const amount = z.preprocess(
//     (val) => {
//         if (typeof val === 'string') {
//             const sanitized = sanitizeNumberInput(val);

//             // If it's an empty string or just a dot, treat as undefined for initial parsing.
//             // This allows the input to temporarily be empty or "." during typing without error.
//             if (sanitized === '' || sanitized === '.') {
//                 return undefined;
//             }

//             // Reject if multiple decimal points
//             if ((sanitized.match(/\./g)?.length ?? 0) > 1) {
//                 return undefined; // Or throw a specific error, depending on desired strictness
//             }

//             const parsed = parseFloat(sanitized);

//             // If parsed is NaN, or if it was supposed to be a number but resulted in 0 (e.g., "0"),
//             // return undefined to trigger `required_error` or `invalid_type_error` if needed.
//             // Be careful with `parsed === 0`. If `0` is a valid amount, remove `|| parsed === 0`.
//             if (isNaN(parsed)) {
//                 return undefined;
//             }

//             return parsed;
//         }

//         return typeof val === 'number' && !isNaN(val) && val !== 0
//             ? val
//             : undefined;
//     },
//     z.number({
//         required_error: 'Amount is required',
//         invalid_type_error: 'Amount must be a number',
//     })
//     .min(0.01, "Amount must be greater than zero")
// )
//

export const descriptionTransformerSanitizer = <T>(val: T) => {
    if (typeof val === 'string') {
        return sanitizeHtml(val)
    }

    return val
}

export const descriptionSchema = z.coerce
    .string()
    .min(1, 'Description is required')

export const amount = z.preprocess(
    (val) => {
        if (typeof val === 'string') {
            const sanitized = sanitizeNumberInput(val)

            if ((sanitized.match(/\./g)?.length ?? 0) > 1) {
                return undefined
            }

            const parsed = parseFloat(sanitized)

            return sanitized === '' || isNaN(parsed) || parsed === 0
                ? undefined
                : parsed
        }

        return typeof val === 'number' && !isNaN(val) && val !== 0
            ? val
            : undefined
    },
    z
        .number({
            invalid_type_error: 'Amount must be a number',
        })
        .min(0.01, 'Amount must be greater than zero')
        .max(1000000, 'Amount cannot exceed 1,000,000')
)
