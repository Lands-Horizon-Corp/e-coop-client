import {
  IAuditable,
  IPaginatedResult,
  ITimeStamps,
  TEntityId,
} from "../common";

import { z } from "zod";
import { IGeneralLedgerDefinition } from "../general-ledger-definition/general-ledger-definition.types";

export type AccountingPrincipleType = "positive" | "negative";

export interface IGeneralLedgerAccountsGrouping
  extends IAuditable,
    ITimeStamps {
  id: TEntityId;

  organization_id: TEntityId;
  branch_id: TEntityId;

  debit: AccountingPrincipleType;
  credit: AccountingPrincipleType;
  name: string;
  description: string;
  general_ledger_definition: IGeneralLedgerDefinition[];

  from_code?: number;
  to_code?: number;
}

export interface IGeneralLedgerAccountsGroupingRequest {
  name: string;
  description?: string;

  debit: AccountingPrincipleType;
  credit: AccountingPrincipleType;

  from_code?: number;
  to_code?: number;
}

export interface IPaginatedGeneralLedgerAccountsGroupingRequest
  extends IPaginatedResult<IGeneralLedgerAccountsGrouping> {}

// Enum schema for debit/credit principle

export const GeneralLedgerAccountsGroupingRequestSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1024).optional(),

  //   debit: AccountingPrincipleTypeSchema,
  //   credit: AccountingPrincipleTypeSchema,

  from_code: z.number().int().nonnegative().optional(),
  to_code: z.number().int().nonnegative().optional(),
});
