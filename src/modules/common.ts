import {
    AccountClosureReasons,
    CIVIL_STATUS,
    EDUCATIONAL_ATTAINMENT,
    FAMILY_RELATIONSHIP,
    GENERAL_STATUS,
    LETTERS_REGEX,
    NUMBER_LETTER_REGEX,
    PASSWORD_MIN_LENGTH,
    TAG_CATEGORY,
    USER_TYPE,
} from '@/constants'
import {
    COMPUTATION_TYPE,
    LOAN_AMORTIZATION_TYPE,
    LOAN_COLLECTOR_PLACE,
    LOAN_COMAKER_TYPE,
    LOAN_MODE_OF_PAYMENT,
    LOAN_TYPE,
    WEEKDAYS,
} from '@/constants/loan'
import { sanitizeHtml } from '@/helpers/sanitizer'
import z from 'zod/v4'

import { IOrganization } from './organization'
import { IUserBase } from './user/user.types'

export type TEntityId = string

export type TUserType = (typeof USER_TYPE)[number]

export type TGeneralStatus = (typeof GENERAL_STATUS)[number]

export type TRelationship = (typeof FAMILY_RELATIONSHIP)[number]

export type TTagCategory = (typeof TAG_CATEGORY)[number]

export interface ILongLat {
    longitude?: number
    latitude?: number
}

/* Extend interface if gusto magka ts type neto */
export interface IAuditable {
    created_by_id?: TEntityId
    created_by?: IUserBase

    updated_by_id?: TEntityId
    updated_by?: IUserBase

    deleted_by_id?: TEntityId
    deleted_by?: IUserBase
}

/* Only use this for entity that has branch_id */
export interface IIDentity {
    branch_id: TEntityId
    // branch: IBranch
}

export interface IOrgIdentity {
    organization_id: TEntityId
    organization: IOrganization
}

/* Identity of the entity */
export interface IOrgBranchIdentity {
    organization_id: TEntityId
    organization: IOrganization

    branch_id: TEntityId
    // branch: IBranch
}

/* Use this only if entity has timestamps, auditable, and has org and branch */
export interface IBaseEntityMeta
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
}

export interface ITimeStamps {
    deleted_at?: string | undefined
    created_at: string
    updated_at?: string
}

export type TCivilStatus = (typeof CIVIL_STATUS)[number]

export type TAccountClosureReasonType = (typeof AccountClosureReasons)[number]

export type TEducationalAttainment = (typeof EDUCATIONAL_ATTAINMENT)[number]

export interface UpdateIndexRequest {
    id: TEntityId
    index: number
}

export const entityIdSchema = z.string().uuidv4()

interface IPages {
    page: string
    pageIndex: string
}

export interface IPaginatedResult<T> {
    data: T[]
    pageIndex: number
    totalPage: number
    pageSize: number
    totalSize: number
    pages: IPages[]
}

export type TLoanModeOfPayment = (typeof LOAN_MODE_OF_PAYMENT)[number]

export type TWeekdays = (typeof WEEKDAYS)[number]

export type TLoanCollectorPlace = (typeof LOAN_COLLECTOR_PLACE)[number]

export type TLoanComakerType = (typeof LOAN_COMAKER_TYPE)[number]

export type TLoanType = (typeof LOAN_TYPE)[number]

export type TLoanAmortizationType = (typeof LOAN_AMORTIZATION_TYPE)[number]

export type TComputationType = (typeof COMPUTATION_TYPE)[number]

export const descriptionTransformerSanitizer = <T>(val: T) => {
    if (typeof val === 'string') {
        return sanitizeHtml(val)
    }
    return val
}

export const descriptionSchema = z.coerce
    .string()
    .min(1, 'Description is required')

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
    message: `Valid options are ${USER_TYPE.join(',')}`,
})

export const emailSchema = z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email')

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

export const civilStatusSchema = z.enum(CIVIL_STATUS)

export const educationalAttainmentSchema = z.enum(EDUCATIONAL_ATTAINMENT)

export const familyRelationshipSchema = z.enum(FAMILY_RELATIONSHIP)

export const TEntityId = z.string()
