import { IAuditable, ITimeStamps, TEntityId } from '../../common'

export interface IMemberAccountingLedger extends ITimeStamps, IAuditable {
    id: TEntityId

    member_profile_id: TEntityId
    account_id: TEntityId

    count: number
    balance: number
    interest: number
    fines: number
    due: number

    carried_forward_due: number
    stored_value_facility: number
    principal_due: number
    last_pay?: string | null
}
