import {
    IMemberExpensesRequest,
    IMemberExpensesResource,
} from './member-expenses'
import {
    IMemberDescriptionRequest,
    IMemberDescriptionResource,
} from './member-description'
import {
    IMemberJointAccountsRequest,
    IMemberJointAccountsResource,
} from './member-joint-accounts'
import {
    IMemberRelativeAccountsRequest,
    IMemberRelativeAccountsResource,
} from './member-relative-accounts'
import {
    IMemberGovernmentBenefitsRequest,
    IMemberGovernmentBenefitsResource,
} from './member-government-benefits'
import { IMediaResource } from '../media'
import { IMemberResource } from './member'
import {
    IMemberContactNumberReferencesRequest,
    IMemberContactNumberReferencesResource,
} from './member-contact-number-references'
import { IBranchResource } from '../branch'
import { IEmployeeResource } from '../employee'
import { IMemberTypeResource } from './member-type'
import { IMemberWalletResource } from './member-wallet'
import { IMemberGenderResource } from './member-gender'
import { IMemberCenterResource } from './member-center'
import { IMemberRecruitsResource } from './member-recruits'
import { IMemberOccupationResource } from './member-occupation'
import {
    IMemberCloseRemarkRequest,
    IMemberCloseRemarkResource,
} from './member-close-remark'
import { IMemberClassificationResource } from './member-classification'
import { IMemberIncomeRequest, IMemberIncomeResource } from './member-income'
import { IMemberAssetsRequest, IMemberAssetsResource } from './member-assets'
import { IMemberAddressRequest, IMemberAddressResource } from './member-address'
import { ITimeStamps, TAccountStatus, TCivilStatus, TEntityId } from '../common'
import { IMemberMutualFundsHistoryResource } from './member-mutual-funds-history'
import { IMemberEducationalAttainmentResource } from './member-educational-attainment'

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
    media?: IMediaResource //This is just for form media display, not actually needed in backend

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
    memberJointAccounts?: IMemberJointAccountsRequest[]
    memberRelativeAccounts?: IMemberRelativeAccountsRequest[]
    memberGovernmentBenefits?: IMemberGovernmentBenefitsRequest[]
    memberContactNumberReferences: IMemberContactNumberReferencesRequest[]
}

export interface IMemberProfileResource extends ITimeStamps {
    id: TEntityId
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
    businessAddress?: string
    businessContact?: string

    status: TAccountStatus
    isClosed: boolean

    isMutualFundMember: boolean
    isMicroFinanceMember: boolean

    occupationId?: TEntityId
    occupation?: IMemberOccupationResource

    recruitedByMemberProfileId?: TEntityId
    recruitedByMemberProfile?: IMemberProfileResource

    mediaId?: TEntityId
    media?: IMediaResource

    memberId?: TEntityId
    member?: IMemberResource

    memberTypeId?: TEntityId
    memberType?: IMemberTypeResource

    memberClassificationId?: TEntityId
    memberClassification?: IMemberClassificationResource

    memberGenderId?: TEntityId
    memberGender?: IMemberGenderResource

    verifiedByEmployeeId?: TEntityId
    verifiedByEmployee?: IEmployeeResource

    branchId?: TEntityId
    branch?: IBranchResource

    memberCenterId?: TEntityId
    memberCenter?: IMemberCenterResource

    signatureMediaId?: TEntityId
    signatureMedia?: IMediaResource

    memberEducationalAttainmentId?: TEntityId
    memberEducationalAttainment?: IMemberEducationalAttainmentResource

    memberAssets?: IMemberAssetsResource[]
    memberIncome?: IMemberIncomeResource[]
    memberWallets?: IMemberWalletResource[] // ano to desu
    memberAddresses?: IMemberAddressResource[]
    memberRecruits?: IMemberRecruitsResource[]
    memberExpenses?: IMemberExpensesResource[]
    memberDescriptions?: IMemberDescriptionResource[]
    memberCloseRemarks?: IMemberCloseRemarkResource[]
    memberJointAccounts?: IMemberJointAccountsResource[]
    memberRelativeAccounts?: IMemberRelativeAccountsResource[]
    memberGovernmentBenefits?: IMemberGovernmentBenefitsResource[]
    memberMutualFundsHistory?: IMemberMutualFundsHistoryResource[]
    memberContactNumberReferences?: IMemberContactNumberReferencesResource[]
}

export type IMemberProfilePicker = Pick<
    IMemberProfileResource,
    'id' | 'oldReferenceId' | 'passbookNumber' | 'notes' | 'description'
>
