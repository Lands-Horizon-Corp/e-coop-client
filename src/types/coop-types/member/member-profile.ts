import { IOrganization } from '@/types/lands-types'

import { ISignUpRequest, IUserBase } from '../../auth'
import {
    IAuditable,
    ITimeStamps,
    TCivilStatus,
    TEntityId,
    TGeneralStatus,
} from '../../common'
import { IQrScanResult } from '../../qr/index'
import { IBranch } from '../branch'
import { IMedia } from '../media'
import { IPaginatedResult } from '../paginated-result'
import { IMemberAddress, IMemberAddressRequest } from './member-address'
import { IMemberAsset, IMemberAssetRequest } from './member-asset'
import { IMemberCenter } from './member-center'
import { IMemberClassification } from './member-classification'
import {
    IMemberCloseRemark,
    IMemberCloseRemarkRequest,
} from './member-close-remark'
import {
    IMemberContactReference,
    IMemberContactReferenceRequest,
} from './member-contact-reference'
import { IMemberDepartment } from './member-department'
import { IMemberDescriptionRequest } from './member-description'
import { IMemberEducationalAttainment } from './member-educational-attainment'
import { IMemberExpense, IMemberExpenseRequest } from './member-expense'
import { IMemberGender } from './member-gender'
import {
    IMemberGovernmentBenefit,
    IMemberGovernmentBenefitRequest,
} from './member-government-benefit'
import { IMemberGroup } from './member-group'
import { IMemberIncome, IMemberIncomeRequest } from './member-income'
import {
    IMemberJointAccount,
    IMemberJointAccountRequest,
} from './member-joint-account'
import { IMemberOccupation } from './member-occupation'
import { IMemberRecruitedMembers } from './member-recruits'
import {
    IMemberRelativeAccount,
    IMemberRelativeAccountRequest,
} from './member-relative-account'
import { IMemberType } from './member-type'

// For creation of member user account
export interface IMemberProfileUserAccountRequest
    extends Omit<ISignUpRequest, 'password'> {
    id?: TEntityId
    password?: string
}

// Mini Create Only use for quick creation of member profile
// Ideal because of ease of creation
// Should Only use by employee
export interface IMemberProfileQuickCreateRequest {
    old_reference_id?: string
    passbook?: string

    organization_id?: TEntityId
    branch_id?: TEntityId

    first_name: string
    middle_name?: string
    last_name: string
    full_name?: string
    suffix?: string
    member_gender_id?: TEntityId
    birthdate?: string
    contact_number?: string

    civil_status: TCivilStatus
    occupation_id?: TEntityId

    status: TGeneralStatus

    is_mutual_fund_member: boolean
    is_micro_finance_member: boolean

    member_type_id: TEntityId

    // Prior Connect

    user_id?: TEntityId

    // Or Create User Account
    account_info?: Pick<ISignUpRequest, 'user_name' | 'email' | 'password'>
}

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

    member_type_id: TEntityId
    member_type: IMemberType

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
}

export interface IMemberProfilePaginated
    extends IPaginatedResult<IMemberProfile> {}

export type IMemberProfilePicker = Pick<
    IMemberProfile,
    'id' | 'old_reference_id' | 'passbook' | 'notes' | 'description'
>
