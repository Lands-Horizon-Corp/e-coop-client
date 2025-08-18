import z from "zod";
import {
  TEntityId,
  ITimeStamps,
  IAuditable,
  IOrgBranchIdentity,
  entityIdSchema,
  descriptionSchema,
} from "../common";

// export type TagCategory = string;

export interface IGeneralLedgerTagRequest {
  general_ledger_id: TEntityId;
  name: string;
  description?: string;
  //   category?: TagCategory;
  color?: string;
  icon?: string;
}

export interface IGeneralLedgerTagResponse
  extends ITimeStamps,
    IAuditable,
    IOrgBranchIdentity {
  id: TEntityId;
  general_ledger_id: TEntityId;
  general_ledger?: IGeneralLedgerTagResponse;
  name: string;
  description: string;
  //   category: TagCategory;
  color: string;
  icon: string;
}

export const generalLedgerTagRequestSchema = z.object({
  general_ledger_id: entityIdSchema,
  name: z.string().min(1).max(50),
  description: descriptionSchema.optional(),
  category: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
});
