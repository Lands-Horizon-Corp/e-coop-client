import {
    COMPUTATION_TYPE,
    LOAN_AMORTIZATION_TYPE,
    LOAN_COLLECTOR_PLACE,
    LOAN_COMAKER_TYPE,
    LOAN_MODE_OF_PAYMENT,
    LOAN_TYPE,
    WEEKDAYS,
} from '@/constants/loan'

export type TLoanModeOfPayment = (typeof LOAN_MODE_OF_PAYMENT)[number]

export type TWeekdays = (typeof WEEKDAYS)[number]

export type TLoanCollectorPlace = (typeof LOAN_COLLECTOR_PLACE)[number]

export type TLoanComakerType = (typeof LOAN_COMAKER_TYPE)[number]

export type TLoanType = (typeof LOAN_TYPE)[number]

export type TLoanAmortizationType = (typeof LOAN_AMORTIZATION_TYPE)[number]

export type TComputationType = (typeof COMPUTATION_TYPE)[number]
