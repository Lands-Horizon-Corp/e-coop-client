import z from "zod";
import {
  TEntityId,
  ITimeStamps,
  IAuditable,
  IOrgBranchIdentity,
} from "../common";

export interface ILoanGuaranteedFundRequest {
  scheme_number: number;
  increasing_rate: number;
}

export interface ILoanGuaranteedFundResponse
  extends ITimeStamps,
    IAuditable,
    IOrgBranchIdentity {
  id: TEntityId;
  scheme_number: number;
  increasing_rate: number;
}

export const loanGuaranteedFundRequestSchema = z.object({
  scheme_number: z.number(),
  increasing_rate: z.number(),
});
