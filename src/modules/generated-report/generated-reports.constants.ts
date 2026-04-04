import { TPaperSizeUnit } from './generated-report.types'

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
    'Area',
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
    'BrowseReference',
    'BrowseReferenceByAmount',
    'BrowseReferenceInterestRateByUltimaMembershipDate',
    'BrowseReferenceInterestRateByUltimaMembershipDatePerYear',
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
    'OtherFund',
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

export const PAPER_SIZE_UNIT = ['in', 'cm', 'mm', 'pt', 'px'] as const

export interface PaperSize {
    name: string
    width: number
    height: number
    unit: TPaperSizeUnit
    orientation?: 'portrait' | 'landscape'
}

export const PAPER_SIZES: Record<string, PaperSize> = {
    // Receipt Sizes
    RECEIPT_58MM: { name: '58mm Receipt', width: 58, height: 200, unit: 'mm' },
    RECEIPT_80MM: { name: '80mm Receipt', width: 80, height: 200, unit: 'mm' },

    // Banking & Transaction Sizes
    CHECK: { name: 'Check', width: 6, height: 2.75, unit: 'in' },
    PASSBOOK: { name: 'Passbook', width: 148, height: 105, unit: 'mm' },
    DEPOSIT_SLIP: { name: 'Deposit Slip', width: 3.5, height: 8.5, unit: 'in' },
    WITHDRAWAL_SLIP: {
        name: 'Withdrawal Slip',
        width: 3.5,
        height: 8.5,
        unit: 'in',
    },
    STATEMENT: { name: 'Bank Statement', width: 8.5, height: 11, unit: 'in' },
    CHECKBOOK: { name: 'Checkbook Register', width: 3, height: 6, unit: 'in' },
    BANKBOOK: { name: 'Bank Book', width: 125, height: 176, unit: 'mm' },

    // A Series (ISO 216 Standard)
    A0: { name: 'A0', width: 841, height: 1189, unit: 'mm' },
    A1: { name: 'A1', width: 594, height: 841, unit: 'mm' },
    A2: { name: 'A2', width: 420, height: 594, unit: 'mm' },
    A3: { name: 'A3', width: 297, height: 420, unit: 'mm' },
    A4: { name: 'A4', width: 210, height: 297, unit: 'mm' },
    A5: { name: 'A5', width: 148, height: 210, unit: 'mm' },
    A6: { name: 'A6', width: 105, height: 148, unit: 'mm' },
    //this sizes are rarely used
    A7: { name: 'A7', width: 74, height: 105, unit: 'mm' },
    A8: { name: 'A8', width: 52, height: 74, unit: 'mm' },
    A9: { name: 'A9', width: 37, height: 52, unit: 'mm' },
    A10: { name: 'A10', width: 26, height: 37, unit: 'mm' },

    // B Series (ISO 216 Standard)
    // B0: { name: 'B0', width: 1000, height: 1414, unit: 'mm' },
    // B1: { name: 'B1', width: 707, height: 1000, unit: 'mm' },
    // B2: { name: 'B2', width: 500, height: 707, unit: 'mm' },
    // B3: { name: 'B3', width: 353, height: 500, unit: 'mm' },
    // B4: { name: 'B4', width: 250, height: 353, unit: 'mm' },
    B5: { name: 'B5', width: 176, height: 250, unit: 'mm' },
    B6: { name: 'B6', width: 125, height: 176, unit: 'mm' },
    B7: { name: 'B7', width: 88, height: 125, unit: 'mm' },
    B8: { name: 'B8', width: 62, height: 88, unit: 'mm' },
    B9: { name: 'B9', width: 44, height: 62, unit: 'mm' },
    B10: { name: 'B10', width: 31, height: 44, unit: 'mm' },

    // North American Paper Sizes
    LETTER: { name: 'Letter', width: 8.5, height: 11, unit: 'in' },
    LEGAL: { name: 'Legal', width: 8.5, height: 14, unit: 'in' },
    FOLIO: { name: 'Folio', width: 8.5, height: 13, unit: 'in' },
}

export const PAPER_SIZE_GROUPS = {
    Receipt: ['RECEIPT_58MM', 'RECEIPT_80MM'],
    Banking: [
        'CHECK',
        'PASSBOOK',
        'DEPOSIT_SLIP',
        'WITHDRAWAL_SLIP',
        'STATEMENT',
        'CHECKBOOK',
        'BANKBOOK',
    ],
    'A Series': [
        'A0',
        'A1',
        'A2',
        'A3',
        'A4',
        'A5',
        'A6',
        'A7',
        'A8',
        'A9',
        'A10',
    ],
    'B Series': ['B5', 'B6', 'B7', 'B8', 'B9', 'B10'],
    'North American': ['LETTER', 'LEGAL', 'FOLIO'],
} as const

// 🧭 Helper Function to Get Orientation
export function getPaperSize(
    key: keyof typeof PAPER_SIZES,
    orientation: 'portrait' | 'landscape' = 'portrait'
): PaperSize {
    const size = PAPER_SIZES[key]
    if (!size) throw new Error(`Paper size "${key}" not found`)
    return orientation === 'landscape'
        ? { ...size, width: size.height, height: size.width, orientation }
        : { ...size, orientation }
}

export const DELAY_DOWNLOAD_TIME_DURATION = 10
export const DELAY_DOWNLOAD_TIME_INTERVAL = 1000

export const Style = {
    light: {
        background: 'oklch(0.9751 0.0127 244.2507)',
        foreground: 'oklch(0.3729 0.0306 259.7328)',
        card: 'oklch(1 0 0)',
        cardForeground: 'oklch(0.3729 0.0306 259.7328)',
        popover: 'oklch(1 0 0)',
        popoverForeground: 'oklch(0.3729 0.0306 259.7328)',
        primary: 'oklch(0.7227 0.192 149.5793)',
        primaryForeground: 'oklch(1 0 0)',
        secondary: 'oklch(0.9514 0.025 236.8242)',
        secondaryForeground: 'oklch(0.4461 0.0263 256.8018)',
        muted: 'oklch(0.967 0.0029 264.5419)',
        mutedForeground: 'oklch(0.551 0.0234 264.3637)',
        accent: 'oklch(0.9505 0.0507 163.0508)',
        accentForeground: 'oklch(0.3729 0.0306 259.7328)',
        destructive: 'oklch(0.6368 0.2078 25.3313)',
        destructiveForeground: 'oklch(1 0 0)',

        warning: 'oklch(0.9869 0.0214 95.28)',
        warningForeground: 'oklch(0.478 0.1279 45.4)',

        border: 'oklch(0.9276 0.0058 264.5313)',
        input: 'oklch(0.9276 0.0058 264.5313)',
        ring: 'oklch(0.7227 0.192 149.5793)',

        chart1: 'oklch(0.7227 0.192 149.5793)',
        chart2: 'oklch(0.6959 0.1491 162.4796)',
        chart3: 'oklch(0.596 0.1274 163.2254)',
        chart4: 'oklch(0.5081 0.1049 165.6121)',
        chart5: 'oklch(0.4318 0.0865 166.9128)',

        radius: '0.5rem',

        sidebar: 'oklch(0.9514 0.025 236.8242)',
        sidebarForeground: 'oklch(0.3729 0.0306 259.7328)',
        sidebarPrimary: 'oklch(0.7227 0.192 149.5793)',
        sidebarPrimaryForeground: 'oklch(1 0 0)',
        sidebarAccent: 'oklch(0.9505 0.0507 163.0508)',
        sidebarAccentForeground: 'oklch(0.3729 0.0306 259.7328)',
        sidebarBorder: 'oklch(0.9276 0.0058 264.5313)',
        sidebarRing: 'oklch(0.7227 0.192 149.5793)',

        fontSans:
            "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'San Francisco', system-ui, sans-serif",
        fontSerif: "'New York', Georgia, 'Times New Roman', Times, serif",
        fontMono:
            "'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",

        shadowColor: 'hsl(0 0% 0%)',
        shadowOpacity: '0.1',
        shadowBlur: '8px',
        shadowSpread: '-1px',
        shadowOffsetX: '0px',
        shadowOffsetY: '4px',

        letterSpacing: '0em',
        spacing: '0.25rem',

        shadow2xs: '0px 4px 8px -1px hsl(0 0% 0% / 0.05)',
        shadowXs: '0px 4px 8px -1px hsl(0 0% 0% / 0.05)',
        shadowSm:
            '0px 4px 8px -1px hsl(0 0% 0% / 0.1), 0px 1px 2px -2px hsl(0 0% 0% / 0.1)',
        shadow: '0px 4px 8px -1px hsl(0 0% 0% / 0.1), 0px 1px 2px -2px hsl(0 0% 0% / 0.1)',
        shadowMd:
            '0px 4px 8px -1px hsl(0 0% 0% / 0.1), 0px 2px 4px -2px hsl(0 0% 0% / 0.1)',
        shadowLg:
            '0px 4px 8px -1px hsl(0 0% 0% / 0.1), 0px 4px 6px -2px hsl(0 0% 0% / 0.1)',
        shadowXl:
            '0px 4px 8px -1px hsl(0 0% 0% / 0.1), 0px 8px 10px -2px hsl(0 0% 0% / 0.1)',
        shadow2xl: '0px 4px 8px -1px hsl(0 0% 0% / 0.25)',

        trackingNormal: '0em',
    },
    dark: {
        background: 'oklch(0.2077 0.0398 265.7549)',
        foreground: 'oklch(0.8717 0.0093 258.3382)',
        card: 'oklch(0.2795 0.0368 260.031)',
        cardForeground: 'oklch(0.8717 0.0093 258.3382)',
        popover: 'oklch(0.2795 0.0368 260.031)',
        popoverForeground: 'oklch(0.8717 0.0093 258.3382)',
        primary: 'oklch(0.7729 0.1535 163.2231)',
        primaryForeground: 'oklch(0.2077 0.0398 265.7549)',
        secondary: 'oklch(0.3351 0.0331 260.912)',
        secondaryForeground: 'oklch(0.7118 0.0129 286.0665)',
        muted: 'oklch(0.2795 0.0368 260.031)',
        mutedForeground: 'oklch(0.551 0.0234 264.3637)',
        accent: 'oklch(0.3729 0.0306 259.7328)',
        accentForeground: 'oklch(0.7118 0.0129 286.0665)',
        destructive: 'oklch(0.6368 0.2078 25.3313)',
        destructiveForeground: 'oklch(0.2077 0.0398 265.7549)',

        warning: 'oklch(0.4732 0.1247 46.2)',
        warningForeground: 'oklch(0.9043 0.1389 94.5)',

        border: 'oklch(0.4461 0.0263 256.8018)',
        input: 'oklch(0.4461 0.0263 256.8018)',
        ring: 'oklch(0.7729 0.1535 163.2231)',

        chart1: 'oklch(0.7729 0.1535 163.2231)',
        chart2: 'oklch(0.7845 0.1325 181.912)',
        chart3: 'oklch(0.7227 0.192 149.5793)',
        chart4: 'oklch(0.6959 0.1491 162.4796)',
        chart5: 'oklch(0.596 0.1274 163.2254)',

        radius: '0.5rem',

        sidebar: 'oklch(0.2795 0.0368 260.031)',
        sidebarForeground: 'oklch(0.8717 0.0093 258.3382)',
        sidebarPrimary: 'oklch(0.7729 0.1535 163.2231)',
        sidebarPrimaryForeground: 'oklch(0.2077 0.0398 265.7549)',
        sidebarAccent: 'oklch(0.3729 0.0306 259.7328)',
        sidebarAccentForeground: 'oklch(0.7118 0.0129 286.0665)',
        sidebarBorder: 'oklch(0.4461 0.0263 256.8018)',
        sidebarRing: 'oklch(0.7729 0.1535 163.2231)',

        fontSans:
            "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'San Francisco', system-ui, sans-serif",
        fontSerif: "'New York', Georgia, 'Times New Roman', Times, serif",
        fontMono:
            "'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",

        shadowColor: 'hsl(0 0% 0%)',
        shadowOpacity: '0.1',
        shadowBlur: '8px',
        shadowSpread: '-1px',
        shadowOffsetX: '0px',
        shadowOffsetY: '4px',

        letterSpacing: '0em',
        spacing: '0.25rem',

        shadow2xs: '0px 4px 8px -1px hsl(0 0% 0% / 0.05)',
        shadowXs: '0px 4px 8px -1px hsl(0 0% 0% / 0.05)',
        shadowSm:
            '0px 4px 8px -1px hsl(0 0% 0% / 0.1), 0px 1px 2px -2px hsl(0 0% 0% / 0.1)',
        shadow: '0px 4px 8px -1px hsl(0 0% 0% / 0.1), 0px 1px 2px -2px hsl(0 0% 0% / 0.1)',
        shadowMd:
            '0px 4px 8px -1px hsl(0 0% 0% / 0.1), 0px 2px 4px -2px hsl(0 0% 0% / 0.1)',
        shadowLg:
            '0px 4px 8px -1px hsl(0 0% 0% / 0.1), 0px 4px 6px -2px hsl(0 0% 0% / 0.1)',
        shadowXl:
            '0px 4px 8px -1px hsl(0 0% 0% / 0.1), 0px 8px 10px -2px hsl(0 0% 0% / 0.1)',
        shadow2xl: '0px 4px 8px -1px hsl(0 0% 0% / 0.25)',

        trackingNormal: '0em',
    },
}
