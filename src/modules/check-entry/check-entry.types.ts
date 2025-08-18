import z from "zod";
import {
  TEntityId,
  ITimeStamps,
  IAuditable,
  IOrgBranchIdentity,
  entityIdSchema,
  descriptionSchema,
} from "../common";
import { IAccount } from "../account";
import { IBank } from "../bank";
import { IMemberProfile } from "../member-profile";
import { IMedia } from "../media/media.types";
import { IMemberJointAccount } from "../member-joint-account";
import { IUser } from "../user/user.types";
import { ITransactionBatch } from "../transaction-batch";
import { ITransactionResponse } from "../transaction";
import { IGeneralLedgerResponse } from "../general-ledger";
import { ChargesRateByTermHeaderRequest } from "../charges-rate-by-term-header";
import { IDisbursementResponse } from "../disbursement";

export interface IChargesRateMemberTypeModeOfPaymentRequest {
  member_type_id: TEntityId;
  mode_of_payment?: string;
  name?: string;
  description?: string;
}

export interface IChargesRateMemberTypeModeOfPaymentResponse
  extends ITimeStamps,
    IAuditable,
    IOrgBranchIdentity {
  id: TEntityId;
  member_type_id: TEntityId;
  member_type?: {
    id: TEntityId;
    name: string;
  };
  mode_of_payment: string;
  name: string;
  description: string;
}

const modeOfPaymentSchema = z.string().optional();

export const chargesRateMemberTypeModeOfPaymentRequestSchema = z.object({
  member_type_id: entityIdSchema.min(1, "Member Type ID is required"),
  mode_of_payment: modeOfPaymentSchema,
  name: z.string().optional(),
  description: descriptionSchema.optional(),
});

export interface IChargesRateSchemeRequest {
  charges_rate_by_term_header_id?: TEntityId;
  charges_rate_member_type_mode_of_payment_id?: TEntityId;
  name: string;
  description: string;
}

export interface IChargesRateSchemeResponse
  extends ITimeStamps,
    IAuditable,
    IOrgBranchIdentity {
  id: TEntityId;
  charges_rate_by_term_header_id: TEntityId;
  charges_rate_by_term_header?: ChargesRateByTermHeaderRequest;
  charges_rate_member_type_mode_of_payment_id: TEntityId;
  charges_rate_member_type_mode_of_payment?: IChargesRateMemberTypeModeOfPaymentResponse;
  name: string;
  description: string;
}

export const chargesRateSchemeRequestSchema = z.object({
  charges_rate_by_term_header_id: entityIdSchema.optional(),
  charges_rate_member_type_mode_of_payment_id: entityIdSchema.optional(),
  name: z.string().min(1).max(255),
  description: descriptionSchema,
});

export interface IChargesRateSchemeAccountRequest {
  charges_rate_scheme_id: TEntityId;
  account_id: TEntityId;
}

export interface IChargesRateSchemeAccountResponse
  extends ITimeStamps,
    IAuditable,
    IOrgBranchIdentity {
  id: TEntityId;
  charges_rate_scheme_id: TEntityId;
  charges_rate_scheme?: IChargesRateSchemeResponse;
  account_id: TEntityId;
  account?: IAccount;
}

export const chargesRateSchemeAccountRequestSchema = z.object({
  charges_rate_scheme_id: entityIdSchema.min(
    1,
    "Charges Rate Scheme ID is required"
  ),
  account_id: entityIdSchema.min(1, "Account ID is required"),
});

export interface ICheckEntryRequest {
  organization_id: TEntityId;
  branch_id: TEntityId;
  account_id?: TEntityId;
  media_id?: TEntityId;
  bank_id?: TEntityId;
  member_profile_id?: TEntityId;
  member_joint_account_id?: TEntityId;
  employee_user_id?: TEntityId;
  transaction_id?: TEntityId;
  transaction_batch_id?: TEntityId;
  general_ledger_id?: TEntityId;
  disbursement_transaction_id?: TEntityId;
  credit?: number;
  debit?: number;
  check_number: string;
  check_date?: string;
}

export interface ICheckEntryResponse
  extends ITimeStamps,
    IAuditable,
    IOrgBranchIdentity {
  id: TEntityId;
  account_id?: TEntityId;
  account?: IAccount;
  media_id?: TEntityId;
  media?: IMedia;
  bank_id?: TEntityId;
  bank?: IBank;
  member_profile_id?: TEntityId;
  member_profile?: IMemberProfile;
  member_joint_account_id?: TEntityId;
  member_joint_account?: IMemberJointAccount;
  employee_user_id?: TEntityId;
  employee_user?: IUser;
  transaction_id?: TEntityId;
  transaction?: ITransactionResponse;
  transaction_batch_id?: TEntityId;
  transaction_batch?: ITransactionBatch;
  general_ledger_id?: TEntityId;
  general_ledger?: IGeneralLedgerResponse;
  disbursement_transaction_id?: TEntityId;
  disbursement_transaction?: IDisbursementResponse;
  credit: number;
  debit: number;
  check_number: string;
  check_date?: string;
}

export const checkEntryRequestSchema = z.object({
  organization_id: entityIdSchema,
  branch_id: entityIdSchema,
  account_id: entityIdSchema.optional().nullable(),
  media_id: entityIdSchema.optional().nullable(),
  bank_id: entityIdSchema.optional().nullable(),
  member_profile_id: entityIdSchema.optional().nullable(),
  member_joint_account_id: entityIdSchema.optional().nullable(),
  employee_user_id: entityIdSchema.optional().nullable(),
  transaction_id: entityIdSchema.optional().nullable(),
  transaction_batch_id: entityIdSchema.optional().nullable(),
  general_ledger_id: entityIdSchema.optional().nullable(),
  disbursement_transaction_id: entityIdSchema.optional().nullable(),
  credit: z.number().optional(),
  debit: z.number().optional(),
  check_number: z.string().min(1).max(255),
  check_date: z.string().optional().nullable(),
});
