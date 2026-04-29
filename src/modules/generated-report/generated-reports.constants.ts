import { TPaperSizeUnit } from './generated-report.types'

export const REPORT_NAMES = [
    'FSAccountHistory',
    'AccountLedgerReport',
    'AccountBalanceReport',
    'AccountHoldOutReport',

    'CashCheckDisbursementReport',
    'ComakerReport',
    'DailyCashReceiptReport',
    'DailyCollectionReport',
    'DailyCollectionSummaryReport',
    'DailyWithdrawalReport',
    'DepositBalancesReport',
    'DirectAdjustmentReport',
    'EarnedUnearnedReport',
    'GroceryLoanReport',
    'ICPRReport',
    'InterestShareCapitalReport',
    'JournalVoucherReport',
    'LedgerReport',

    // GL FS
    'FSBalanceSheet',
    'FSCashFlowReport',
    'FSConditionReport',
    'FSIncomeStatement',
    'FSDefinitionReport',

    'GLFSTrialBalanceReport',
    'SLTRXGLComparisonDefinition',
    'SLGLComparisonDefinition',

    'CashCheckVoucher',
    'JournalVoucherRelease',
    'OtherFundRelease',
    'GLBooksReport',

    // LOAN
    'LoanReleaseVoucher',
    'LoanSatementReport',
    'LoanBalancesReport',
    'LoanCollectionDetailReport',
    'LoanCollectionDueReport',
    'LoanCollectionSummaryReport',
    'LoanMaturityReport',
    'LoanProtectionReport',
    'LoanReceivableReport',
    'LoanReleaseDetailReport',
    'LoanReleaseSummaryReport',
    'LoanReleaseTabulatedReport',
    'LoanStatementReport',

    // TIME DEPOSIT
    'TimeDepositAccuredInterestReport',
    'TimeDepositBalanceReport',
    'TimeDepositBalanceYTDReport',
    'TimeDepositReport',

    // MEMBER
    'MemberListingReport',
    'CloseAccountReport',

    //OTHER
    'TransactionBatchReport',
    'AdjustmentReport',
    'NumberTagReport',
    'OtherFundEntryReport',
    'PastDueOnInstallmentReport',
    'PortfolioAtRiskReport',
    'ProofOfPurchaseReport',
    'RebateReport',
    'ShareCapitalWithdrawalReport',
    'StatementOfAccountReport',
    'SubscriptionFeeReport',
    'SupposedActualReport',
    'TellerMonitoringReport',

    'none',
] as const

export const PAPER_SIZE_UNIT = ['in', 'cm', 'mm', 'pt', 'px'] as const

export const DISPLAY_DENSITY = ['compact', 'normal', 'loose'] as const

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
