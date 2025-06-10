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
        `/invitation-code/code/${code}`
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
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const { filters, pagination, sort } = props || {}

    const url = qs.stringifyUrl(
        {
            url: `/invitation-code`,
            query: {
                sort,
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

// POST /invitation-code/invitation-code-id
export const createInvitationCode = async (
    InvitationCodeData: IInvitationCodeRequest
) => {
    const response = await APIService.post<
        IInvitationCodeRequest,
        IInvitationCode
    >(`/invitation-code`, InvitationCodeData)
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

// DELETE /invitation-code/:invitation_code_id
export const deleteInvitationCode = async (inviationCodeId: TEntityId) => {
    const response = await APIService.delete<IInvitationCode>(
        ` /invitation-code/${inviationCodeId}`
    )
    return response.data
}

export const deleteMany = async (ids: TEntityId[]) => {
    const endpoint = `/invitation-code/bulk-delete`
    await APIService.delete<void>(endpoint, { ids })
}
