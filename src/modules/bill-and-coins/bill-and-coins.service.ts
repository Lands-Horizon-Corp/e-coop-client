import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory';

import type { IBillsAndCoin, IBillsAndCoinRequest } from './bill-and-coins.types';

const { apiCrudHooks, apiCrudService } = createDataLayerFactory<
    IBillsAndCoin,
    IBillsAndCoinRequest
>({
    url: '/api/v1/bills-and-coins',
    baseKey: 'bills-and-coins',
});

// Add custom CRUD API service here if needed

export const {
    useCreate,
    useDeleteById,
    useDeleteMany,
    useGetAll,
    useGetById,
    useGetPaginated,
    useUpdateById,
} = apiCrudHooks;

// Add custom API query hooks here if needed

export const BillAndCoinsAPI = apiCrudService;
