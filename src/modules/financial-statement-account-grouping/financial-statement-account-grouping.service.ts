import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import {
    IFinancialStatementAccountGrouping,
    IFinancialStatementAccountGroupingRequest,
} from './financial-statement-account-grouping.types'

const { apiCrudHooks } = createDataLayerFactory<
    IFinancialStatementAccountGrouping,
    IFinancialStatementAccountGroupingRequest
>({
    url: '/api/v1/financial-statement-grouping',
    baseKey: 'fs-accounts-grouping',
})

export const { useGetAll, useUpdateById } = apiCrudHooks
