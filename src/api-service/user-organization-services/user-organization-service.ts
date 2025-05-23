import { IUserOrganization, TEntityId } from '@/types'
import APIService from '../api-service'

export const getUserOrganizationUserId = async (userId: TEntityId) => {
    const response = await APIService.get<IUserOrganization[]>(
        `/user-organization/user/${userId}`
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
        `/user-organization/join/organization/${organizationId}/branch/${branchId} `
    )
    return response.data
}
export const joinWithInvitationCode = async (code: string) => {
    const response = await APIService.post<
        IUserOrganization,
        IUserOrganization
    >(`/user-organization/join/invitation-code/${code}`)
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
    const response = await APIService.get(
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
