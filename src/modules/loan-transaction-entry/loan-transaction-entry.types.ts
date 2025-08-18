import z from "zod";
import {
  TEntityId,
  ITimeStamps,
  IAuditable,
  IOrgBranchIdentity,
  entityIdSchema,
} from "../common";
import { ILoanTransaction } from "../loan-transaction/loan-transaction.types";

export interface ILoanTransactionEntryRequest {
  loan_transaction_id: TEntityId;
  description?: string;
  credit?: number;
  debit?: number;
}

export interface ILoanTransactionEntryResponse
  extends ITimeStamps,
    IAuditable,
    IOrgBranchIdentity {
  id: TEntityId;
  loan_transaction_id: TEntityId;
  loan_transaction?: ILoanTransaction;
  description: string;
  credit: number;
  debit: number;
}

export const loanTransactionEntryRequestSchema = z.object({
  loan_transaction_id: entityIdSchema,
  description: z.string().optional(),
  credit: z.number().optional(),
  debit: z.number().optional(),
});
