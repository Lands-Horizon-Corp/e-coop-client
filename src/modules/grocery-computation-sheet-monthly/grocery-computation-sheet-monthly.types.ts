import z from "zod";
import {
  TEntityId,
  ITimeStamps,
  IAuditable,
  IOrgBranchIdentity,
  entityIdSchema,
} from "../common";
import { IGroceryComputationSheetResponse } from "../grocery-computation-sheet/grocery-computation-sheet.types";

export interface IGroceryComputationSheetMonthlyRequest {
  grocery_computation_sheet_id: TEntityId;
  months?: number;
  interest_rate?: number;
  loan_guaranteed_fund_rate?: number;
}

export interface IGroceryComputationSheetMonthlyResponse
  extends ITimeStamps,
    IAuditable,
    IOrgBranchIdentity {
  id: TEntityId;
  grocery_computation_sheet_id: TEntityId;
  grocery_computation_sheet?: IGroceryComputationSheetResponse;
  months: number;
  interest_rate: number;
  loan_guaranteed_fund_rate: number;
}

export const groceryComputationSheetMonthlyRequestSchema = z.object({
  grocery_computation_sheet_id: entityIdSchema,
  months: z.number().optional(),
  interest_rate: z.number().optional(),
  loan_guaranteed_fund_rate: z.number().optional(),
});
