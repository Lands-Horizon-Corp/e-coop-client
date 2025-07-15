import { IBaseEntityMeta, TEntityId } from '../../common'

export interface ILoanTag extends IBaseEntityMeta {
    loan_transaction_id: TEntityId

    icon: string

    name: string
    description: string
}
