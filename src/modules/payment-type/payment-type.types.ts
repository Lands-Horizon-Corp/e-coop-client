import { IAuditable, IPaginatedResult, ITimeStamps, TEntityId } from '../common'

export type PaymentTypeEnum = 'cash' | 'check' | 'online'

export interface IPaymentType extends IAuditable, ITimeStamps {
    id: TEntityId

    organization_id: TEntityId
    branch_id: TEntityId

    name: string
    description?: string
    number_of_days?: number

    type: PaymentTypeEnum
}

export interface IPaymentTypeRequest {
    name: string
    description?: string
    number_of_days?: number

    type: PaymentTypeEnum

    organization_id?: TEntityId
    branch_id?: TEntityId
}

export interface IPaymentTypePaginatedResource
    extends IPaginatedResult<IPaymentType> {}
