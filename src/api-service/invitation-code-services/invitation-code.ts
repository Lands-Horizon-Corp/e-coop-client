import {
    IInvitationCode,
    IInvitationCodePaginated,
    IInvitationCodeRequest,
    TEntityId,
} from '@/types'
import APIService from '../api-service'
import qs from 'query-string'

export const verifyInvitationCode = async (code: string) => {
    const response = await APIService.get<IInvitationCode>(
        `/invitation-code/verify/${code}`
    )
    return response.data
}

// GET /invitation-code/
export const getAllInvitationCode = async () => {
    const response =
        await APIService.get<IInvitationCodePaginated[]>(`/invitation-code`)
    return response.data
}

export const getPaginatedInvitationCode = async (props?: {
    sort?: string
    filters?: string
    preloads?: string[]
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const { filters, preloads, pagination, sort } = props || {}

    const url = qs.stringifyUrl(
        {
            url: `/invitation-code`,
            query: {
                sort,
                preloads,
                filter: filters,
                pageIndex: pagination?.pageIndex,
                pageSize: pagination?.pageSize,
            },
        },
        { skipNull: true }
    )

    const response = await APIService.get<IInvitationCodePaginated>(url)
    return response.data
}

// POST /invitation-code/organization/:organization_id/branch/:branch_id
export const createInvitationCode = async (
    InvitationCodeData: IInvitationCodeRequest,
    organizationId: TEntityId,
    branchId: TEntityId
) => {
    const response = await APIService.post<
        IInvitationCodeRequest,
        IInvitationCode
    >(
        `/invitation-code/organization/${organizationId}/branch/${branchId}`,
        InvitationCodeData
    )
    return response.data
}

// PUT /invitation-code/:invitation_code_id/
export const updateInvitationCode = async (
    inviationCodeId: TEntityId,
    IInvitationCodeData: IInvitationCodeRequest
) => {
    const response = await APIService.put<
        IInvitationCodeRequest,
        IInvitationCode
    >(`/invitation-code/${inviationCodeId}`, IInvitationCodeData)
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

export const deleteMany = async (ids: TEntityId[]) => {
    const endpoint = `/invitation-code/bulk-delete`
    await APIService.delete<void>(endpoint, { ids })
}
