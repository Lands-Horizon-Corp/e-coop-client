import z from "zod";
import {
  TEntityId,
  ITimeStamps,
  IAuditable,
  IOrgBranchIdentity,
  descriptionSchema,
} from "../common";

export interface IComputationSheetRequest {
  name: string;
  description?: string;
  deliquent_account?: boolean;
  fines_account?: boolean;
  interest_account_id?: boolean;
  comaker_account?: number;
  exist_account?: boolean;
}

export interface IComputationSheetResponse
  extends ITimeStamps,
    IAuditable,
    IOrgBranchIdentity {
  id: TEntityId;
  name: string;
  description: string;
  deliquent_account: boolean;
  fines_account: boolean;
  interest_account_id: boolean;
  comaker_account: number;
  exist_account: boolean;
}

export const computationSheetRequestSchema = z.object({
  name: z.string().min(1).max(254),
  description: descriptionSchema.optional(),
  deliquent_account: z.boolean().optional(),
  fines_account: z.boolean().optional(),
  interest_account_id: z.boolean().optional(),
  comaker_account: z.number().optional(),
  exist_account: z.boolean().optional(),
});
