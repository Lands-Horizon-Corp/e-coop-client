import { IBranch } from "../branch";
import {
  TEntityId,
  IPaginatedResult,
  IAuditable,
  ITimeStamps,
} from "../common";

export interface IMemberOccupationRequest {
  name: string;
  description: string;

  // branch_id: TEntityId
}

export interface IMemberOccupation extends ITimeStamps, IAuditable {
  id: TEntityId;

  branch_id: TEntityId;
  branch: IBranch;

  name: string;
  description: string;
}

export interface IMemberOccupationPaginated
  extends IPaginatedResult<IMemberOccupation> {}
