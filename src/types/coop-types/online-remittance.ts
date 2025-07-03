import { IUserBase } from '../auth'
import { IBaseEntityMeta, TEntityId } from '../common'
import { IBank } from './bank'
import { IMedia } from './media'
import { ITransactionBatch } from './transaction-batch'

export interface IOnlineRemitance extends IBaseEntityMeta {
    id: TEntityId

    bank_id: TEntityId
    bank: IBank

    media_id: TEntityId
    user_media?: IMedia

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

export interface IOnlineRemitanceRequest {
    id?: TEntityId

    bank_id: TEntityId
    media_id?: TEntityId
    transaction_batch_id?: TEntityId // IDK IF SERVER AUTO PLACE THIS IN BACKEND

    employee_user_id?: TEntityId
    organization_id?: TEntityId
    branch_id?: TEntityId

    country_code: string
    reference_number: string
    account_name: string
    amount: number
    date_entry?: string
    description?: string
}
