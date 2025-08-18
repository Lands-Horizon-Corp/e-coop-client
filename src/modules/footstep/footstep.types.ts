import z from "zod";
import {
  TEntityId,
  ITimeStamps,
  IAuditable,
  IOrgBranchIdentity,
  entityIdSchema,
  descriptionSchema,
} from "../common";
import { I } from "vitest/dist/chunks/reporters.d.BFLkQcL6.js";
import { IUser } from "../user/user.types";
import { IMedia } from "../media/media.types";

export interface IFootstepRequest {
  organization_id: TEntityId;
  branch_id: TEntityId;
  user_id?: TEntityId;
  media_id?: TEntityId;
  description: string;
  activity: string;
  account_type: string;
  module: string;
  latitude?: number;
  longitude?: number;
  ip_address: string;
  user_agent: string;
  referer: string;
  location: string;
  accept_language: string;
}

export interface IFootstepResponse
  extends ITimeStamps,
    IAuditable,
    IOrgBranchIdentity {
  id: TEntityId;
  user_id?: TEntityId;
  user?: IUser;
  media_id?: TEntityId;
  media?: IMedia;
  description: string;
  activity: string;
  account_type: string;
  module: string;
  latitude?: number;
  longitude?: number;
  timestamp: string;
  is_deleted: boolean;
  ip_address: string;
  user_agent: string;
  referer: string;
  location: string;
  accept_language: string;
}

export const footstepRequestSchema = z.object({
  organization_id: entityIdSchema,
  branch_id: entityIdSchema,
  user_id: entityIdSchema.optional().nullable(),
  media_id: entityIdSchema.optional().nullable(),
  description: z.string().min(1),
  activity: z.string().min(1),
  account_type: z.string().min(1).max(11),
  module: z.string().min(1),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  ip_address: z.string().max(45),
  user_agent: z.string().max(1000),
  referer: z.string().max(1000),
  location: z.string().max(255),
  accept_language: z.string().max(255),
});
