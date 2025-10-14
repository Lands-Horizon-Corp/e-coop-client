import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'
import { createMutationFactory } from '@/providers/repositories/mutation-factory'

import { TEntityId } from '@/types'

import type {
    IMemberEducationalAttainment,
    IMemberEducationalAttainmentRequest,
} from './member-educational-attainment.types'

// Create the base data layer factory
const { apiCrudHooks, apiCrudService } = createDataLayerFactory<
    IMemberEducationalAttainment,
    IMemberEducationalAttainmentRequest
>({
    url: '/api/v1/member-educational-attainment',
    baseKey: 'member-educational-attainment',
})

// ⚙️🛠️ API SERVICE HERE
export const MemberEducationalAttainmentAPI = apiCrudService

// Custom API for creating educational attainment for a member
export const createEducationalAttainmentForMember = async (
    memberProfileId: TEntityId,
    data: Omit<IMemberEducationalAttainmentRequest, 'member_profile_id'>
) => {
    const url = `/api/v1/member-educational-attainment/member-profile/${memberProfileId}`
    const response = await MemberEducationalAttainmentAPI.API.post<
        Omit<IMemberEducationalAttainmentRequest, 'member_profile_id'>,
        IMemberEducationalAttainment
    >(url, data)
    return response.data
}

// Custom API for updating educational attainment for a member
export const updateEducationalAttainmentForMember = async (
    educationalAttainmentId: TEntityId,
    data: Omit<IMemberEducationalAttainmentRequest, 'member_profile_id'>
) => {
    const url = `/api/v1/member-educational-attainment/${educationalAttainmentId}`
    const response = await MemberEducationalAttainmentAPI.API.put<
        Omit<IMemberEducationalAttainmentRequest, 'member_profile_id'>,
        IMemberEducationalAttainment
    >(url, data)
    return response.data
}

// Custom API for deleting educational attainment for a member
export const deleteEducationalAttainmentForMember = async (
    educationalAttainmentId: TEntityId
) => {
    const url = `/api/v1/member-educational-attainment/${educationalAttainmentId}`
    await MemberEducationalAttainmentAPI.API.delete(url)
}

// 🪝 HOOKS START HERE
export const {
    useCreate,
    useDeleteById,
    useDeleteMany,
    useGetAll,
    useGetById,
    useGetPaginated,
    useUpdateById,
} = apiCrudHooks

// 🪝 Custom Hook for Creating Educational Attainment
export const useCreateEducationalAttainmentForMember = createMutationFactory<
    IMemberEducationalAttainment,
    string,
    {
        memberProfileId: TEntityId
        data: Omit<IMemberEducationalAttainmentRequest, 'member_profile_id'>
    }
>({
    mutationFn: ({ memberProfileId, data }) =>
        createEducationalAttainmentForMember(memberProfileId, data),
    defaultInvalidates: [],
    invalidationFn: (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.variables.memberProfileId],
        })
    },
})

// 🪝 Custom Hook for Updating Educational Attainment
export const useUpdateEducationalAttainmentForMember = createMutationFactory<
    IMemberEducationalAttainment,
    string,
    {
        memberProfileId: TEntityId
        educationalAttainmentId: TEntityId
        data: Omit<IMemberEducationalAttainmentRequest, 'member_profile_id'>
    }
>({
    mutationFn: ({ educationalAttainmentId, data }) =>
        updateEducationalAttainmentForMember(educationalAttainmentId, data),
    invalidationFn: (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.variables.memberProfileId],
        })
    },
})

// 🪝 Custom Hook for Deleting Educational Attainment
export const useDeleteEducationalAttainment = createMutationFactory<
    void,
    string,
    { memberProfileId: TEntityId; educationalAttainmentId: TEntityId }
>({
    mutationFn: ({ educationalAttainmentId }) =>
        deleteEducationalAttainmentForMember(educationalAttainmentId),
    invalidationFn: (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.variables.memberProfileId],
        })
    },
})

export const logger = Logger.getInstance('member-educational-attainment')
