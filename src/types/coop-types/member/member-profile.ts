import { IMedia } from '../media'
import { IUserBase } from '../../auth'
import { IMemberExpensesRequest } from './member-expenses'
import { IMemberDescriptionRequest } from './member-description'
import { IMemberJointAccountRequest } from './member-joint-accounts'
import { IMemberRelativeAccountsRequest } from './member-relative-accounts'
import { IMemberGovernmentBenefitsRequest } from './member-government-benefits'

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
import { IMemberIncomeRequest } from './member-income'
import { IMemberAssetsRequest } from './member-assets'
import { IMemberOccupation } from './member-occupation'
import { IMemberAddressRequest } from './member-address'
import { IMemberClassification } from './member-classification'
import { IMemberCloseRemarkRequest } from './member-close-remark'
import { IMemberContactReferenceRequest } from './member-contact-references'

// Mini Create Only use for quick creation of member profile
// Ideal because of ease of creation
// Should Only use by employee
export interface IMemberProfileQuickCreateRequest {
    id?: TEntityId
    oldReferenceId?: string
    passbookNumber?: string

    organization_id: TEntityId
    branch_id: TEntityId

    firstName: string
    middleName?: string
    lastName: string
    suffix?: string
    member_gender_id?: TEntityId

    civilStatus: TCivilStatus
    occupationId?: TEntityId

    status: 'Pending' | 'Verified' | 'Not Allowed'

    is_mutual_fund_member: boolean
    is_micro_finance_member: boolean

    member_type_id?: TEntityId
    member_classification_id?: TEntityId
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

    status: 'Pending' | 'Verified' | 'Not Allowed'
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
    memberAssets?: IMemberAssetsRequest[]
    memberAddresses: IMemberAddressRequest[]
    memberExpenses?: IMemberExpensesRequest[]
    memberDescriptions?: IMemberDescriptionRequest[]
    memberCloseRemarks?: IMemberCloseRemarkRequest[]
    memberJointAccounts?: IMemberJointAccountRequest[]
    memberRelativeAccounts?: IMemberRelativeAccountsRequest[]
    memberGovernmentBenefits?: IMemberGovernmentBenefitsRequest[]
    memberContactNumberReferences: IMemberContactReferenceRequest[]
}

export interface IMemberProfile extends ITimeStamps, IAuditable {
    id: TEntityId

    branch_id: TEntityId
    branch: IBranch

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
    // memberEducationalAttainment?: IMemberEducationalAttainment

    // memberAssets?: IMemberAssets[]
    // memberIncome?: IMemberIncome[]
    // memberWallets?: IMemberWallet[] // ano to desu
    // memberAddresses?: IMemberAddress[]
    // memberRecruits?: IMemberRecruits[]
    // memberExpenses?: IMemberExpenses[]
    // memberDescriptions?: IMemberDescription[]
    // memberCloseRemarks?: IMemberCloseRemark[]
    // memberJointAccounts?: IMemberJointAccount[]
    // memberRelativeAccounts?: IMemberRelativeAccounts[]
    // memberGovernmentBenefits?: IMemberGovernmentBenefits[]
    // memberMutualFundsHistory?: IMemberMutualFundsHistory[]
    // memberContactNumberReferences?: IMemberContactNumberReferences[]
}

export interface IMemberProfilePaginated
    extends IPaginatedResult<IMemberProfile> {}

export type IMemberProfilePicker = Pick<
    IMemberProfile,
    'id' | 'old_reference_id' | 'passbook' | 'notes' | 'description'
>
