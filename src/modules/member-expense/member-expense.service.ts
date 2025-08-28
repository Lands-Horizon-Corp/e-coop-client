import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'
import { createMutationFactory } from '@/providers/repositories/mutation-factory'

import { TEntityId } from '@/types'

import type {
    IMemberExpense,
    IMemberExpenseRequest,
} from './member-expense.types'

// Create the base data layer factory
const { apiCrudHooks, apiCrudService } = createDataLayerFactory<
    IMemberExpense,
    IMemberExpenseRequest
>({
    url: '/api/v1/member-expense',
    baseKey: 'member-expense',
})

// ⚙️🛠️ API SERVICE HERE
export const MemberExpenseAPI = apiCrudService

// Custom API for creating a member profile expense
export const createMemberProfileExpense = async (
    memberProfileId: TEntityId,
    data: Omit<IMemberExpenseRequest, 'member_profile_id'>
) => {
    const url = `/api/v1/member-expense/member-profile/${memberProfileId}`
    const response = await MemberExpenseAPI.API.post<
        Omit<IMemberExpenseRequest, 'member_profile_id'>,
        IMemberExpense
    >(url, data)
    return response.data
}

// Custom API for updating a member profile expense
export const updateMemberProfileExpense = async (
    expenseId: TEntityId,
    data: Omit<IMemberExpenseRequest, 'member_profile_id'>
) => {
    const url = `/api/v1/member-expense/${expenseId}`
    const response = await MemberExpenseAPI.API.put<
        Omit<IMemberExpenseRequest, 'member_profile_id'>,
        IMemberExpense
    >(url, data)
    return response.data
}

// Custom API for deleting a member profile expense
export const deleteMemberProfileExpense = async (expenseId: TEntityId) => {
    const url = `/api/v1/member-expense/${expenseId}`
    await MemberExpenseAPI.API.delete(url)
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

// 🪝 Custom Hook for Creating Member Profile Expense
export const useCreateMemberProfileExpense = createMutationFactory<
    IMemberExpense,
    Error,
    {
        memberProfileId: TEntityId
        data: Omit<IMemberExpenseRequest, 'member_profile_id'>
    }
>({
    mutationFn: ({ memberProfileId, data }) =>
        createMemberProfileExpense(memberProfileId, data),
    invalidationFn: (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.variables.memberProfileId],
        })
    },
})

// 🪝 Custom Hook for Updating Member Profile Expense
export const useUpdateMemberProfileExpense = createMutationFactory<
    IMemberExpense,
    Error,
    {
        memberProfileId: TEntityId
        expenseId: TEntityId
        data: Omit<IMemberExpenseRequest, 'member_profile_id'>
    }
>({
    mutationFn: ({ expenseId, data }) =>
        updateMemberProfileExpense(expenseId, data),
    invalidationFn: (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.variables.memberProfileId],
        })
    },
})

// 🪝 Custom Hook for Deleting Member Profile Expense
export const useDeleteMemberProfileExpense = createMutationFactory<
    unknown,
    Error,
    { memberProfileId: TEntityId; expenseId: TEntityId }
>({
    mutationFn: ({ expenseId }) => deleteMemberProfileExpense(expenseId),
    invalidationFn: (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.variables.memberProfileId],
        })
    },
})
