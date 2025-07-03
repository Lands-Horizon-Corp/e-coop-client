import { IAccountsRequest, TEntityId } from '@/types'

import { ICheckClearingRequest } from './check-clearing'

/**
 * Represents the finalized shape of a payment entry for submission or storage.
 */

export enum TRANSACTION_TYPE {
    deposit = 'deposit',
    withdraw = 'withdraw',
    payment = 'payment',
}

export interface IPaymentsEntryRequest {
    ORNumber: number
    memberId: TEntityId
    amount: number
    accountsId: TEntityId
    paymentType: TEntityId
    isPrinted: boolean
    notes?: string
    type: TRANSACTION_TYPE
}

/**
 * Represents the client-side form data including the full account object.
 */
export interface IPaymentsEntry extends IPaymentsEntryRequest {
    account: IAccountsRequest
    checkClearing?: ICheckClearingRequest[]
}
