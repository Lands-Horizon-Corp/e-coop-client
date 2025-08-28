import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { CheckRemittanceSchema } from './check-remittance.validation'
import { IBank } from '../bank'
import { IMedia } from '../media'
import { IUserBase } from '../user'
import { ITransactionBatch } from '../transaction-batch'

export interface ICheckRemittance extends IBaseEntityMeta {
    id: TEntityId

    bank_id: TEntityId
    bank?: IBank

    media_id: TEntityId
    media: IMedia

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

export interface ICheckRemittancePaginated extends IPaginatedResult<ICheckRemittance> {}
