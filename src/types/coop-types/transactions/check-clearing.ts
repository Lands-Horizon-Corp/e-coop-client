import { TEntityId } from '@/types'

export interface ICheckClearingRequest {
    checkNo: string
    bankId: TEntityId
    checkDate: string
    picture?: TEntityId
}
