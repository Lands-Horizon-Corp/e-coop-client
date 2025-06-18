import { toast } from 'sonner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { groupBy, toBase64, withCatchAsync } from '@/utils'
import { createMutationHook } from './api-hook-factory'
import { BranchService } from '@/api-service/branch-services'
import { isArray, serverRequestErrExtractor } from '@/helpers'
import { UserOrganization } from '@/api-service/user-organization-services'
import * as UserOrganizationService from '@/api-service/user-organization-service'

import {
    IBranch,
    TEntityId,
    IQueryProps,
    IUserOrganization,
    IOperationCallbacks,
    IOrgUserOrganizationGroup,
    IMutationProps,
    IAPIFilteredPaginatedHook,
    IEmployee,
    IOwner,
    IMember,
    IUserOrganizationPaginated,
    IUserBase,
} from '@/types'

export const useGetUserOrganizationByUserId = (id: TEntityId) => {
    return useQuery<IOrgUserOrganizationGroup[], string>({
        queryKey: ['user-organization', id],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                UserOrganization.getUserOrganizationUserId(id)
            )

            if (error || !result) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                throw new Error(errorMessage)
            }

            const grouped = groupBy(result, (item) => item.organization_id)

            return Object.keys(grouped).reduce<IOrgUserOrganizationGroup[]>(
                (acc, orgKey) => {
                    const userOrgs = grouped[orgKey]
                    const userOrganization = userOrgs?.[0]

                    acc.push({
                        ...userOrganization.organization,
                        user_organizations: userOrgs,
                    })

                    return acc
                },
                []
            )
        },
        initialData: [],
    })
}

export const useGetCurrentUserOrganizations = () => {
    return useQuery<IOrgUserOrganizationGroup[], string>({
        queryKey: ['user-organization', 'current'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                UserOrganization.getCurrentUserOrganizations()
            )

            if (error || !result) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                throw new Error(errorMessage)
            }

            const grouped = groupBy(result, (item) => item.organization_id)

            return Object.keys(grouped).reduce<IOrgUserOrganizationGroup[]>(
                (acc, orgKey) => {
                    const userOrgs = grouped[orgKey]
                    const userOrganization = userOrgs?.[0]

                    acc.push({
                        ...userOrganization.organization,
                        user_organizations: userOrgs,
                    })

                    return acc
                },
                []
            )
        },
        initialData: [],
    })
}

export const useJoinOrganization = ({
    onSuccess,
    onError,
}: IOperationCallbacks<IUserOrganization>) => {
    const queryClient = useQueryClient()
    return useMutation<
        IUserOrganization,
        string,
        {
            organizationId: TEntityId
            branchId: TEntityId
        }
    >({
        mutationKey: ['user-organization', 'join'],
        mutationFn: async ({
            organizationId,
            branchId,
        }: {
            organizationId: TEntityId
            branchId: TEntityId
        }) => {
            const [error, result] = await withCatchAsync(
                UserOrganization.joinOrganization(organizationId, branchId)
            )
            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }
            queryClient.invalidateQueries({
                queryKey: ['user-organization', 'details'],
            })
            onSuccess?.(result)
            return result
        },
    })
}

export const useJoinWithCode = ({
    onSuccess,
    onError,
    showMessage = false,
}: IOperationCallbacks<IUserOrganization> & IMutationProps) => {
    const queryClient = useQueryClient()
    return useMutation<IUserOrganization, string, string>({
        mutationKey: ['join-with-code'],
        mutationFn: async (code) => {
            const [error, result] = await withCatchAsync(
                UserOrganization.joinWithInvitationCode(code)
            )
            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                onError?.(errorMessage)
                if (showMessage) toast.error('Failed to Join: ' + errorMessage)
                throw errorMessage
            }
            queryClient.invalidateQueries({
                queryKey: ['user-organization', 'details'],
            })
            if (showMessage)
                toast.success(
                    `Successfully Joined on ${result.branch?.name} Branch`
                )
            onSuccess?.(result)
            return result
        },
    })
}

export const useCanJoinMember = (organizationId: TEntityId) => {
    return useQuery<{ branch: IBranch; isUserCanJoin: boolean }[], string>({
        queryKey: ['user-organization', 'can-join-member', organizationId],
        enabled: !!organizationId,
        queryFn: async () => {
            const branches =
                await BranchService.getBranchesByOrganizationId(organizationId)

            const [error, results] = await withCatchAsync(
                Promise.all(
                    branches.map(async (branch) => {
                        const isUserCanJoin =
                            await UserOrganization.canJoinOrganizationMember(
                                organizationId,
                                branch.id
                            )
                        return { branch, isUserCanJoin }
                    })
                )
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                throw errorMessage
            }

            return results
        },
    })
}

export const useSwitchOrganization = () => {
    return useMutation<boolean, string, TEntityId>({
        mutationKey: ['user-organization', 'join'],
        mutationFn: async (userOrganizationId) => {
            const [error, result] = await withCatchAsync(
                UserOrganization.switchOrganization(userOrganizationId)
            )
            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                throw errorMessage
            }
            return result
        },
    })
}

export const useSeedOrganization = () => {
    const queryClient = useQueryClient()

    return useMutation<unknown, string, TEntityId>({
        mutationKey: ['seed-user-organization', 'seed'],
        mutationFn: async (userOrganizationId) => {
            const [error, result] = await withCatchAsync(
                UserOrganization.seedOrganization(userOrganizationId)
            )
            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                throw errorMessage
            }
            queryClient.invalidateQueries({
                queryKey: ['user-organization', 'details'],
            })
            return result
        },
    })
}

export const useUserOrgJoinRequests = ({
    showMessage,
    onSuccess,
    onError,
    ...others
}: IOperationCallbacks<IUserOrganization[]> &
    IQueryProps<IUserOrganization[]> = {}) => {
    return useQuery<IUserOrganization[], string>({
        queryKey: ['user-organization', 'join-request', 'all'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                UserOrganization.getAllJoinRequests()
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage, error)
                throw errorMessage
            }

            onSuccess?.(result)
            return isArray(result) ? result : []
        },
        retry: 1,
        ...others,
        initialData: others.initialData ?? [],
    })
}

export const useUserOrgAcceptJoinRequest = createMutationHook<
    IUserOrganization,
    string,
    TEntityId
>((id) => UserOrganization.acceptJoinRequest(id), 'join request accepted')

export const useUserOrgRejectJoinRequest = createMutationHook<
    IUserOrganization,
    string,
    TEntityId
>((id) => UserOrganization.rejectJoinRequest(id), 'Join request rejected.')

export const useFilteredPaginatedUserOrganization = <
    T = IUserBase | IEmployee | IOwner | IMember,
>({
    sort,
    enabled,
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IUserOrganization, string> & IQueryProps = {}) => {
    return useQuery<IUserOrganizationPaginated<T>, string>({
        queryKey: [
            'user-organization',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                UserOrganizationService.getPaginatedUserOrg<T>({
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
            data: [
                {
                    id: '11111111-1111-1111-1111-111111111111',
                    organization_id: '22222222-2222-2222-2222-222222222222',
                    organization: {
                        id: '22222222-2222-2222-2222-222222222222',
                        name: 'Mock Organization 1',
                        // ...other organization fields
                    },
                    branch_id: '33333333-3333-3333-3333-333333333333',
                    branch: {
                        id: '33333333-3333-3333-3333-333333333333',
                        name: 'Main Branch',
                        // ...other branch fields
                    },
                    description: 'Mock user organization 1',
                    user_id: '44444444-4444-4444-4444-444444444444',
                    user: {
                        id: '44444444-4444-4444-4444-444444444444',
                        full_name: 'Alice Example',
                        email: 'alice@example.com',
                        user_name: 'alice',
                        // ...other user fields
                    },
                    user_type: 'employee',
                    application_description: 'First mock application',
                    application_status: 'accepted',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    deleted_at: null,
                    created_by: null,
                    updated_by: null,
                    deleted_by: null,
                },
                {
                    id: '55555555-5555-5555-5555-555555555555',
                    organization_id: '66666666-6666-6666-6666-666666666666',
                    organization: {
                        id: '66666666-6666-6666-6666-666666666666',
                        name: 'Mock Organization 2',
                        // ...other organization fields
                    },
                    branch_id: '77777777-7777-7777-7777-777777777777',
                    branch: {
                        id: '77777777-7777-7777-7777-777777777777',
                        name: 'Branch 2',
                        // ...other branch fields
                    },
                    description: 'Mock user organization 2',
                    user_id: '88888888-8888-8888-8888-888888888888',
                    user: {
                        id: '88888888-8888-8888-8888-888888888888',
                        full_name: 'Bob Example',
                        email: 'bob@example.com',
                        user_name: 'bob',
                        // ...other user fields
                    },
                    user_type: 'member',
                    application_description: 'Second mock application',
                    application_status: 'pending',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    deleted_at: null,
                    created_by: null,
                    updated_by: null,
                    deleted_by: null,
                },
                {
                    id: '99999999-9999-9999-9999-999999999999',
                    organization_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
                    organization: {
                        id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
                        name: 'Mock Organization 3',
                        // ...other organization fields
                    },
                    branch_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
                    branch: {
                        id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
                        name: 'Branch 3',
                        // ...other branch fields
                    },
                    description: 'Mock user organization 3',
                    user_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
                    user: {
                        id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
                        full_name: 'Charlie Example',
                        email: 'charlie@example.com',
                        user_name: 'charlie',
                        // ...other user fields
                    },
                    user_type: 'owner',
                    application_description: 'Third mock application',
                    application_status: 'reported',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    deleted_at: null,
                    created_by: null,
                    updated_by: null,
                    deleted_by: null,
                },
            ] as unknown as IUserOrganization<T>[],
            pages: [],
            totalSize: 3,
            totalPage: 1,
            ...pagination,
        },
        enabled,
        retry: 1,
    })
}
