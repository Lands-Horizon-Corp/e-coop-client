import { useQuery } from '@tanstack/react-query'

import { createAPIRepository } from '@/providers/repositories/api-crud-factory'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import {
    IInvitationCode,
    IInvitationCodeRequest,
} from './invitation-code.types'

const { apiCrudHooks, apiCrudService } = createDataLayerFactory<
    IInvitationCode,
    IInvitationCodeRequest
>({
    url: '/api/v1/invitation-code',
    baseKey: 'invitation-code',
})

export const { useCreate, useUpdateById, useDeleteById, useGetPaginated } =
    apiCrudHooks
export const { deleteMany } = apiCrudService

const { API } = createAPIRepository('/api/v1/invitation-code')

// API Functions
export const verifyInvitationCode = async (code: string) => {
    const response = await API.get<IInvitationCode>(`/code/${code}`)
    return response.data
}
export const useVerifyInvitationCode = (code: string) => {
    return useQuery<IInvitationCode, Error>({
        queryKey: ['invitation-code', 'verify', code],
        queryFn: () => verifyInvitationCode(code),
        enabled: !!code,
    })
}
