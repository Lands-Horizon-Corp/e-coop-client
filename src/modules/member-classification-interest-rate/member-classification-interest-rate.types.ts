import z from "zod";
import {
  TEntityId,
  ITimeStamps,
  IAuditable,
  IOrgBranchIdentity,
  entityIdSchema,
} from "../common";
import { IMemberClassification } from "../member-classification/member-classification.types";
import { IInterestRateSchemeResponse } from "../interest-rate-scheme";
import { IInterestRateByTermsHeaderResponse } from "../interest-rate-by-terms-header";

export interface IMemberClassificationInterestRateRequest {
  name: string;
  description?: string;
  interest_rate_scheme_id?: TEntityId;
  member_classification_id?: TEntityId;
  interest_rate_by_terms_header_id?: TEntityId;
}

export interface IMemberClassificationInterestRateResponse
  extends ITimeStamps,
    IAuditable,
    IOrgBranchIdentity {
  id: TEntityId;
  name: string;
  description: string;
  interest_rate_scheme_id?: TEntityId;
  interest_rate_scheme?: IInterestRateSchemeResponse;
  member_classification_id?: TEntityId;
  member_classification?: IMemberClassification;
  interest_rate_by_terms_header_id?: TEntityId;
  interest_rate_by_terms_header?: IInterestRateByTermsHeaderResponse;
}

export const memberClassificationInterestRateRequestSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  interest_rate_scheme_id: entityIdSchema.optional(),
  member_classification_id: entityIdSchema.optional(),
  interest_rate_by_terms_header_id: entityIdSchema.optional(),
});
