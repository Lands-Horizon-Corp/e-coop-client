import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type {
    IJournalVoucherEntry,
    IJournalVoucherEntryRequest,
} from '../journal-voucher-entry'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: journalVoucherEntryBaseKey,
} = createDataLayerFactory<IJournalVoucherEntry, IJournalVoucherEntryRequest>({
    url: '/api/v1/journal-voucher-entry',
    baseKey: 'journal-voucher-entry',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: journalVoucherEntryAPIRoute, // matches url above

    create: createJournalVoucherEntry,
    updateById: updateJournalVoucherEntryById,

    deleteById: deleteJournalVoucherEntryById,
    deleteMany: deleteManyJournalVoucherEntry,

    getById: getJournalVoucherEntryById,
    getAll: getAllJournalVoucherEntry,
    getPaginated: getPaginatedJournalVoucherEntry,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { journalVoucherEntryBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateJournalVoucherEntry,
    useUpdateById: useUpdateJournalVoucherEntryById,

    useGetAll: useGetAllJournalVoucherEntry,
    useGetById: useGetJournalVoucherEntryById,
    useGetPaginated: useGetPaginatedJournalVoucherEntry,

    useDeleteById: useDeleteJournalVoucherEntryById,
    useDeleteMany: useDeleteManyJournalVoucherEntry,
} = apiCrudHooks

export const logger = Logger.getInstance('journal-voucher-entry')
