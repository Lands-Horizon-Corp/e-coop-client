import z from "zod";
import {
  TEntityId,
  ITimeStamps,
  IAuditable,
  IOrgBranchIdentity,
  entityIdSchema,
} from "../common";
import { ILoanTransaction } from "../loan-transaction";
import { IAccount } from "../account";

export interface ILoanTermsAndConditionAmountReceiptRequest {
  loan_transaction_id: TEntityId;
  account_id: TEntityId;
  amount?: number;
}

export interface ILoanTermsAndConditionAmountReceiptResponse
  extends ITimeStamps,
    IAuditable,
    IOrgBranchIdentity {
  id: TEntityId;
  loan_transaction_id: TEntityId;
  loan_transaction?: ILoanTransaction;
  account_id: TEntityId;
  account?: IAccount;
  amount: number;
}

export const loanTermsAndConditionAmountReceiptRequestSchema = z.object({
  loan_transaction_id: entityIdSchema,
  account_id: entityIdSchema,
  amount: z.number().optional(),
});
