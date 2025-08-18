import z from "zod";
import {
  TEntityId,
  ITimeStamps,
  IAuditable,
  IOrgBranchIdentity,
} from "../common";

export interface IInterestRateSchemeRequest {
  name: string;
  description?: string;
}

export interface IInterestRateSchemeResponse
  extends ITimeStamps,
    IAuditable,
    IOrgBranchIdentity {
  id: TEntityId;
  name: string;
  description: string;
}

export const interestRateSchemeRequestSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
});
