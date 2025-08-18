import { IBaseEntityMeta } from "../common";
import { IUserBase } from "../user/user.types";
import { IMedia } from "../media/media.types";

export interface ICashCheckVoucherResponse extends IBaseEntityMeta {
  id: string;

  employee_user_id?: string;
  employee_user?: IUserBase;

  transaction_batch_id?: string;
  //   transaction_batch?: ITransact;

  printed_by_user_id?: string;
  printed_by_user?: IUserBase;

  approved_by_user_id?: string;
  approved_by_user?: IUserBase;

  released_by_user_id?: string;
  released_by_user?: IUserBase;

  pay_to: string;

  status: string;
  description: string;
  cash_voucher_number: string;
  total_debit: number;
  total_credit: number;
  print_count: number;
  printed_date?: string;
  approved_date?: string;
  released_date?: string;

  approved_by_signature_media_id?: string;
  approved_by_signature_media?: IMedia;
  approved_by_name: string;
  approved_by_position: string;

  prepared_by_signature_media_id?: string;
  prepared_by_signature_media?: IMedia;
  prepared_by_name: string;
  prepared_by_position: string;

  certified_by_signature_media_id?: string;
  certified_by_signature_media?: IMedia;
  certified_by_name: string;
  certified_by_position: string;

  verified_by_signature_media_id?: string;
  verified_by_signature_media?: IMedia;
  verified_by_name: string;
  verified_by_position: string;

  check_by_signature_media_id?: string;
  check_by_signature_media?: IMedia;
  check_by_name: string;
  check_by_position: string;

  acknowledge_by_signature_media_id?: string;
  acknowledge_by_signature_media?: IMedia;
  acknowledge_by_name: string;
  acknowledge_by_position: string;

  noted_by_signature_media_id?: string;
  noted_by_signature_media?: IMedia;
  noted_by_name: string;
  noted_by_position: string;

  posted_by_signature_media_id?: string;
  posted_by_signature_media?: IMedia;
  posted_by_name: string;
  posted_by_position: string;

  paid_by_signature_media_id?: string;
  paid_by_signature_media?: IMedia;
  paid_by_name: string;
  paid_by_position: string;
}

export interface ICashCheckVoucherRequest {
  employee_user_id?: string;
  transaction_batch_id?: string;
  printed_by_user_id?: string;
  approved_by_user_id?: string;
  released_by_user_id?: string;

  pay_to?: string;
  status?: string;
  description?: string;
  cash_voucher_number?: string;
  total_debit?: number;
  total_credit?: number;
  print_count?: number;
  printed_date?: string;
  approved_date?: string;
  released_date?: string;

  approved_by_signature_media_id?: string;
  approved_by_name?: string;
  approved_by_position?: string;

  prepared_by_signature_media_id?: string;
  prepared_by_name?: string;
  prepared_by_position?: string;

  certified_by_signature_media_id?: string;
  certified_by_name?: string;
  certified_by_position?: string;

  verified_by_signature_media_id?: string;
  verified_by_name?: string;
  verified_by_position?: string;

  check_by_signature_media_id?: string;
  check_by_name?: string;
  check_by_position?: string;

  acknowledge_by_signature_media_id?: string;
  acknowledge_by_name?: string;
  acknowledge_by_position?: string;

  noted_by_signature_media_id?: string;
  noted_by_name?: string;
  noted_by_position?: string;

  posted_by_signature_media_id?: string;
  posted_by_name?: string;
  posted_by_position?: string;

  paid_by_signature_media_id?: string;
  paid_by_name?: string;
  paid_by_position?: string;
}

// ---------------- SCHEMAS ----------------

// export const CashCheckVoucherResponseSchema = z.object({
//   id: EntityIdSchema,
//   created_at: z.string(),
//   updated_at: z.string(),

//   created_by_id: EntityIdSchema,
//   created_by: UserResponseSchema.optional(),

//   updated_by_id: EntityIdSchema,
//   updated_by: UserResponseSchema.optional(),

//   organization_id: EntityIdSchema,
//   organization: OrganizationResponseSchema.optional(),

//   branch_id: EntityIdSchema,
//   branch: BranchResponseSchema.optional(),

//   employee_user_id: EntityIdSchema.optional(),
//   employee_user: UserResponseSchema.optional(),

//   transaction_batch_id: EntityIdSchema.optional(),
//   transaction_batch: TransactionBatchResponseSchema.optional(),

//   printed_by_user_id: EntityIdSchema.optional(),
//   printed_by_user: UserResponseSchema.optional(),

//   approved_by_user_id: EntityIdSchema.optional(),
//   approved_by_user: UserResponseSchema.optional(),

//   released_by_user_id: EntityIdSchema.optional(),
//   released_by_user: UserResponseSchema.optional(),

//   pay_to: z.string(),

//   status: z.string(),
//   description: z.string(),
//   cash_voucher_number: z.string(),
//   total_debit: z.number(),
//   total_credit: z.number(),
//   print_count: z.number(),
//   printed_date: z.string().optional(),
//   approved_date: z.string().optional(),
//   released_date: z.string().optional(),

//   approved_by_signature_media_id: EntityIdSchema.optional(),
//   approved_by_signature_media: MediaResponseSchema.optional(),
//   approved_by_name: z.string(),
//   approved_by_position: z.string(),

//   prepared_by_signature_media_id: EntityIdSchema.optional(),
//   prepared_by_signature_media: MediaResponseSchema.optional(),
//   prepared_by_name: z.string(),
//   prepared_by_position: z.string(),

//   certified_by_signature_media_id: EntityIdSchema.optional(),
//   certified_by_signature_media: MediaResponseSchema.optional(),
//   certified_by_name: z.string(),
//   certified_by_position: z.string(),

//   verified_by_signature_media_id: EntityIdSchema.optional(),
//   verified_by_signature_media: MediaResponseSchema.optional(),
//   verified_by_name: z.string(),
//   verified_by_position: z.string(),

//   check_by_signature_media_id: EntityIdSchema.optional(),
//   check_by_signature_media: MediaResponseSchema.optional(),
//   check_by_name: z.string(),
//   check_by_position: z.string(),

//   acknowledge_by_signature_media_id: EntityIdSchema.optional(),
//   acknowledge_by_signature_media: MediaResponseSchema.optional(),
//   acknowledge_by_name: z.string(),
//   acknowledge_by_position: z.string(),

//   noted_by_signature_media_id: EntityIdSchema.optional(),
//   noted_by_signature_media: MediaResponseSchema.optional(),
//   noted_by_name: z.string(),
//   noted_by_position: z.string(),

//   posted_by_signature_media_id: EntityIdSchema.optional(),
//   posted_by_signature_media: MediaResponseSchema.optional(),
//   posted_by_name: z.string(),
//   posted_by_position: z.string(),

//   paid_by_signature_media_id: EntityIdSchema.optional(),
//   paid_by_signature_media: MediaResponseSchema.optional(),
//   paid_by_name: z.string(),
//   paid_by_position: z.string(),
// });

// export const CashCheckVoucherRequestSchema = z.object({
//   employee_user_id: EntityIdSchema.optional(),
//   transaction_batch_id: EntityIdSchema.optional(),
//   printed_by_user_id: EntityIdSchema.optional(),
//   approved_by_user_id: EntityIdSchema.optional(),
//   released_by_user_id: EntityIdSchema.optional(),

//   pay_to: z.string().optional(),
//   status: z.string().optional(),
//   description: z.string().optional(),
//   cash_voucher_number: z.string().optional(),
//   total_debit: z.number().optional(),
//   total_credit: z.number().optional(),
//   print_count: z.number().optional(),
//   printed_date: z.string().optional(),
//   approved_date: z.string().optional(),
//   released_date: z.string().optional(),

//   approved_by_signature_media_id: EntityIdSchema.optional(),
//   approved_by_name: z.string().optional(),
//   approved_by_position: z.string().optional(),

//   prepared_by_signature_media_id: EntityIdSchema.optional(),
//   prepared_by_name: z.string().optional(),
//   prepared_by_position: z.string().optional(),

//   certified_by_signature_media_id: EntityIdSchema.optional(),
//   certified_by_name: z.string().optional(),
//   certified_by_position: z.string().optional(),

//   verified_by_signature_media_id: EntityIdSchema.optional(),
//   verified_by_name: z.string().optional(),
//   verified_by_position: z.string().optional(),

//   check_by_signature_media_id: EntityIdSchema.optional(),
//   check_by_name: z.string().optional(),
//   check_by_position: z.string().optional(),

//   acknowledge_by_signature_media_id: EntityIdSchema.optional(),
//   acknowledge_by_name: z.string().optional(),
//   acknowledge_by_position: z.string().optional(),

//   noted_by_signature_media_id: EntityIdSchema.optional(),
//   noted_by_name: z.string().optional(),
//   noted_by_position: z.string().optional(),

//   posted_by_signature_media_id: EntityIdSchema.optional(),
//   posted_by_name: z.string().optional(),
//   posted_by_position: z.string().optional(),

//   paid_by_signature_media_id: EntityIdSchema.optional(),
//   paid_by_name: z.string().optional(),
//   paid_by_position: z.string().optional(),
// });
