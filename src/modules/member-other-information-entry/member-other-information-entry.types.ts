import z from "zod";
import {
  TEntityId,
  ITimeStamps,
  IAuditable,
  IOrgBranchIdentity,
} from "../common";

export interface IMemberOtherInformationEntryRequest {
  name: string;
  description?: string;
  entry_date?: string;
}

export interface IMemberOtherInformationEntryResponse
  extends ITimeStamps,
    IAuditable,
    IOrgBranchIdentity {
  id: TEntityId;
  name: string;
  description: string;
  entry_date: string;
}

export const memberOtherInformationEntryRequestSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  entry_date: z.string().datetime().optional(),
});
