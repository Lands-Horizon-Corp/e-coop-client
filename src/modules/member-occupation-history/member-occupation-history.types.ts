import z from "zod";
import {
  TEntityId,
  ITimeStamps,
  IAuditable,
  IOrgBranchIdentity,
  entityIdSchema,
} from "../common";
import { IMemberProfile } from "../member-profile/member-profile.types";
import { IMemberOccupation } from "../member-occupation/member-occupation.types";

export interface IMemberOccupationHistoryRequest {
  member_profile_id: TEntityId;
  member_occupation_id: TEntityId;
}

export interface IMemberOccupationHistoryResponse
  extends ITimeStamps,
    IAuditable,
    IOrgBranchIdentity {
  id: TEntityId;
  member_profile_id: TEntityId;
  member_profile?: IMemberProfile;
  member_occupation_id: TEntityId;
  member_occupation?: IMemberOccupation;
}

export const memberOccupationHistoryRequestSchema = z.object({
  member_profile_id: entityIdSchema,
  member_occupation_id: entityIdSchema,
});
