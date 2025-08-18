import z from "zod";
import {
  IBaseEntityMeta,
  TEntityId,
  IPaginatedResult,
  descriptionSchema,
  descriptionTransformerSanitizer,
  entityIdSchema,
  mediaSchema,
} from "../common";
export interface IMemberGender extends IBaseEntityMeta {
  id: TEntityId;

  name: string;
  description: string;
}

export interface IMemberGenderRequest {
  id?: TEntityId;

  name: string;
  description: string;
}

export interface IMemberGenderPaginated
  extends IPaginatedResult<IMemberGender> {}

export const createGenderSchema = z.object({
  name: z.string().min(1, "Gender name is required"),
  description: descriptionSchema.transform(descriptionTransformerSanitizer),
});

export const memberGovernmentBenefitSchema = z.object({
  id: entityIdSchema.optional(),
  country: z.string().min(1, "Country is required"),
  name: z.string().min(1, "Name is required"),
  description: descriptionSchema.transform(descriptionTransformerSanitizer),
  value: z.string().min(1, "Value is required"),
  frontMediaId: entityIdSchema.optional(),
  frontMediaResource: mediaSchema.optional(),
  backMediaResource: mediaSchema.optional(),
  backMediaId: entityIdSchema.optional(),
});
