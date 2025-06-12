import APIService from '../api-service'

import { TEntityId, IUserOrganization } from '@/types'

export const getUserOrganizationUserId = async (userId: TEntityId) => {
    const response = await APIService.get<IUserOrganization[]>(
        `/user-organization/user/${userId}`
    )
    return response.data
}

export const getCurrentUserOrganizations = async () => {
    const response = await APIService.get<IUserOrganization[]>(
        `/user-organization/current`
    )
    return response.data
}

export const getAllUserOrganizations = async () => {
    const response =
        await APIService.get<IUserOrganization[]>(`/user-organization`)
    return response.data
}

export const joinOrganization = async (
    organizationId: TEntityId,
    branchId: TEntityId
) => {
    const response = await APIService.post<
        IUserOrganization,
        IUserOrganization
    >(
        `/user-organization/organization/${organizationId}/branch/${branchId}/join`
    )
    return response.data
}
export const joinWithInvitationCode = async (code: string) => {
    const response = await APIService.post<
        IUserOrganization,
        IUserOrganization
    >(`/user-organization/invitation-code/${code}/join`)
    return response.data
}

export const canJoinOrganizationMember = async (
    organizationId: TEntityId,
    branchId: TEntityId
): Promise<boolean> => {
    try {
        const response = await APIService.get(
            `/user-organization/organization/${organizationId}/branch/${branchId}/can-join-employee`
        )
        return response.status === 200
    } catch {
        return false
    }
}

export const seedOrganization = async (organizationId: TEntityId) => {
    const response = await APIService.post(
        `/user-organization/${organizationId}/seed`
    )
    return response.status === 200
}

export const switchOrganization = async (userOrganizationId: TEntityId) => {
    try {
        const response = await APIService.get(
            `/user-organization/${userOrganizationId}/switch`
        )
        return response.status === 200
    } catch {
        return false
    }
}

export const getAllJoinRequests = async () => {
    const response = await APIService.get<IUserOrganization[]>(
        '/user-organization/join-request'
    )
    return response.data
}

export const acceptJoinRequest = async (userOrganizationId: TEntityId) => {
    const response = await APIService.post<void, IUserOrganization>(
        `/user-organization/${userOrganizationId}/accept`
    )
    return response.data
}

export const rejectJoinRequest = async (userOrganizationId: TEntityId) => {
    const response = await APIService.delete<IUserOrganization>(
        `/user-organization/${userOrganizationId}/reject`
    )
    return response.data
}
