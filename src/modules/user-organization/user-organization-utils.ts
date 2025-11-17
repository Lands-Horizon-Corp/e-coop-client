import { useAuthStore } from '../authentication/authgentication.store'

export const getTimeMachineValue = () => {
    return (
        useAuthStore.getState().currentAuth.user_organization
            ?.time_machine_time || new Date()
    )
}
