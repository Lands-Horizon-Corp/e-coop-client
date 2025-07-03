import {
    IInvitationCode,
    ITransactionPaymentTypePaginated,
    TEntityId,
} from '@/types'

import APIService from './api-service'

// GET /invitation-code/
export const getAllPaymentType = async () => {
    const response =
        await APIService.get<ITransactionPaymentTypePaginated[]>(
            `/payment-type`
        )
    return response.data
}

// POST /invitation-code/organization/:organization_id/branch/:branch_id
export const createPaymentType = async (
    organizationId: TEntityId,
    branchId: TEntityId
) => {
    const response = await APIService.post<IInvitationCode>(
        `/invitation-code/organization/${organizationId}/branch/${branchId}`
    )
    return response.data
}

// PUT /invitation-code/:invitation_code_id/
export const updateInvitationCode = async (inviationCodeId: TEntityId) => {
    const response = await APIService.put<IInvitationCode>(
        `/invitation-code/${inviationCodeId}`
    )
    return response.data
}

// DELETE /invitation-code/:invitation_code_id/organization/:organization_id/branch/:branch_id
export const deleteInvitationCode = async (
    inviationCodeId: TEntityId,
    organizationId: TEntityId,
    branchId: TEntityId
) => {
    const response = await APIService.delete<IInvitationCode>(
        ` /invitation-code/${inviationCodeId}/organization/${organizationId}/branch/${branchId}`
    )
    return response.data
}
