import z from "zod";
import {
  TEntityId,
  ITimeStamps,
  IAuditable,
  IOrgBranchIdentity,
  entityIdSchema,
} from "../common";
import { ILoanTransaction } from "../loan-transaction";

export interface ILoanClearanceAnalysisRequest {
  loan_transaction_id: TEntityId;
  regular_deduction_description?: string;
  regular_deduction_amount?: number;
  balances_description?: string;
  balances_amount?: number;
  balances_count?: number;
}

export interface ILoanClearanceAnalysisResponse
  extends ITimeStamps,
    IAuditable,
    IOrgBranchIdentity {
  id: TEntityId;
  loan_transaction_id: TEntityId;
  loan_transaction?: ILoanTransaction;
  regular_deduction_description: string;
  regular_deduction_amount: number;
  balances_description: string;
  balances_amount: number;
  balances_count: number;
}

export const loanClearanceAnalysisRequestSchema = z.object({
  loan_transaction_id: entityIdSchema,
  regular_deduction_description: z.string().optional(),
  regular_deduction_amount: z.number().optional(),
  balances_description: z.string().optional(),
  balances_amount: z.number().optional(),
  balances_count: z.number().optional(),
});

export interface ILoanClearanceAnalysisInstitutionRequest {
  loan_transaction_id: TEntityId;
  name: string;
  description?: string;
}

export interface ILoanClearanceAnalysisInstitutionResponse
  extends ITimeStamps,
    IAuditable,
    IOrgBranchIdentity {
  id: TEntityId;
  loan_transaction_id: TEntityId;
  loan_transaction?: ILoanTransaction;
  name: string;
  description: string;
}

export const loanClearanceAnalysisInstitutionRequestSchema = z.object({
  loan_transaction_id: entityIdSchema,
  name: z.string().min(1).max(50),
  description: z.string().optional(),
});
