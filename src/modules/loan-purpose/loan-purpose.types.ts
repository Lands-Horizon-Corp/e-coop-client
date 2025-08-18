import z from "zod";
import {
  TEntityId,
  ITimeStamps,
  IAuditable,
  IOrgBranchIdentity,
} from "../common";

export interface ILoanPurposeRequest {
  description?: string;
  icon?: string;
}

export interface ILoanPurposeResponse
  extends ITimeStamps,
    IAuditable,
    IOrgBranchIdentity {
  id: TEntityId;
  description: string;
  icon: string;
}

export const loanPurposeRequestSchema = z.object({
  description: z.string().optional(),
  icon: z.string().optional(),
});
