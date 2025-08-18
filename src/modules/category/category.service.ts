import { createDataLayerFactory } from "@/providers/repositories/data-layer-factory";
import type { TCategory, TCategoryRequest } from "../category";

const CategoryDataLayer = createDataLayerFactory<TCategory, TCategoryRequest>({
    url: "/api/v1/category",
    baseKey: "category",
});

// Add mo custom crud api service here

export const CategoryAPI = { ...CategoryDataLayer.apiCrudService };

// Add mo custom api query hooks here

export const CategoryHook = { ...CategoryDataLayer.apiCrudHooks };
