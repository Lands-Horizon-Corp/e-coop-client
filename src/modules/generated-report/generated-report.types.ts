import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IGeneratedReportsDownloadUsers } from '../generated-reports-download-users/generated-reports-download-users.types'
import { IMedia } from '../media'
import { IUser } from '../user'

export const ACCOUNT_MODEL_NAMES = [
    'AccountHistory',
    'Account',
    'AccountCategory',
    'AccountClassification',
    'AccountTag',
    'AdjustmentEntry',
    'AdjustmentTag',
    'AutomaticLoanDeduction',
    'Bank',
    'BatchFunding',
    'BillAndCoins',
    'branch',
    'branchSetting',
    'BrowseExcludeIncludeAccounts',
    'CancelledCashCheckVoucher',
    'CashCheckVoucher',
    'CashCheckVoucherEntry',
    'CashCheckVoucherTag',
    'CashCount',
    'Category',
    'ChargesRateByRangeOrMinimumAmount',
    'ChargesRateByTerm',
    'ChargesRateScheme',
    'ChargesRateSchemeAccount',
    'ChargesRateSchemeModeOfPayment',
    'CheckRemittance',
    'Collateral',
    'CollectorsMemberAccountEntry',
    'ComakerCollateral',
    'ComakerMemberProfile',
    'Company',
    'ComputationSheet',
    'ContactUs',
    'Currency',
    'Disbursement',
    'DisbursementTransaction',
    'Feedback',
    'FinancialStatementGrouping',
    'FinancialStatementDefinition',
    'FinesMaturity',
    'Footstep',
    'Funds',
    'GeneralAccountGroupingNetSurplusNegative',
    'GeneralLedgerTag',
    'GeneralLedger',
    'GeneralLedgerAccountsGrouping',
    'GeneralLedgerDefinition',
    'GeneratedReport',
    'GroceryComputationSheet',
    'GroceryComputationSheetMonthly',
    'Holiday',
    'IncludeNegativeAccount',
    'InterestMaturity',
    'InterestRateByTerm',
    'InterestRateByTermsHeader',
    'InterestRatePercentage',
    'InterestRateScheme',
    'InvitationCode',
    'JournalVoucher',
    'JournalVoucherEntry',
    'JournalVoucherTag',
    'LoanClearanceAnalysis',
    'LoanClearanceAnalysisInstitution',
    'LoanComakerMember',
    'LoanGuaranteedFund',
    'LoanGuaranteedFundPerMonth',
    'LoanLedger',
    'LoanPurpose',
    'LoanStatus',
    'LoanTag',
    'LoanTermsAndConditionAmountReceipt',
    'LoanTermsAndConditionSuggestedPayment',
    'LoanTransaction',
    'LoanTransactionEntry',
    'Media',
    'MemberAccountingLedger',
    'MemberAddress',
    'MemberAsset',
    'MemberBankCard',
    'MemberCenter',
    'MemberCenterHistory',
    'MemberClassification',
    'MemberClassificationHistory',
    'MemberClassificationInterestRate',
    'MemberCloseRemark',
    'MemberContactReference',
    'MemberDamayanExtensionEntry',
    'MemberDeductionEntry',
    'MemberDepartment',
    'MemberDepartmentHistory',
    'MemberEducationalAttainment',
    'MemberExpense',
    'MemberGender',
    'MemberGenderHistory',
    'MemberGovernmentBenefit',
    'MemberGroup',
    'MemberGroupHistory',
    'MemberIncome',
    'MemberJointAccount',
    'MemberMutualFundHistory',
    'MemberOccupation',
    'MemberOccupationHistory',
    'MemberOtherInformationEntry',
    'MemberProfile',
    'MemberProfileMedia',
    'MemberRelativeAccount',
    'MemberType',
    'MemberTypeHistory',
    'MemberTypeReference',
    'MemberTypeReferenceByAmount',
    'MemberTypeReferenceInterestRateByUltimaMembershipDate',
    'MemberTypeReferenceInterestRateByUltimaMembershipDatePerYear',
    'MemberVerification',
    'QRMemberProfile',
    'QRInvitationCode',
    'QRUser',
    'Core',
    'Notification',
    'OnlineRemittance',
    'Organization',
    'OrganizationCategory',
    'OrganizationDailyUsage',
    'OrganizationMedia',
    'PaymentType',
    'PermissionTemplate',
    'PostDatedCheck',
    'SubscriptionPlan',
    'TagTemplate',
    'TimeDepositComputation',
    'TimeDepositComputationPreMature',
    'TimeDepositType',
    'Timesheet',
    'Transaction',
    'TransactionBatch',
    'TransactionTag',
    'UnbalancedAccount',
    'User',
    'UserOrganization',
    'UserRating',
    'VoucherPayTo',
    'none',
] as const

export type TModelName = (typeof ACCOUNT_MODEL_NAMES)[number]

export type TModeGeneratedReport =
    | 'me-search'
    | 'me-pdf'
    | 'me-favorites'
    | 'me-excel'
    | 'pdf'
    | 'favorites'
    | 'excel'
    | 'me-model'
    | 'search'
    | 'me'

type TGeneratedReportType = 'pdf' | 'excel'

export type TGeneratedReportStatus =
    | 'pending'
    | 'in_progress'
    | 'complete'
    | 'failed'

export interface IGeneratedReport extends IBaseEntityMeta {
    user_id: TEntityId
    user: IUser
    media_id: TEntityId
    media: IMedia
    name: string
    description: string
    status: TGeneratedReportStatus

    system_message: string

    filter_search: string
    is_favorites: boolean
    model: TModelName
    url: string
    generated_reports_type: TGeneratedReportType

    download_users: IGeneratedReportsDownloadUsers[]
}

export interface IGeneratedReportRequest {
    name: string
    description?: string
    filter_search: string
    url: string
    model: TModelName
    generated_report_type: TGeneratedReportType
}

export interface IGeneratedReportPaginated
    extends IPaginatedResult<IGeneratedReport> {}

export interface IGeneratedReportUpdateRequest {
    name: string
    description: string
}

export interface IGeneratedReportAvailableModalResponse {
    model: TModelName
    count: number
}

export interface PaperSize {
    name: string
    width: number
    height: number
    unit: 'mm' | 'in' | 'pt'
    orientation?: 'portrait' | 'landscape'
}
