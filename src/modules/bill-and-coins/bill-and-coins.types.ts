import z from "zod";
import { IBranch } from "../branch/branch.types";
import { IPaginatedResult, ITimeStamps, TEntityId } from "../common";
import { IMedia } from "../media/media.types";
import { IOrganization } from "../organization/organization.types";

export interface IBillsAndCoinRequest {
  id?: TEntityId;

  organization_id?: TEntityId;
  branch_id?: TEntityId;

  media_id?: TEntityId;

  name: string;
  value: number;
  country_code: string;
}

export interface IBillsAndCoin extends ITimeStamps {
  id: TEntityId;

  organization_id: TEntityId;
  organization: IOrganization;

  branch_id: TEntityId;
  branch: IBranch;

  created_by_id?: TEntityId;
  updated_by_id?: TEntityId;
  deleted_by_id?: TEntityId;

  media_id?: TEntityId;
  media?: IMedia;

  name: string;
  value: number;
  country_code: string;
}

export interface IBillsAndCoinPaginated
  extends IPaginatedResult<IBillsAndCoin> {}

const billsAndCoinSchema = z.object({
  name: z.string().min(1, "Name is required"),
  value: z.coerce.number().min(0, "Value is required"),
  country_code: z.string().min(1, "Country code is required"),
  media_id: z.string().optional(),
  media: z.any(),
  branch_id: z.string().optional(),
  organization_id: z.string().optional(),
});

export type TBillsAndCoinFormValues = z.infer<typeof billsAndCoinSchema>;
