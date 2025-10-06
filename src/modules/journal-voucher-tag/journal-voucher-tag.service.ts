import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type {
    IJournalVoucherTag,
    IJournalVoucherTagRequest,
} from '../journal-voucher-tag'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: journalVoucherTagBaseKey,
} = createDataLayerFactory<IJournalVoucherTag, IJournalVoucherTagRequest>({
    url: '/api/v1/journal-voucher-tag',
    baseKey: 'journal-voucher-tag',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: journalVoucherTagAPIRoute, // matches url above

    create: createJournalVoucherTag,
    updateById: updateJournalVoucherTagById,

    deleteById: deleteJournalVoucherTagById,
    deleteMany: deleteManyJournalVoucherTag,

    getById: getJournalVoucherTagById,
    getAll: getAllJournalVoucherTag,
    getPaginated: getPaginatedJournalVoucherTag,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { journalVoucherTagBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateJournalVoucherTag,
    useUpdateById: useUpdateJournalVoucherTagById,

    useGetAll: useGetAllJournalVoucherTag,
    useGetById: useGetJournalVoucherTagById,
    useGetPaginated: useGetPaginatedJournalVoucherTag,

    useDeleteById: useDeleteJournalVoucherTagById,
    useDeleteMany: useDeleteManyJournalVoucherTag,
} = apiCrudHooks

// custom hooks can go here
