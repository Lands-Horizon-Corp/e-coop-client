import z from "zod";
import {
  TEntityId,
  ITimeStamps,
  IAuditable,
  IOrgBranchIdentity,
  entityIdSchema,
  descriptionSchema,
} from "../common";
import { ITransactionResponse } from "../transaction/transaction.types";

export type TagCategory = string;

export interface ITransactionTagRequest {
  organization_id: TEntityId;
  branch_id: TEntityId;
  transaction_id: TEntityId;
  name: string;
  description?: string;
  category?: TagCategory;
  color?: string;
  icon?: string;
}

export interface ITransactionTagResponse
  extends ITimeStamps,
    IAuditable,
    IOrgBranchIdentity {
  id: TEntityId;
  transaction_id: TEntityId;
  transaction?: ITransactionResponse;
  name: string;
  description: string;
  category: TagCategory;
  color: string;
  icon: string;
}

export const transactionTagRequestSchema = z.object({
  organization_id: entityIdSchema,
  branch_id: entityIdSchema,
  transaction_id: entityIdSchema,
  name: z.string().min(1).max(50),
  description: descriptionSchema.optional(),
  category: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
});
