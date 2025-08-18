import z from "zod";
import {
  TEntityId,
  ITimeStamps,
  IAuditable,
  IOrgBranchIdentity,
  entityIdSchema,
} from "../common";
import { IMemberProfile } from "../member-profile/member-profile.types";
import { IUser } from "../user/user.types";

export interface IMemberVerificationRequest {
  member_profile_id: TEntityId;
  verified_by_user_id?: TEntityId;
  status?: string;
}

export interface IMemberVerificationResponse
  extends ITimeStamps,
    IAuditable,
    IOrgBranchIdentity {
  id: TEntityId;
  member_profile_id: TEntityId;
  member_profile?: IMemberProfile;
  verified_by_user_id?: TEntityId;
  verified_by_user?: IUser;
  status: string;
}

export const memberVerificationRequestSchema = z.object({
  member_profile_id: entityIdSchema,
  verified_by_user_id: entityIdSchema.optional(),
  status: z.string().optional(),
});
