import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { IGroceryComputationSheet } from '../grocery-computation-sheet/grocery-computation-sheet.types'

export interface IGroceryComputationSheetMonthlyRequest {
    grocery_computation_sheet_id: TEntityId
    months?: number
    interest_rate?: number
    loan_guaranteed_fund_rate?: number
}

export interface IGroceryComputationSheetMonthly
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    grocery_computation_sheet_id: TEntityId
    grocery_computation_sheet?: IGroceryComputationSheet
    months: number
    interest_rate: number
    loan_guaranteed_fund_rate: number
}
