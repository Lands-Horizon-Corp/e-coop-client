import z from "zod";
import {
  TEntityId,
  ITimeStamps,
  IAuditable,
  IOrgBranchIdentity,
  entityIdSchema,
} from "../common";
import { IMemberClassificationInterestRateResponse } from "../member-classification-interest-rate";

export interface IInterestRateByTermsHeaderRequest {
  member_classification_interest_rate_id: TEntityId;
  header_1?: number;
  header_2?: number;
  header_3?: number;
  header_4?: number;
  header_5?: number;
  header_6?: number;
  header_7?: number;
  header_8?: number;
  header_9?: number;
  header_10?: number;
  header_11?: number;
  header_12?: number;
  header_13?: number;
  header_14?: number;
  header_15?: number;
  header_16?: number;
  header_17?: number;
  header_18?: number;
  header_19?: number;
  header_20?: number;
  header_21?: number;
  header_22?: number;
}

export interface IInterestRateByTermsHeaderResponse
  extends ITimeStamps,
    IAuditable,
    IOrgBranchIdentity {
  id: TEntityId;
  member_classification_interest_rate_id: TEntityId;
  member_classification_interest_rate?: IMemberClassificationInterestRateResponse;
  header_1: number;
  header_2: number;
  header_3: number;
  header_4: number;
  header_5: number;
  header_6: number;
  header_7: number;
  header_8: number;
  header_9: number;
  header_10: number;
  header_11: number;
  header_12: number;
  header_13: number;
  header_14: number;
  header_15: number;
  header_16: number;
  header_17: number;
  header_18: number;
  header_19: number;
  header_20: number;
  header_21: number;
  header_22: number;
}

export const interestRateByTermsHeaderRequestSchema = z.object({
  member_classification_interest_rate_id: entityIdSchema,
  header_1: z.number().optional(),
  header_2: z.number().optional(),
  header_3: z.number().optional(),
  header_4: z.number().optional(),
  header_5: z.number().optional(),
  header_6: z.number().optional(),
  header_7: z.number().optional(),
  header_8: z.number().optional(),
  header_9: z.number().optional(),
  header_10: z.number().optional(),
  header_11: z.number().optional(),
  header_12: z.number().optional(),
  header_13: z.number().optional(),
  header_14: z.number().optional(),
  header_15: z.number().optional(),
  header_16: z.number().optional(),
  header_17: z.number().optional(),
  header_18: z.number().optional(),
  header_19: z.number().optional(),
  header_20: z.number().optional(),
  header_21: z.number().optional(),
  header_22: z.number().optional(),
});
