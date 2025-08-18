import z from "zod";
import {
  TEntityId,
  ITimeStamps,
  IAuditable,
  IOrgBranchIdentity,
  entityIdSchema,
} from "../common";
import { IMemberProfile } from "../member-profile";
import { ITransactionResponse } from "../transaction";
import { IMemberJointAccount } from "../member-joint-account";
import { IGeneralLedger } from "../general-ledger";
import { IAccount } from "../account";
import { IUser } from "../user/user.types";
import { IMedia } from "../media/media.types";

export interface IDepositEntryRequest {
  organization_id: TEntityId;
  branch_id: TEntityId;
  member_profile_id?: TEntityId;
  transaction_id?: TEntityId;
  member_joint_account_id?: TEntityId;
  general_ledger_id?: TEntityId;
  transaction_batch_id?: TEntityId;
  signature_media_id?: TEntityId;
  account_id?: TEntityId;
  employee_user_id?: TEntityId;
  reference_number?: string;
  amount?: number;
}

export interface IDepositEntryResponse
  extends ITimeStamps,
    IAuditable,
    IOrgBranchIdentity {
  id: TEntityId;
  member_profile_id?: TEntityId;
  member_profile?: IMemberProfile;
  transaction_id?: TEntityId;
  transaction?: ITransactionResponse;
  member_joint_account_id?: TEntityId;
  member_joint_account?: IMemberJointAccount;
  general_ledger_id?: TEntityId;
  general_ledger?: IGeneralLedger;
  transaction_batch_id?: TEntityId;
  transaction_batch?: ITransactionResponse;
  signature_media_id?: TEntityId;
  signature_media?: IMedia;
  account_id?: TEntityId;
  account?: IAccount;
  employee_user_id?: TEntityId;
  employee_user?: IUser;
  reference_number: string;
  amount: number;
}

export const depositEntryRequestSchema = z.object({
  organization_id: entityIdSchema,
  branch_id: entityIdSchema,
  member_profile_id: entityIdSchema.optional().nullable(),
  transaction_id: entityIdSchema.optional().nullable(),
  member_joint_account_id: entityIdSchema.optional().nullable(),
  general_ledger_id: entityIdSchema.optional().nullable(),
  transaction_batch_id: entityIdSchema.optional().nullable(),
  signature_media_id: entityIdSchema.optional().nullable(),
  account_id: entityIdSchema.optional().nullable(),
  employee_user_id: entityIdSchema.optional().nullable(),
  reference_number: z.string().optional(),
  amount: z.number().optional(),
});

export interface IDisbursementRequest {
  name: string;
  icon?: string;
  description?: string;
}

export interface IDisbursementResponse
  extends ITimeStamps,
    IAuditable,
    IOrgBranchIdentity {
  id: TEntityId;
  name: string;
  icon: string;
  description: string;
}

export const disbursementRequestSchema = z.object({
  name: z.string().min(1).max(50),
  icon: z.string().optional(),
  description: z.string().optional(),
});
