import {
    IAuditable,
    IPaginatedResult,
    ITimeStamps,
    TCivilStatus,
    TEntityId,
    TGeneralStatus,
} from '@/types'

import { IBranch } from '../branch'
import { IMedia } from '../media/media.types'
import {
    IMemberAddress,
    IMemberAddressRequest,
} from '../member-address/member-address.types'
import {
    IMemberAsset,
    IMemberAssetRequest,
} from '../member-asset/member-asset.types'
import { IMemberCenter } from '../member-center/member-center.types'
import { IMemberClassification } from '../member-classification/member-classification.types'
import {
    IMemberCloseRemark,
    IMemberCloseRemarkRequest,
} from '../member-close-remark/member-close-remark.types'
import {
    IMemberContactReference,
    IMemberContactReferenceRequest,
} from '../member-contact-reference/member-contact-reference.types'
import { IMemberDepartment } from '../member-department/member-department.types'
import { IMemberDescriptionRequest } from '../member-description-schema/member-description-schema.types'
import { IMemberEducationalAttainment } from '../member-educational-attainment/member-educational-attainment.types'
import {
    IMemberExpense,
    IMemberExpenseRequest,
} from '../member-expense/member-expense.types'
import { IMemberGender } from '../member-gender/member-gender.types'
import {
    IMemberGovernmentBenefit,
    IMemberGovernmentBenefitRequest,
} from '../member-government-benefit/member-government-benefit.types'
import { IMemberGroup } from '../member-group/member-group.types'
import { IMemberIncome } from '../member-income'
import {
    IMemberJointAccount,
    IMemberJointAccountRequest,
} from '../member-joint-account/member-joint-account.types'
import { IMemberOccupation } from '../member-occupation/member-occupation.types'
import { IMemberRecruitedMembers } from '../member-recruits/member-recruits.types'
import {
    IMemberRelativeAccount,
    IMemberRelativeAccountRequest,
} from '../member-relative-account/member-relative-account.types'
import { IMemberType } from '../member-type/member-type.types'
import { IOrganization } from '../organization'
import { IQrScanResult } from '../qr-crypto'
import { IUserBase } from '../user/user.types'
import {
    TMemberProfileMembershipInfoSchema,
    TQuickCreateMemberProfileSchema,
} from './member-profile.validation'

// Mini Create Only use for quick creation of member profile
// Ideal because of ease of creation
// Should Only use by employee
export type IMemberProfileQuickCreateRequest = TQuickCreateMemberProfileSchema

export interface IMemberProfileRequest {
    id?: TEntityId
    oldReferenceId?: string
    passbookNumber?: string

    firstName: string
    middleName?: string
    lastName: string
    suffix?: string

    notes: string
    description: string
    contactNumber: string
    civilStatus: TCivilStatus
    occupationId?: TEntityId
    businessAddress?: string
    businessContact?: string

    status: TGeneralStatus
    isClosed: boolean

    isMutualFundMember: boolean
    isMicroFinanceMember: boolean

    mediaId?: TEntityId
    media?: IMedia //This is just for form media display, not actually needed in backend

    memberId?: TEntityId
    branchId?: TEntityId
    memberTypeId?: TEntityId
    memberGenderId?: TEntityId
    memberCenterId?: TEntityId
    memberClassificationId?: TEntityId
    memberEducationalAttainmentId?: TEntityId

    memberIncome?: IMemberIncomeRequest[]
    memberAssets?: IMemberAssetRequest[]
    member_addresses: IMemberAddressRequest[]
    memberExpenses?: IMemberExpenseRequest[]
    memberDescriptions?: IMemberDescriptionRequest[]
    memberCloseRemarks?: IMemberCloseRemarkRequest[]
    memberJointAccounts?: IMemberJointAccountRequest[]
    memberRelativeAccounts?: IMemberRelativeAccountRequest[]
    memberGovernmentBenefits?: IMemberGovernmentBenefitRequest[]
    memberContactNumberReferences: IMemberContactReferenceRequest[]
}

export interface IMemberProfile extends ITimeStamps, IAuditable {
    id: TEntityId

    branch_id: TEntityId
    branch: IBranch

    organization_id: TEntityId
    organization: IOrganization

    user_id?: TEntityId
    user?: IUserBase

    media_id?: TEntityId
    media?: IMedia

    signature_id?: TEntityId
    signature?: IMedia

    member_type_id?: TEntityId
    member_type?: IMemberType

    member_group_id: TEntityId
    member_group: IMemberGroup

    member_gender_id: TEntityId
    member_gender: IMemberGender

    member_center_id: TEntityId
    member_center: IMemberCenter

    signature_media_id: TEntityId
    signature_media: IMedia

    member_occupation_id: TEntityId
    member_occupation: IMemberOccupation

    member_classification_id: TEntityId
    member_classification: IMemberClassification

    member_verified_by_employee_user_id: TEntityId
    member_verified_by_employee_user: IUserBase

    member_department_id?: TEntityId
    member_department?: IMemberDepartment

    recruited_by_member_profile_id: TEntityId
    recruited_by_member_profile: IMemberProfile

    is_closed: boolean
    is_mutual_fund_member: boolean
    is_micro_finance_member: boolean

    first_name: string
    middle_name?: string
    last_name: string
    full_name: string
    suffix?: string
    birthdate?: string
    status: TGeneralStatus

    description: string
    notes: string
    contact_number: string
    old_reference_id: string // OLD PB NUMBER

    passbook: string
    occupation: string

    business_address: string
    business_contact_number: string
    civil_status: TCivilStatus

    qr_code: IQrScanResult<string, 'member-qr'>

    // occupationId?: TEntityId

    // memberEducationalAttainmentId?: TEntityId
    member_educational_attainments?: IMemberEducationalAttainment[]

    recruited_members?: IMemberRecruitedMembers[]

    member_assets?: IMemberAsset[]
    member_incomes?: IMemberIncome[]
    // memberWallets?: IMemberWallet[] // ano to desu
    member_addresses?: IMemberAddress[]
    member_expenses?: IMemberExpense[]
    // memberDescriptions?: IMemberDescription[]
    member_close_remarks?: IMemberCloseRemark[]
    member_joint_accounts?: IMemberJointAccount[]
    member_relative_accounts?: IMemberRelativeAccount[]
    member_government_benefits?: IMemberGovernmentBenefit[]
    // memberMutualFundsHistory?: IMemberMutualFundsHistory[]
    member_contact_references?: IMemberContactReference[]

    longitude?: number
    latitude?: number
}

export interface IMemberProfilePaginated
    extends IPaginatedResult<IMemberProfile> {}

export type IMemberProfilePicker = Pick<
    IMemberProfile,
    'id' | 'old_reference_id' | 'passbook' | 'notes' | 'description'
>

export interface IMemberIncomeRequest {
    id?: TEntityId

    member_profile_id: TEntityId
    media_id?: TEntityId
    branch_id?: TEntityId

    name: string
    amount: number
    release_date: string
}

// THIS IS ONLY USE FOR MEMBER PROFILE UPDATE
// 📌 Identity & Personal Info
export interface IMemberProfilePersonalInfoRequest {
    first_name: string
    middle_name?: string
    last_name: string
    full_name?: string
    suffix?: string
    member_gender_id?: TEntityId
    birthdate?: string
    contact_number?: string
    business_contact_number?: string

    civil_status: TCivilStatus

    occupation_id?: TEntityId

    business_address?: string
    business_contact?: string

    notes?: string
    description?: string
}

// 🏛️ Membership Info
export type IMemberProfileMembershipInfoRequest =
    TMemberProfileMembershipInfoSchema

export interface IMemberProfileAccountRequest {
    user_id?: TEntityId
}

export interface IMemberProfileMediasRequest {
    media_id?: TEntityId
    signature_media_id?: TEntityId
}
