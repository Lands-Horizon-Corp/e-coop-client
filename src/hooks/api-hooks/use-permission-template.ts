import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import PermissionTemplateService from '@/api-service/permission-template-service'
import {
    createMutationHook,
    createMutationInvalidateFn,
    deleteMutationInvalidationFn,
    updateMutationInvalidationFn,
} from '@/factory/api-hook-factory'
import { serverRequestErrExtractor } from '@/helpers'
import { toBase64, withCatchAsync } from '@/utils'

import {
    IAPIFilteredPaginatedHook,
    IAPIHook,
    IPermissionTemplate,
    IPermissionTemplatePaginated,
    IPermissionTemplateRequest,
    IQueryProps,
    TEntityId,
} from '@/types'

export const useCreatePermissionTemplate = createMutationHook<
    IPermissionTemplate,
    string,
    IPermissionTemplateRequest
>(
    (data) => PermissionTemplateService.create(data),
    'Permission template created',
    (args) => createMutationInvalidateFn('permission-template', args)
)

export const useUpdatePermissionTemplate = createMutationHook<
    IPermissionTemplate,
    string,
    { permissionTemplateId: TEntityId; data: IPermissionTemplateRequest }
>(
    ({ permissionTemplateId, data }) =>
        PermissionTemplateService.updateById(permissionTemplateId, data),
    'Permission template updated',
    (args) => updateMutationInvalidationFn('permission-template', args)
)

export const useDeletePermissionTemplate = createMutationHook<
    void,
    string,
    TEntityId
>(
    (id) => PermissionTemplateService.deleteById(id),
    'Permission template deleted',
    (args) => deleteMutationInvalidationFn('permission-template', args)
)

export const useAllPermissionTemplates = ({
    enabled,
    showMessage,
}: IAPIHook<IPermissionTemplate[], string> & IQueryProps = {}) => {
    return useQuery<IPermissionTemplate[], string>({
        queryKey: ['permission-template', 'all'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                PermissionTemplateService.allList()
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        initialData: [],
        enabled,
        retry: 1,
    })
}

export const useFilteredPaginatedPermissionTemplate = ({
    sort,
    enabled,
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IPermissionTemplatePaginated, string> &
    IQueryProps = {}) => {
    return useQuery<IPermissionTemplatePaginated, string>({
        queryKey: [
            'permission-template',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                PermissionTemplateService.search({
                    pagination,
                    sort: sort && toBase64(sort),
                    filters: filterPayload && toBase64(filterPayload),
                })
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        initialData: {
            data: [],
            pages: [],
            totalSize: 0,
            totalPage: 1,
            ...pagination,
        },
        enabled,
        retry: 1,
    })
}
