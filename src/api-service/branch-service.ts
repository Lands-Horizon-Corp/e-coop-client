import { IBranch, IBranchRequest, IUserOrganization, TEntityId } from '@/types'

import APIService from './api-service'

export const createBranchByOrgId = async (
    branchData: IBranchRequest,
    organizationId: TEntityId
) => {
    const response = await APIService.post<IBranchRequest, IBranch>(
        `/api/v1/branch/organization/${organizationId}`,
        branchData
    )
    return response.data
}

export const getAllBranches = async () => {
    const response = await APIService.get<IBranch[]>(`/api/v1/branch`)
    return response.data
}
export const deleteBranch = async (branchId: TEntityId) => {
    const response = await APIService.delete(`/api/v1/branch/${branchId}`)
    return response.data
}
export const updateBranch = async (
    branchId: TEntityId,
    branchData: IBranchRequest
) => {
    const response = await APIService.put<IBranchRequest, IBranch>(
        `/api/v1/branch/${branchId}`,
        branchData
    )
    return response.data
}

export const getBranchesById = async (id: TEntityId) => {
    const response = await APIService.get<IBranch>(`/api/v1/branch/${id}`)
    return response.data
}

export const getBranchesByOrganizationId = async (
    organizationId: TEntityId
) => {
    const response = await APIService.get<IBranch[]>(
        `/api/v1/branch/organization/${organizationId}`
    )
    return response.data
}

//GET branch/organization/:organization_id
export const postBranchByOrganizationId = async (
    userOrganizationId: TEntityId
) => {
    const response = await APIService.post<
        IUserOrganization,
        IUserOrganization
    >(`/api/v1/branch/user-organization/${userOrganizationId}`)
    return response.data
}

const BranchService = {
    createBranchByOrgId,
    getAllBranches,
    deleteBranch,
    updateBranch,
    getBranchesById,
    getBranchesByOrganizationId,
    postBranchByOrganizationId,
}

export default BranchService
