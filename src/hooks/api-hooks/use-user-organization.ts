import { BranchService } from '@/api-service/branch-services'
import { UserOrganization } from '@/api-service/user-organization-services'
import { serverRequestErrExtractor } from '@/helpers'
import { UserOrganizationGroup } from '@/routes/onboarding'
import { useAuthStore } from '@/store/user-auth-store'
import {
    IBranch,
    IOperationCallbacks,
    IUserOrganization,
    TEntityId,
} from '@/types'
import { groupBy, withCatchAsync } from '@/utils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useGetUserOrganizationByUserId = () => {
    const { currentAuth } = useAuthStore.getState()
    const userId = currentAuth?.user?.id

    return useQuery<UserOrganizationGroup[], string>({
        queryKey: ['user-organization', 'details'],
        enabled: !!userId,
        initialData: [],
        queryFn: async () => {
            if (!userId) {
                throw new Error('User ID is missing')
            }

            const [error, result] = await withCatchAsync(
                UserOrganization.getUserOrganizationUserId(userId)
            )

            if (error || !result) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                throw new Error(errorMessage)
            }

            const grouped = groupBy(result, (item) => item.organization_id)

            return Object.keys(grouped).reduce<UserOrganizationGroup[]>(
                (acc, orgKey) => {
                    const orgGroup = grouped[orgKey]
                    const firstItem = orgGroup?.[0]

                    if (!firstItem || !firstItem.organization) return acc

                    acc.push({
                        userOrganizationId: firstItem.id,
                        organizationDetails: firstItem.organization,
                        branches: orgGroup
                            .map((org) => org.branch)
                            .filter((branch): branch is IBranch => !!branch),
                        orgnizationId: firstItem.organization.id,
                        isPending: firstItem.application_status,
                    })

                    return acc
                },
                []
            )
        },
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
}: IOperationCallbacks<IUserOrganization>) => {
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
