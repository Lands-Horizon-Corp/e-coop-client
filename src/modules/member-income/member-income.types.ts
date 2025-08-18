import z from "zod";
import {
  TEntityId,
  ITimeStamps,
  IAuditable,
  IOrgBranchIdentity,
  entityIdSchema,
  descriptionSchema,
  descriptionTransformerSanitizer,
} from "../common";
import { IMemberProfile } from "../member-profile/member-profile.types";
import { IMedia } from "../media/media.types";

export interface IMemberIncomeRequest {
  media_id?: TEntityId;
  name: string;
  amount: number;
  release_date?: string;
}

export interface IMemberIncomeResponse
  extends ITimeStamps,
    IAuditable,
    IOrgBranchIdentity {
  id: TEntityId;
  media_id?: TEntityId;
  media?: IMedia;
  member_profile_id: TEntityId;
  member_profile?: IMemberProfile;
  name: string;
  amount: number;
  release_date?: string;
}

export const memberIncomeRequestSchema = z.object({
  media_id: entityIdSchema.optional(),
  name: z.string().min(1).max(255),
  amount: z.number(),
  release_date: z.string().datetime().optional(),
});

export const memberIncomeSchema = z.object({
  id: entityIdSchema.optional(),
  name: z.string().min(1, "Name is required"),
  amount: z.coerce.number().min(0, "Amount must be non-negative"),
  date: z.string().min(1, "Date is required"),
  description: descriptionSchema.transform(descriptionTransformerSanitizer),
});
