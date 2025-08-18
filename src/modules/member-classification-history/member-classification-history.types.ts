import z from "zod";
import {
  TEntityId,
  ITimeStamps,
  IAuditable,
  IOrgBranchIdentity,
  entityIdSchema,
} from "../common";
import { IMemberProfile } from "../member-profile/member-profile.types";
import { IMemberClassification } from "../member-classification/member-classification.types";

export interface IMemberClassificationHistoryRequest {
  member_classification_id: TEntityId;
  member_profile_id: TEntityId;
  branch_id: TEntityId;
  organization_id: TEntityId;
}

export interface IMemberClassificationHistoryResponse
  extends ITimeStamps,
    IAuditable,
    IOrgBranchIdentity {
  id: TEntityId;
  member_classification_id: TEntityId;
  member_classification?: IMemberClassification;
  member_profile_id: TEntityId;
  member_profile?: IMemberProfile;
}

export const memberClassificationHistoryRequestSchema = z.object({
  member_classification_id: entityIdSchema,
  member_profile_id: entityIdSchema,
  branch_id: entityIdSchema,
  organization_id: entityIdSchema,
});
