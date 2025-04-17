import { ITimeStamps, TEntityId } from '../common'
import { IPaginatedResult } from '../paginated-result'

export type TAccountingAccounts =
    | 'Deposit'
    | 'Loan'
    | 'A/R-Ledger'
    | 'A/R-Aging'
    | 'Fines'
    | 'Interest'
    | 'SVF-Ledger'
    | 'W-Off'
    | 'A/P-Ledger'
    | 'Other'

export type TEarnedUnearnedInterest =
    | 'By Formula'
    | 'By Formula + Actual Pay'
    | 'By Advance Int. + Actual Pay'
    | 'None'

export type TOtherAccountInformation =
    | 'None'
    | 'Jewelry'
    | 'Field'
    | 'Grocery'
    | 'Track Loan Ded'
    | 'CIB/CIK Acct.'
    | 'COH Acct.'

export type TAccountingDefault =
    | 'Loan'
    | 'Savings'
    | 'Withdraw'
    | 'None'
    | 'Time'

export interface IAccountsRequest {
    id?: TEntityId
    companyId: TEntityId
    accountCode: string
    description: string
    altDescription?: string
    type: TAccountingAccounts
    maxAmount?: number
    minAmount?: number
    computationType?: TEntityId
    headerRow?: number
    centerRow?: number
    totalRow?: number
    print?: boolean
    addOn?: boolean
    allowRebate?: boolean
    taxable?: boolean
    finesAmort?: number
    finesMaturity?: number
    interestStandard?: number
    interestSecured?: number
    schemeNo?: number
    altCode?: number
    glCode?: number
    finesGpAmort?: number
    addtlGp?: string
    noGracePeriodDaily: boolean
    finesGpMaturity?: number
    earnedUnearnedInterest?: TEarnedUnearnedInterest
    otherInformationOfAnAccount?: TOtherAccountInformation
    accountingDefault?: TAccountingDefault
}

export interface IAccountsResource extends ITimeStamps {
    id: TEntityId
    companyId: TEntityId
    accountCode: string
    description: string
    altDescription?: string
    type: TAccountingAccounts
    maxAmount?: number
    minAmount?: number
    computationType?: TEntityId
    headerRow?: number
    centerRow?: number
    totalRow?: number
    print?: boolean
    addOn?: boolean
    allowRebate?: boolean
    taxable?: boolean
    finesAmort?: number
    finesMaturity?: number
    interestStandard?: number
    interestSecured?: number
    schemeNo?: number
    altCode?: number
    glCode?: number
    finesGpAmort?: number
    addtlGp?: string
    noGracePeriodDaily?: boolean
    finesGpMaturity?: number
    earnedUnearnedInterest?: TEarnedUnearnedInterest
    otherInformationOfAnAccount?: TOtherAccountInformation
    default: TAccountingDefault
}

export interface IAccountsPaginatedResource
    extends IPaginatedResult<IAccountsResource> {}
