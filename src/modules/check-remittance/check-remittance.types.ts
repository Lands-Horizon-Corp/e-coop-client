import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IBank } from '../bank'
import { ICurrency } from '../currency'
import { IMedia } from '../media'
import { ITransactionBatch } from '../transaction-batch'
import { IUserBase } from '../user'
import { CheckRemittanceSchema } from './check-remittance.validation'

export interface ICheckRemittance extends IBaseEntityMeta {
    id: TEntityId

    bank_id: TEntityId
    bank?: IBank

    media_id: TEntityId
    media: IMedia

    currency_id: TEntityId
    currency: ICurrency

    employee_user_id: TEntityId
    employee_user: IUserBase

    transaction_batch_id: TEntityId
    transaction_batch: ITransactionBatch

    country_code: string
    reference_number: string
    account_name: string
    amount: number
    date_entry?: string
    description?: string
}

export type ICheckRemittanceRequest = z.infer<typeof CheckRemittanceSchema>

export interface ICheckRemittancePaginated
    extends IPaginatedResult<ICheckRemittance> {}
