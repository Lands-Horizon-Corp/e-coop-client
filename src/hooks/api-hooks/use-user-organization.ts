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
            data: [],
            pages: [],
            totalSize: 3,
            totalPage: 1,
            ...pagination,
        },
        enabled,
        retry: 1,
    })
}
