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
import { IMemberProfile } from "../member-profile";
import { IUser } from "../user/user.types";

export interface ICollectorsMemberAccountEntryRequest {
  collector_user_id?: TEntityId;
  member_profile_id?: TEntityId;
  account_id?: TEntityId;
  description?: string;
}

export interface ICollectorsMemberAccountEntryResponse
  extends ITimeStamps,
    IAuditable,
    IOrgBranchIdentity {
  id: TEntityId;
  collector_user_id?: TEntityId;
  collector_user?: IUser;
  member_profile_id?: TEntityId;
  member_profile?: IMemberProfile;
  account_id?: TEntityId;
  account?: IAccount;
  description: string;
}

export const collectorsMemberAccountEntryRequestSchema = z.object({
  collector_user_id: entityIdSchema.optional().nullable(),
  member_profile_id: entityIdSchema.optional().nullable(),
  account_id: entityIdSchema.optional().nullable(),
  description: descriptionSchema.optional(),
});
