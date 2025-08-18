import z from "zod";
import { IBranch } from "../branch";
import {
  descriptionSchema,
  descriptionTransformerSanitizer,
  entityIdSchema,
  IAuditable,
  ITimeStamps,
  TEntityId,
} from "../common";
import { IMemberProfile } from "../member-profile/member-profile.types";

// LATEST FROM ERD
export interface IMemberExpenseRequest {
  id?: TEntityId;
  name: string;
  amount: number;
  description: string;
}

// LATEST FROM ERD
export interface IMemberExpense extends ITimeStamps, IAuditable {
  id: TEntityId;
  member_profile_id: TEntityId;
  member_profile: IMemberProfile;

  branch_id: TEntityId;
  branch: IBranch;

  name: string;
  amount: number;
  description: string;
}

export const memberExpenseSchema = z.object({
  id: entityIdSchema.optional(),
  name: z.string().min(1, "Name is required"),
  date: z.string().min(1, "Date is required"),
  amount: z.coerce.number().min(0, "Amount must be non-negative"),
  description: descriptionSchema.transform(descriptionTransformerSanitizer),
});
