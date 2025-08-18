import { z } from "zod";
import {
  descriptionSchema,
  descriptionTransformerSanitizer,
  entityIdSchema,
  IBaseEntityMeta,
  organizationBranchIdsSchema,
  TEntityId,
} from "../common";
import { IAccount } from "../account";
import { IComputationSheetResponse } from "../computation-sheet";

export interface IIncludeNegativeAccount extends IBaseEntityMeta {
  computation_sheet_id: TEntityId;
  computation_sheet: IComputationSheetResponse;

  account_id: TEntityId;
  account: IAccount;

  description?: string;
}

export interface IIncludeNegativeAccountRequest {
  id?: TEntityId;

  computation_sheet_id: TEntityId;

  account_id: TEntityId;

  description?: string;
}

export const includeNegativeAccountSchema = z
  .object({
    id: entityIdSchema.optional(),

    computation_sheet_id: entityIdSchema,
    account_id: entityIdSchema,
    account: z.any(),

    description: descriptionSchema
      .optional()
      .transform(descriptionTransformerSanitizer),
  })
  .merge(organizationBranchIdsSchema);
