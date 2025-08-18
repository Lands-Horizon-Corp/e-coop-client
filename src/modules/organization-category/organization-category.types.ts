import { z } from "zod";
import {
  entityIdSchema,
  NullableentityIdSchema,
  TimeStampSchema,
} from "../common";
import { CategoryBaseSchema } from "../category/category.types";

export const OrganizationCategoryBaseSchema = z.object({
  organization_id: NullableentityIdSchema,
  category_id: entityIdSchema,
});
export type TOrganizationCategoryBase = z.infer<
  typeof OrganizationCategoryBaseSchema
>;

export const OrganizationCategoryResponseSchema =
  OrganizationCategoryBaseSchema.extend({
    id: entityIdSchema,
    category: CategoryBaseSchema.optional(),
  }).extend(TimeStampSchema.omit({ deleted_at: true }));

export type OrganizationCategoryResponse = z.infer<
  typeof OrganizationCategoryResponseSchema
>;

export const OrganizationCategoryRequestSchema =
  OrganizationCategoryBaseSchema.extend({
    id: entityIdSchema.optional(),
  });

export type OrganizationCategoryRequest = z.infer<
  typeof OrganizationCategoryRequestSchema
>;
