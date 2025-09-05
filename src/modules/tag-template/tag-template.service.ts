import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type { ITagTemplate, ITagTemplateRequest } from '../tag-template'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: tagTemplateBaseKey,
} = createDataLayerFactory<ITagTemplate, ITagTemplateRequest>({
    url: '/api/v1/tag-template',
    baseKey: 'tag-template',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: tagTemplateAPIRoute, // matches url above

    create: createTagTemplate,
    updateById: updateTagTemplateById,

    deleteById: deleteTagTemplateById,
    deleteMany: deleteManyTagTemplate,

    getById: getTagTemplateById,
    getAll: getAllTagTemplate,
    getPaginated: getPaginatedTagTemplate,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { tagTemplateBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateTagTemplate,
    useUpdateById: useUpdateTagTemplateById,

    useGetAll: useGetAllTagTemplate,
    useGetById: useGetTagTemplateById,
    useGetPaginated: useGetPaginatedTagTemplate,

    useDeleteById: useDeleteTagTemplateById,
    useDeleteMany: useDeleteManyTagTemplate,
} = apiCrudHooks

// custom hooks can go here
