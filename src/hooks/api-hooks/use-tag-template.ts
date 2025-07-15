import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import TagTemplateService from '@/api-service/tag-template-service'
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
    IQueryProps,
    ITagTemplate,
    ITagTemplatePaginated,
    ITagTemplateRequest,
    TEntityId,
} from '@/types'

export const useCreateTagTemplate = createMutationHook<
    ITagTemplate,
    string,
    ITagTemplateRequest
>(
    (data) => TagTemplateService.create(data),
    'New Tag Template Created',
    (args) => createMutationInvalidateFn('tag-template', args)
)

export const useUpdateTagTemplate = createMutationHook<
    ITagTemplate,
    string,
    { id: TEntityId; data: ITagTemplateRequest }
>(
    ({ id, data }) => TagTemplateService.updateById(id, data),
    'Tag Template Updated',
    (args) => updateMutationInvalidationFn('tag-template', args)
)

export const useDeleteTagTemplate = createMutationHook<void, string, TEntityId>(
    (id) => TagTemplateService.deleteById(id),
    'Tag Template Deleted',
    (args) => deleteMutationInvalidationFn('tag-template', args)
)

export const useDeleteManyTagTemplates = createMutationHook<
    void,
    string,
    TEntityId[]
>((ids) => TagTemplateService.deleteMany(ids), 'Tag Templates Deleted')

export const useTagTemplates = ({
    enabled,
    showMessage = true,
}: IAPIHook<ITagTemplate[], string> & IQueryProps = {}) => {
    return useQuery<ITagTemplate[], string>({
        queryKey: ['tag-template', 'all'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                TagTemplateService.allList()
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

export const useFilteredPaginatedTagTemplate = ({
    sort,
    enabled,
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<ITagTemplatePaginated, string> &
    IQueryProps = {}) => {
    return useQuery<ITagTemplatePaginated, string>({
        queryKey: [
            'tag-template',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                TagTemplateService.search({
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
