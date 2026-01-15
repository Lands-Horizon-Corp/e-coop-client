import { useQuery } from '@tanstack/react-query'

import { Logger } from '@/helpers/loggers'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'
import { createMutationFactory } from '@/providers/repositories/mutation-factory'

import { TAPIQueryOptions, TEntityId } from '@/types'

import type {
    IGovernmentId,
    IMemberGovernmentBenefit,
    IMemberGovernmentBenefitRequest,
} from './member-government-benefit.types'

// Create the base data layer factory
const { apiCrudHooks, apiCrudService } = createDataLayerFactory<
    IMemberGovernmentBenefit,
    IMemberGovernmentBenefitRequest
>({
    url: '/api/v1/member-government-benefit',
    baseKey: 'member-government-benefit',
})

// ⚙️🛠️ API SERVICE HERE
export const MemberGovernmentBenefitAPI = apiCrudService

export const { API, getAll } = MemberGovernmentBenefitAPI

// Custom API for creating a government benefit for a member
export const createMemberGovernmentBenefit = async (
    memberProfileId: TEntityId,
    data: Omit<
        IMemberGovernmentBenefitRequest,
        'member_profile_id' | 'branch_id' | 'organization_id'
    >
) => {
    const url = `/api/v1/member-government-benefit/member-profile/${memberProfileId}`
    const response = await MemberGovernmentBenefitAPI.API.post<
        Omit<
            IMemberGovernmentBenefitRequest,
            'member_profile_id' | 'branch_id' | 'organization_id'
        >,
        IMemberGovernmentBenefit
    >(url, data)
    return response.data
}

// Custom API for updating a government benefit for a member
export const updateMemberGovernmentBenefit = async (
    benefitId: TEntityId,
    data: Omit<
        IMemberGovernmentBenefitRequest,
        'member_profile_id' | 'branch_id' | 'organization_id'
    >
) => {
    const url = `/api/v1/member-government-benefit/${benefitId}`
    const response = await MemberGovernmentBenefitAPI.API.put<
        Omit<
            IMemberGovernmentBenefitRequest,
            'member_profile_id' | 'branch_id' | 'organization_id'
        >,
        IMemberGovernmentBenefit
    >(url, data)
    return response.data
}

// Custom API for deleting a government benefit for a member
export const deleteMemberGovernmentBenefit = async (benefitId: TEntityId) => {
    const url = `/api/v1/member-government-benefit/${benefitId}`
    await MemberGovernmentBenefitAPI.API.delete(url)
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

// 🪝 Custom Hook for Creating Government Benefit
export const useCreateMemberGovernmentBenefit = createMutationFactory<
    IMemberGovernmentBenefit,
    Error,
    {
        memberProfileId: TEntityId
        data: Omit<
            IMemberGovernmentBenefitRequest,
            'member_profile_id' | 'branch_id' | 'organization_id'
        >
    }
>({
    mutationFn: ({ memberProfileId, data }) =>
        createMemberGovernmentBenefit(memberProfileId, data),
    invalidationFn: (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.variables.memberProfileId],
        })
    },
})

// 🪝 Custom Hook for Updating Government Benefit
export const useUpdateMemberGovernmentBenefit = createMutationFactory<
    IMemberGovernmentBenefit,
    Error,
    {
        memberProfileId: TEntityId
        benefitId: TEntityId
        data: Omit<
            IMemberGovernmentBenefitRequest,
            'member_profile_id' | 'branch_id' | 'organization_id'
        >
    }
>({
    mutationFn: ({ benefitId, data }) =>
        updateMemberGovernmentBenefit(benefitId, data),
    invalidationFn: (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.variables.memberProfileId],
        })
    },
})

// 🪝 Custom Hook for Deleting Government Benefit
export const useDeleteMemberGovernmentBenefit = createMutationFactory<
    unknown,
    Error,
    { memberProfileId: TEntityId; benefitId: TEntityId }
>({
    mutationFn: ({ benefitId }) => deleteMemberGovernmentBenefit(benefitId),
    invalidationFn: (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.variables.memberProfileId],
        })
    },
})

export const governmentIdBaseKey = 'government-ids'
export const governmentIdAPIRoute = '/api/v1/government-ids'

export const useGetAllGovernmentIds = ({
    isoAlpha3,
    query,
    options,
}: {
    isoAlpha3: string
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IGovernmentId[], Error>
}) => {
    return useQuery<IGovernmentId[], Error>({
        ...options,
        queryKey: [governmentIdBaseKey, 'all', isoAlpha3, query].filter(
            Boolean
        ),
        queryFn: async () =>
            await getAll<IGovernmentId>({
                url: `${governmentIdAPIRoute}/${isoAlpha3}`,
                query,
            }),
    })
}

export const logger = Logger.getInstance('member-government-benefit')
