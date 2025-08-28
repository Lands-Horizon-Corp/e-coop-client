import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'
import { createMutationFactory } from '@/providers/repositories/mutation-factory'

import { TEntityId } from '@/types'

import type {
    IMemberContactReference,
    IMemberContactReferenceRequest,
} from './member-contact-reference.types'

// Create the base data layer factory
const { apiCrudHooks, apiCrudService } = createDataLayerFactory<
    IMemberContactReference,
    IMemberContactReferenceRequest
>({
    url: '/api/v1/member-contact-reference',
    baseKey: 'member-contact-reference',
})

// ⚙️🛠️ API SERVICE HERE
export const MemberContactReferenceAPI = apiCrudService

// Custom API for creating a member profile contact reference
export const createMemberProfileContactReference = async (
    memberProfileId: TEntityId,
    data: Omit<IMemberContactReferenceRequest, 'member_profile_id'>
) => {
    const url = `/api/v1/member-contact-reference/member-profile/${memberProfileId}`
    const response = await MemberContactReferenceAPI.API.post<
        Omit<IMemberContactReferenceRequest, 'member_profile_id'>,
        IMemberContactReference
    >(url, data)
    return response.data
}

// Custom API for updating a member profile contact reference
export const updateMemberProfileContactReference = async (
    contactReferenceId: TEntityId,
    data: Omit<IMemberContactReferenceRequest, 'member_profile_id'>
) => {
    const url = `/api/v1/member-contact-reference/${contactReferenceId}`
    const response = await MemberContactReferenceAPI.API.put<
        Omit<IMemberContactReferenceRequest, 'member_profile_id'>,
        IMemberContactReference
    >(url, data)
    return response.data
}

// Custom API for deleting a member profile contact reference
export const deleteMemberProfileContactReference = async (
    contactReferenceId: TEntityId
) => {
    const url = `/api/v1/member-contact-reference/${contactReferenceId}`
    await MemberContactReferenceAPI.API.delete(url)
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

// 🪝 Custom Hook for Creating Member Profile Contact Reference
export const useCreateMemberProfileContactReference = createMutationFactory<
    IMemberContactReference,
    Error,
    {
        memberProfileId: TEntityId
        data: Omit<IMemberContactReferenceRequest, 'member_profile_id'>
    }
>({
    mutationFn: ({ memberProfileId, data }) =>
        createMemberProfileContactReference(memberProfileId, data),
    defaultInvalidates: [],
    invalidationFn: (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.variables.memberProfileId],
        })
    },
})

// 🪝 Custom Hook for Updating Member Profile Contact Reference
export const useUpdateMemberProfileContactReference = createMutationFactory<
    IMemberContactReference,
    Error,
    {
        memberProfileId: TEntityId
        contactReferenceId: TEntityId
        data: Omit<IMemberContactReferenceRequest, 'member_profile_id'>
    }
>({
    mutationFn: ({ contactReferenceId, data }) =>
        updateMemberProfileContactReference(contactReferenceId, data),
    defaultInvalidates: [],
    invalidationFn: (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.variables.memberProfileId],
        })
    },
})

// 🪝 Custom Hook for Deleting Member Profile Contact Reference
export const useDeleteMemberProfileContactReference = createMutationFactory<
    unknown,
    Error,
    { memberProfileId: TEntityId; contactReferenceId: TEntityId }
>({
    mutationFn: ({ contactReferenceId }) =>
        deleteMemberProfileContactReference(contactReferenceId),
    defaultInvalidates: [],
    invalidationFn: (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.variables.memberProfileId],
        })
    },
})
