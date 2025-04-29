import { IMemberExpensesRequest, IMemberExpenses } from './member-expenses'
import {
    IMemberDescriptionRequest,
    IMemberDescription,
} from './member-description'
import {
    IMemberJointAccountsRequest,
    IMemberJointAccounts,
} from './member-joint-accounts'
import {
    IMemberRelativeAccountsRequest,
    IMemberRelativeAccounts,
} from './member-relative-accounts'
import {
    IMemberGovernmentBenefitsRequest,
    IMemberGovernmentBenefits,
} from './member-government-benefits'
import { IMedia } from '../media'
import { IMember } from './member'
import {
    IMemberContactNumberReferencesRequest,
    IMemberContactNumberReferences,
} from './member-contact-number-references'
import { IBranch } from '../branch'
import { IEmployeeResource } from '../employee'
import { IMemberType } from './member-type'
import { IMemberWallet } from './member-wallet'
import { IMemberGender } from './member-gender'
import { IMemberCenter } from './member-center'
import { IMemberRecruits } from './member-recruits'
import { IMemberOccupation } from './member-occupation'
import {
    IMemberCloseRemarkRequest,
    IMemberCloseRemark,
} from './member-close-remark'
import { IMemberClassification } from './member-classification'
import { IMemberIncomeRequest, IMemberIncome } from './member-income'
import { IMemberAssetsRequest, IMemberAssets } from './member-assets'
import { IMemberAddressRequest, IMemberAddress } from './member-address'
import {
    ITimeStamps,
    TAccountStatus,
    TCivilStatus,
    TEntityId,
} from '../../common'
import { IMemberMutualFundsHistory } from './member-mutual-funds-history'
import { IMemberEducationalAttainment } from './member-educational-attainment'

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
    memberJointAccounts?: IMemberJointAccountsRequest[]
    memberRelativeAccounts?: IMemberRelativeAccountsRequest[]
    memberGovernmentBenefits?: IMemberGovernmentBenefitsRequest[]
    memberContactNumberReferences: IMemberContactNumberReferencesRequest[]
}

export interface IMemberProfile extends ITimeStamps {
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
    occupation?: IMemberOccupation

    recruitedByMemberProfileId?: TEntityId
    recruitedByMemberProfile?: IMemberProfile

    mediaId?: TEntityId
    media?: IMedia

    memberId?: TEntityId
    member?: IMember

    memberTypeId?: TEntityId
    memberType?: IMemberType

    memberClassificationId?: TEntityId
    memberClassification?: IMemberClassification

    memberGenderId?: TEntityId
    memberGender?: IMemberGender

    verifiedByEmployeeId?: TEntityId
    verifiedByEmployee?: IEmployeeResource

    branchId?: TEntityId
    branch?: IBranch

    memberCenterId?: TEntityId
    memberCenter?: IMemberCenter

    signatureMediaId?: TEntityId
    signatureMedia?: IMedia

    memberEducationalAttainmentId?: TEntityId
    memberEducationalAttainment?: IMemberEducationalAttainment

    memberAssets?: IMemberAssets[]
    memberIncome?: IMemberIncome[]
    memberWallets?: IMemberWallet[] // ano to desu
    memberAddresses?: IMemberAddress[]
    memberRecruits?: IMemberRecruits[]
    memberExpenses?: IMemberExpenses[]
    memberDescriptions?: IMemberDescription[]
    memberCloseRemarks?: IMemberCloseRemark[]
    memberJointAccounts?: IMemberJointAccounts[]
    memberRelativeAccounts?: IMemberRelativeAccounts[]
    memberGovernmentBenefits?: IMemberGovernmentBenefits[]
    memberMutualFundsHistory?: IMemberMutualFundsHistory[]
    memberContactNumberReferences?: IMemberContactNumberReferences[]
}

export type IMemberProfilePicker = Pick<
    IMemberProfile,
    'id' | 'oldReferenceId' | 'passbookNumber' | 'notes' | 'description'
>
