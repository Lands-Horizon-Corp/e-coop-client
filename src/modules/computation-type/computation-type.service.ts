import { Logger } from '@/helpers/loggers'
import type {
    IAccountsComputationType,
    IAccountsComputationTypeRequest,
} from '@/modules/computation-type'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: accountsComputationTypeBaseKey,
} = createDataLayerFactory<
    IAccountsComputationType,
    IAccountsComputationTypeRequest
>({
    url: '/api/v1/accounts-computation-type',
    baseKey: 'accounts-computation-type',
})

export const {
    API,
    route: accountsComputationTypeAPIRoute,

    create: createAccountsComputationType,
    updateById: updateAccountsComputationTypeById,

    deleteById: deleteAccountsComputationTypeById,
    deleteMany: deleteManyAccountsComputationType,

    getById: getAccountsComputationTypeById,
    getAll: getAllAccountsComputationType,
    getPaginated: getPaginatedAccountsComputationType,
} = apiCrudService

export { accountsComputationTypeBaseKey }

export const {
    useCreate: useCreateAccountsComputationType,
    useUpdateById: useUpdateAccountsComputationTypeById,

    useGetAll: useGetAllAccountsComputationType,
    useGetById: useGetAccountsComputationTypeById,
    useGetPaginated: useGetPaginatedAccountsComputationType,

    useDeleteById: useDeleteAccountsComputationTypeById,
    useDeleteMany: useDeleteManyAccountsComputationType,
} = apiCrudHooks

export const logger = Logger.getInstance('accounts-computation-type')
