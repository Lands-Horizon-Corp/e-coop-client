import { z } from "zod";
import { entityIdSchema } from "../common";
import { OrganizationCategoryResponseSchema } from "../organization-category";

export const CategoryBaseSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1).max(2048),
  color: z.string().min(1).max(50),
  icon: z.string().min(1).max(50),
});

export const CategoryResponseSchema = CategoryBaseSchema.extend({
  id: entityIdSchema,
  created_at: z.string(),
  updated_at: z.string(),
  organization_categories: z
    .array(OrganizationCategoryResponseSchema)
    .optional(),
});

export const CategoryRequestSchema = CategoryBaseSchema.extend({
  id: entityIdSchema.optional(),
});

export type TCategoryBase = z.infer<typeof CategoryBaseSchema>;
export type TCategory = z.infer<typeof CategoryResponseSchema>;
export type TCategoryResponse = z.infer<typeof CategoryResponseSchema>;
export type TCategoryRequest = z.infer<typeof CategoryRequestSchema>;
