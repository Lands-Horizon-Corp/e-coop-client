import { z } from 'zod';
import { entityIdSchema } from '../common';

// Define the Zod schema for CategoryResponse
export const CategoryResponseSchema = z.object({
    id: entityIdSchema,
    created_at: z.string(),
    updated_at: z.string(),
    name: z.string(),
    description: z.string(),
    color: z.string(),
    icon: z.string(),
    organization_categories: z.array(z.any()).optional(), // Replace `z.any()` with the schema for OrganizationCategoryResponse if available
});

// Define the Zod schema for CategoryRequest
export const CategoryRequestSchema = z.object({
    id: entityIdSchema.optional(),
    name: z.string().min(1).max(255),
    description: z.string().min(1).max(2048),
    color: z.string().min(1).max(50),
    icon: z.string().min(1).max(50),
});

// Infer the TypeScript types from the Zod schemas
export type TCategory = z.infer<typeof CategoryResponseSchema>;
export type TCategoryRequest = z.infer<typeof CategoryRequestSchema>;
