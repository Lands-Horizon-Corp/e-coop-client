import { Logger } from '@/helpers/loggers'
import {
    IGeneralLedgerAccountGrouping,
    IGeneralLedgerAccountGroupingRequest,
} from '@/modules/general-ledger-account-grouping'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

const { apiCrudHooks } = createDataLayerFactory<
    IGeneralLedgerAccountGrouping,
    IGeneralLedgerAccountGroupingRequest
>({
    url: '/api/v1/general-ledger-accounts-grouping',
    baseKey: 'gl-accounts-grouping',
})

export const { useGetAll, useUpdateById } = apiCrudHooks

export const logger = Logger.getInstance('general-ledger-account-grouping')
