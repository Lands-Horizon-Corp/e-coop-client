import z from "zod";
import {
  TEntityId,
  ITimeStamps,
  IAuditable,
  IOrgBranchIdentity,
} from "../common";

export interface IGroceryComputationSheetRequest {
  scheme_number: number;
  description?: string;
}

export interface IGroceryComputationSheetResponse
  extends ITimeStamps,
    IAuditable,
    IOrgBranchIdentity {
  id: TEntityId;
  scheme_number: number;
  description: string;
}

export const groceryComputationSheetRequestSchema = z.object({
  scheme_number: z.number(),
  description: z.string().optional(),
});
