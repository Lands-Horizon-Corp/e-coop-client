import {
    useQuery,
    useMutation,
    queryOptions,
    useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import { toBase64, withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'

import {
    IQueryProps,
    IAPIPreloads,
    IOperationCallbacks,
    IFilterPaginatedHookProps,
    IAPIHook,
} from './types'
import {
    TEntityId,
    IMediaRequest,
    ICompanyRequest,
    ICompanyResource,
    ICompanyPaginatedResource,
} from '@/types/coop-types'
import CompanyService from '@/api-service/company-service'

// Only used by path preloader
export const companyLoader = (
    companyId: TEntityId,
    preloads: string[] = ['Owner', 'Owner.Media', 'Media']
) =>
    queryOptions<ICompanyResource>({
        queryKey: ['company', 'loader', companyId],
        queryFn: async () => {
            const data = await CompanyService.getById(companyId, preloads)
            return data
        },
        retry: 0,
    })

// load/get company by id
export const useCompany = ({
    companyId,
    preloads = ['Media', 'Owner', 'Owner.Media'],
    showMessage,
    onError,
    onSuccess,
    ...other
}: { companyId: TEntityId } & IQueryProps<ICompanyResource> &
    IAPIHook<ICompanyResource, string>) => {
    return useQuery<ICompanyResource, string>({
        queryKey: ['company', companyId],
        queryFn: async () => {
            const [error, data] = await withCatchAsync(
                CompanyService.getById(companyId, preloads)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            onSuccess?.(data)
            return data
        },
        ...other,
    })
}

// create company
export const useCreateCompany = ({
    preloads = ['Media', 'Owner', 'Owner.Media'],
    onError,
    onSuccess,
}: IOperationCallbacks<ICompanyResource> & IAPIPreloads) => {
    const queryClient = useQueryClient()

    return useMutation<void, string, ICompanyRequest>({
        mutationKey: ['company', 'create'],
        mutationFn: async (newCompanyData) => {
            const [error, data] = await withCatchAsync(
                CompanyService.create(newCompanyData, preloads)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.setQueryData<ICompanyResource>(
                ['company', data.id],
                data
            )

            queryClient.setQueryData<ICompanyResource>(
                ['company', 'loader', data.id],
                data
            )

            toast.success('Company Created')
            onSuccess?.(data)
        },
    })
}

// approve company
export const useApproveCompany = ({
    onSuccess,
    onError,
    preloads = ['Media', 'Owner', 'Owner.Media'],
}: IOperationCallbacks<ICompanyResource, string> & IAPIPreloads) => {
    const queryClient = useQueryClient()

    return useMutation<void, string, TEntityId>({
        mutationKey: ['company', 'approve'],
        mutationFn: async (companyId) => {
            const [error, data] = await withCatchAsync(
                CompanyService.verify(companyId, preloads)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.setQueriesData<ICompanyPaginatedResource>(
                { queryKey: ['company', 'resource-query'], exact: false },
                (oldData) => {
                    if (!oldData) return oldData

                    return {
                        ...oldData,
                        data: oldData.data.map((company) =>
                            company.id === companyId ? data : company
                        ),
                    }
                }
            )

            queryClient.setQueryData<ICompanyResource>(
                ['company', companyId],
                data
            )
            queryClient.setQueryData<ICompanyResource>(
                ['company', 'loader', companyId],
                data
            )

            toast.success('Company approved')
            onSuccess?.(data)
        },
    })
}

// update company
export const useUpdateCompany = ({
    preloads = ['Owner', 'Media', 'Owner.Media'],
    onSuccess,
    onError,
}: IOperationCallbacks<ICompanyResource, string> & IAPIPreloads) => {
    const queryClient = useQueryClient()

    return useMutation<
        ICompanyResource,
        string,
        {
            id: TEntityId
            data: Omit<ICompanyResource, 'id' | 'createdAt' | 'updatedAt'>
        }
    >({
        mutationKey: ['company', 'update'],
        mutationFn: async ({ id, data }) => {
            const [error, response] = await withCatchAsync(
                CompanyService.update(id, data, preloads)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (onError) onError(errorMessage)
                else toast.error(errorMessage)
                throw errorMessage
            }

            queryClient.setQueriesData<ICompanyPaginatedResource>(
                { queryKey: ['company', 'resource-query'], exact: false },
                (oldData) => {
                    if (!oldData) return oldData

                    return {
                        ...oldData,
                        data: oldData.data.map((company) =>
                            company.id === id ? response : company
                        ),
                    }
                }
            )

            queryClient.setQueryData<ICompanyResource>(
                ['company', id],
                response
            )

            queryClient.setQueryData<ICompanyResource>(
                ['company', 'loader', id],
                response
            )

            toast.success('Company updated')

            onSuccess?.(response)
            return response
        },
    })
}

// update company logo
export const useUpdateCompanyProfilePicture = ({
    preloads = ['Owner', 'Media', 'Owner.Media'],
    onSuccess,
    onError,
}: IOperationCallbacks<ICompanyResource> & IAPIPreloads) => {
    const queryClient = useQueryClient()

    return useMutation<
        void,
        string,
        { companyId: TEntityId; mediaResource: IMediaRequest }
    >({
        mutationKey: ['company', 'update', 'logo'],
        mutationFn: async ({ companyId, mediaResource }) => {
            const [error, data] = await withCatchAsync(
                CompanyService.ProfilePicture(
                    companyId,
                    mediaResource,
                    preloads
                )
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(`Failed to update company : ${errorMessage}`)
                onError?.(errorMessage)
                throw new Error(errorMessage)
            }

            queryClient.setQueriesData<ICompanyPaginatedResource>(
                { queryKey: ['company', 'resource-query'], exact: false },
                (oldData) => {
                    if (!oldData) return oldData

                    return {
                        ...oldData,
                        data: oldData.data.map((company) =>
                            company.id === companyId ? data : company
                        ),
                    }
                }
            )

            queryClient.setQueryData<ICompanyResource>(
                ['company', companyId],
                data
            )
            queryClient.setQueryData<ICompanyResource>(
                ['company', companyId],
                data
            )

            toast.success('Company Logo Updated')
            onSuccess?.(data)
        },
    })
}

// delete company
export const useDeleteCompany = ({
    onSuccess,
    onError,
}: undefined | IOperationCallbacks<undefined> = {}) => {
    const queryClient = useQueryClient()

    return useMutation<void, string, TEntityId>({
        mutationKey: ['company', 'delete'],
        mutationFn: async (companyId) => {
            const [error] = await withCatchAsync(
                CompanyService.delete(companyId)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw new Error(errorMessage)
            }

            queryClient.invalidateQueries({
                queryKey: ['company', 'resource-query'],
            })

            queryClient.invalidateQueries({ queryKey: ['company', companyId] })
            queryClient.removeQueries({
                queryKey: ['company', 'loader', companyId],
            })

            toast.success('Company deleted')
            onSuccess?.(undefined)
        },
    })
}

export const useFilteredPaginatedCompanies = ({
    sort,
    enabled,
    filterPayload,
    preloads = ['Media', 'Owner', 'Owner.Media'],
    pagination = { pageSize: 10, pageIndex: 1 },
}: IFilterPaginatedHookProps & IQueryProps = {}) => {
    return useQuery<ICompanyPaginatedResource, string>({
        queryKey: [
            'company',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                CompanyService.getCompanies({
                    preloads,
                    pagination,
                    sort: sort && toBase64(sort),
                    filters: filterPayload && toBase64(filterPayload),
                })
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
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
