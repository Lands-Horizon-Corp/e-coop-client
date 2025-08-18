import { z } from "zod";
import { entityIdSchema, ITimeStamps, IBaseEntityMeta } from "../common";
import { IAccount } from "../account";
import { IMedia } from "../media/media.types";
import { IUserBase } from "../user/user.types";

export interface IAdjustmentEntry extends IBaseEntityMeta {
  id: string;
  signature_media_id?: string;
  signature_media?: IMedia;
  account_id: string;
  account?: IAccount;
  member_profile_id?: string;
  //   member_profile?: IMemberProfileResponse;
  employee_user_id?: string;
  employee_user?: IUserBase;
  payment_type_id?: string;
  //   payment_type?: IPaymentTypeResponse;
  type_of_payment_type: string;
  description: string;
  reference_number: string;
  entry_date?: string;
  debit: number;
  credit: number;
}

export interface IAdjustmentEntryRequest {
  signature_media_id?: string;
  account_id: string;
  member_profile_id?: string;
  employee_user_id?: string;
  payment_type_id?: string;
  type_of_payment_type?: string;
  description?: string;
  reference_number?: string;
  entry_date?: string;
  debit?: number;
  credit?: number;
}

export type IAdjustmentEntryResponse = IAdjustmentEntry & ITimeStamps;

export const AdjustmentEntryRequestSchema = z.object({
  signature_media_id: entityIdSchema.optional(),
  account_id: entityIdSchema, // required
  member_profile_id: entityIdSchema.optional(),
  employee_user_id: entityIdSchema.optional(),
  payment_type_id: entityIdSchema.optional(),
  type_of_payment_type: z.string().max(50).optional(),
  description: z.string().optional(),
  reference_number: z.string().optional(),
  entry_date: z.string().optional(),
  debit: z.number().optional(),
  credit: z.number().optional(),
});
