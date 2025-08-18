import { IBranch } from "../branch";
import {
  descriptionSchema,
  descriptionTransformerSanitizer,
  entityIdSchema,
  IAuditable,
  ITimeStamps,
  TEntityId,
} from "../common";
import { IMedia } from "../media/media.types";
import { IMemberProfile } from "../member-profile/member-profile.types";
import z from "zod";

export interface IMemberAssetRequest {
  id?: TEntityId;
  media_id?: TEntityId;

  member_profile_id: TEntityId;

  branch_id?: TEntityId;

  name: string;
  entry_date: string;
  description: string;
  cost: number;
}

export interface IMemberAsset extends ITimeStamps, IAuditable {
  id: TEntityId;
  media_id?: TEntityId;
  media?: IMedia;

  member_profile_id: TEntityId;
  member_profile: IMemberProfile;

  branch_id: TEntityId;
  branch: IBranch;

  name: string;
  entry_date: string;
  description: string;
  cost: number;
}

export const memberAssetsSchema = z.object({
  id: entityIdSchema.optional(),
  entryDate: z.string().min(1, "Entry Date is required"),
  description: descriptionSchema.transform(descriptionTransformerSanitizer),
  name: z.string().min(1, "Name is required"),
});
