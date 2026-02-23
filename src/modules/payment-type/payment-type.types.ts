import {
    IAuditable,
    IPaginatedResult,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { IAccount } from '../account'
import { TPaymentTypeSchema } from './payment-type.validation'

export type PaymentTypeEnum = 'cash' | 'check' | 'online'

export interface IPaymentType extends IAuditable, ITimeStamps {
    id: TEntityId

    organization_id: TEntityId
    branch_id: TEntityId

    name: string
    description?: string
    number_of_days?: number

    account_id?: TEntityId
    account?: IAccount

    type: PaymentTypeEnum
}

export type IPaymentTypeRequest = TPaymentTypeSchema

export interface IPaymentTypePaginatedResource extends IPaginatedResult<IPaymentType> {}
