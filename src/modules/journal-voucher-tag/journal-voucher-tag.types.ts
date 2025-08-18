import z from "zod";
import {
  TEntityId,
  ITimeStamps,
  IAuditable,
  IOrgBranchIdentity,
  entityIdSchema,
} from "../common";
import { IJournalVoucherResponse } from "../journal-voucher/journal-voucher.types";

export interface IJournalVoucherTagRequest {
  journal_voucher_id: TEntityId;
  name?: string;
  description?: string;
  category?: string;
  color?: string;
  icon?: string;
}

export interface IJournalVoucherTagResponse
  extends ITimeStamps,
    IAuditable,
    IOrgBranchIdentity {
  id: TEntityId;
  journal_voucher_id: TEntityId;
  journal_voucher?: IJournalVoucherResponse;
  name: string;
  description: string;
  category: string;
  color: string;
  icon: string;
}

export const journalVoucherTagRequestSchema = z.object({
  journal_voucher_id: entityIdSchema,
  name: z.string().max(50).optional(),
  description: z.string().optional(),
  category: z.string().max(50).optional(),
  color: z.string().max(20).optional(),
  icon: z.string().max(20).optional(),
});
