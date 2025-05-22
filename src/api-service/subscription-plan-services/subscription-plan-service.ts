import { ISubscriptionPlan, ISubscriptionPlanRequest, TEntityId } from '@/types'
import APIService from '../api-service'

export const getALLSubscriptionPlans = async () => {
    const response =
        await APIService.get<ISubscriptionPlan[]>(`/subscription-plan`)
    return response.data
}

export const createSubscriptionPlan = async (
    subscriptionPlanData: ISubscriptionPlanRequest
) => {
    const response = await APIService.post<
        ISubscriptionPlanRequest,
        ISubscriptionPlan
    >(`/subscription-plan`, subscriptionPlanData)
    return response.data
}

export const updateSubscriptionPlan = async (
    id: string,
    subscriptionPlanData: ISubscriptionPlanRequest
) => {
    const response = await APIService.patch<
        ISubscriptionPlanRequest,
        ISubscriptionPlan
    >(`/subscription-plan/${id}`, subscriptionPlanData)
    return response.data
}
export const deleteSubscriptionPlan = async (id: TEntityId) => {
    const response = await APIService.delete(`/subscription-plan/${id}`)
    return response.data
}
export const getSubscriptionPlanById = async (id: TEntityId) => {
    const response = await APIService.get<ISubscriptionPlan>(
        `/subscription-plan/${id}`
    )
    return response.data
}
export const getSubscriptionPlanByName = async (name: string) => {
    const response = await APIService.get<ISubscriptionPlan>(
        `/subscription-plan/name/${name}`
    )
    return response.data
}
