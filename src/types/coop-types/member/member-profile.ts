import { IMedia } from '../media'
import { IUserBase } from '../../auth'
import { IMemberExpense, IMemberExpenseRequest } from './member-expense'
import { IMemberDescriptionRequest } from './member-description'
import {
    IMemberJointAccount,
    IMemberJointAccountRequest,
} from './member-joint-account'
import {
    IMemberRelativeAccount,
    IMemberRelativeAccountRequest,
} from './member-relative-account'
import {
    IMemberGovernmentBenefit,
    IMemberGovernmentBenefitRequest,
} from './member-government-benefit'

import {
    TEntityId,
    IAuditable,
    ITimeStamps,
    TCivilStatus,
    TGeneralStatus,
} from '../../common'
import { IBranch } from '../branch'
import { IMemberType } from './member-type'
import { IMemberGender } from './member-gender'
import { IMemberCenter } from './member-center'
import { IPaginatedResult } from '../paginated-result'
import { IMemberIncome, IMemberIncomeRequest } from './member-income'
import { IMemberAsset, IMemberAssetRequest } from './member-asset'
import { IMemberOccupation } from './member-occupation'
import { IMemberAddress, IMemberAddressRequest } from './member-address'
import { IMemberClassification } from './member-classification'
import {
    IMemberCloseRemark,
    IMemberCloseRemarkRequest,
} from './member-close-remark'
import {
    IMemberContactReferenceRequest,
    IMemberContactReference,
} from './member-contact-reference'
import { IMemberEducationalAttainment } from './member-educational-attainment'
import { IOrganization } from '@/types/lands-types'
import { IMemberRecruits } from './member-recruits'

// Mini Create Only use for quick creation of member profile
// Ideal because of ease of creation
// Should Only use by employee
export interface IMemberProfileQuickCreateRequest {
    old_reference_id?: string
    passbook?: string

    organization_id: TEntityId
    branch_id: TEntityId

    first_name: string
    middle_name?: string
    last_name: string
    full_name?: string
    suffix?: string
    member_gender_id?: TEntityId
    birth_date?: string
    contact_number?: string

    civil_status: TCivilStatus
    occupation_id?: TEntityId

    status: TGeneralStatus

    is_mutual_fund_member: boolean
    is_micro_finance_member: boolean

    member_type_id: TEntityId
    member_classification_id: TEntityId
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

    user_id: TEntityId
    user: IUserBase

    media_id?: TEntityId
    media?: IMedia

    signature_id?: TEntityId
    signature?: IMedia

    member_type_id: TEntityId
    member_type: IMemberType

    member_group_id: TEntityId
    // TODO: Add member group

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

    recruited_by_member_profile_id: TEntityId
    recruited_by_member_profile: IMemberProfile

    is_close: boolean
    is_mutual_fund_member: boolean
    is_micro_finance_member: boolean

    first_name: string
    middle_name?: string
    last_name: string
    full_name: string
    suffix?: string
    birth_date?: string
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

    // occupationId?: TEntityId

    // memberEducationalAttainmentId?: TEntityId
    member_educational_attainment?: IMemberEducationalAttainment[]

    member_assets?: IMemberAsset[]
    member_income?: IMemberIncome[]
    // memberWallets?: IMemberWallet[] // ano to desu
    member_addresses?: IMemberAddress[]
    member_recruits?: IMemberRecruits[]
    member_expenses?: IMemberExpense[]
    // memberDescriptions?: IMemberDescription[]
    member_close_remarks?: IMemberCloseRemark[]
    member_joint_accounts?: IMemberJointAccount[]
    member_relative_accounts?: IMemberRelativeAccount[]
    member_government_benefits?: IMemberGovernmentBenefit[]
    // memberMutualFundsHistory?: IMemberMutualFundsHistory[]
    member_contact_number_references?: IMemberContactReference[]
}

export interface IMemberProfilePaginated
    extends IPaginatedResult<IMemberProfile> {}

export type IMemberProfilePicker = Pick<
    IMemberProfile,
    'id' | 'old_reference_id' | 'passbook' | 'notes' | 'description'
>
