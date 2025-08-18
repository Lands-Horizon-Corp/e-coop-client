import z from "zod";
import { TEntityId, ITimeStamps, entityIdSchema } from "../common";

export interface IContactUsRequest {
  id?: TEntityId;
  first_name: string;
  last_name?: string;
  email?: string;
  contact_number?: string;
  description: string;
}

export interface IContactUsResponse extends ITimeStamps {
  id: TEntityId;
  first_name: string;
  last_name?: string;
  email?: string;
  contact_number?: string;
  description: string;
}

export const contactUsRequestSchema = z.object({
  id: entityIdSchema.optional(),
  first_name: z.string().min(1).max(255),
  last_name: z.string().min(1).max(255).optional(),
  email: z.string().email().max(255).optional(),
  contact_number: z.string().min(1).max(20).optional(),
  description: z.string().min(1),
});
