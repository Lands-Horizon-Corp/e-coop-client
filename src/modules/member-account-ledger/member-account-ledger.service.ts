import { Logger } from '@/helpers/loggers'
import type { IMemberAccountingLedger } from '@/modules/member-account-ledger'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: memberAccountLedgerBaseKey,
} = createDataLayerFactory<IMemberAccountingLedger, never>({
    url: '/api/v1/member-account-ledger',
    baseKey: 'member-account-ledger',
})

export const {
    API,
    route: memberAccountLedgerAPIRoute,

    create: createMemberAccountLedger,
    updateById: updateMemberAccountLedgerById,

    deleteById: deleteMemberAccountLedgerById,
    deleteMany: deleteManyMemberAccountLedger,

    getById: getMemberAccountLedgerById,
    getAll: getAllMemberAccountLedger,
    getPaginated: getPaginatedMemberAccountLedger,
} = apiCrudService

export { memberAccountLedgerBaseKey }

export const {
    useCreate: useCreateMemberAccountLedger,
    useUpdateById: useUpdateMemberAccountLedgerById,

    useGetAll: useGetAllMemberAccountLedger,
    useGetById: useGetMemberAccountLedgerById,
    useGetPaginated: useGetPaginatedMemberAccountLedger,

    useDeleteById: useDeleteMemberAccountLedgerById,
    useDeleteMany: useDeleteManyMemberAccountLedger,
} = apiCrudHooks

export const logger = Logger.getInstance('member-account-ledger')
