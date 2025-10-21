import { IBaseEntityMeta, TEntityId } from '@/types'

import { IBank } from '../bank'
import { ICurrency } from '../currency'
import { IMedia } from '../media'
import { ITransactionBatch } from '../transaction-batch'
import { IUserBase } from '../user'
import { TOnlineRemittanceSchema } from './online-remittance.validation'

export interface IOnlineRemittance extends IBaseEntityMeta {
    id: TEntityId

    bank_id: TEntityId
    bank: IBank

    media_id: TEntityId
    user_media?: IMedia

    employee_user_id: TEntityId
    employee_user: IUserBase

    transaction_batch_id: TEntityId
    transaction_batch: ITransactionBatch

    currency_id: TEntityId
    currency: ICurrency

    reference_number: string
    account_name: string
    amount: number
    date_entry?: string
    description?: string
}

export type IOnlineRemittanceRequest = TOnlineRemittanceSchema
