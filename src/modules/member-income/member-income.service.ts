import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'
import { createMutationFactory } from '@/providers/repositories/mutation-factory'

import { TEntityId } from '@/types'

import type { IMemberIncome, IMemberIncomeRequest } from './member-income.types'

// Create the base data layer factory
const { apiCrudHooks, apiCrudService } = createDataLayerFactory<
    IMemberIncome,
    IMemberIncomeRequest
>({
    url: '/api/v1/member-income',
    baseKey: 'member-income',
})

// ⚙️🛠️ API SERVICE HERE
export const MemberIncomeAPI = apiCrudService

// Custom API for creating a member profile income
export const createMemberProfileIncome = async (
    memberProfileId: TEntityId,
    data: Omit<IMemberIncomeRequest, 'member_profile_id'>
) => {
    const url = `/api/v1/member-income/member-profile/${memberProfileId}`
    const response = await MemberIncomeAPI.API.post<
        Omit<IMemberIncomeRequest, 'member_profile_id'>,
        IMemberIncome
    >(url, data)
    return response.data
}

// Custom API for updating a member profile income
export const updateMemberProfileIncome = async (
    incomeId: TEntityId,
    data: Omit<IMemberIncomeRequest, 'member_profile_id'>
) => {
    const url = `/api/v1/member-income/${incomeId}`
    const response = await MemberIncomeAPI.API.put<
        Omit<IMemberIncomeRequest, 'member_profile_id'>,
        IMemberIncome
    >(url, data)
    return response.data
}

// Custom API for deleting a member profile income
export const deleteMemberProfileIncome = async (incomeId: TEntityId) => {
    const url = `/api/v1/member-income/${incomeId}`
    await MemberIncomeAPI.API.delete(url)
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

// 🪝 Custom Hook for Creating Member Profile Income
export const useCreateMemberProfileIncome = createMutationFactory<
    IMemberIncome,
    string,
    {
        memberProfileId: TEntityId
        data: Omit<IMemberIncomeRequest, 'member_profile_id'>
    }
>({
    mutationFn: ({ memberProfileId, data }) =>
        createMemberProfileIncome(memberProfileId, data),
    invalidationFn: (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.variables.memberProfileId],
        })
    },
})

// 🪝 Custom Hook for Updating Member Profile Income
export const useUpdateMemberProfileIncome = createMutationFactory<
    IMemberIncome,
    string,
    {
        memberProfileId: TEntityId
        incomeId: TEntityId
        data: Omit<IMemberIncomeRequest, 'member_profile_id'>
    }
>({
    mutationFn: ({ incomeId, data }) =>
        updateMemberProfileIncome(incomeId, data),
    invalidationFn: (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.variables.memberProfileId],
        })
    },
})

// 🪝 Custom Hook for Deleting Member Profile Income
export const useDeleteMemberProfileIncome = createMutationFactory<
    unknown,
    string,
    { memberProfileId: TEntityId; incomeId: TEntityId }
>({
    mutationFn: ({ incomeId }) => deleteMemberProfileIncome(incomeId),
    invalidationFn: (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.variables.memberProfileId],
        })
    },
})
