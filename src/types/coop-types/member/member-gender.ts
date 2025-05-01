import { IBranch } from '../branch'
import { ITimeStamps, TEntityId } from '../../common'

// LATEST FROM ERD
export interface IMemberGender extends ITimeStamps {
    id: TEntityId

    branch_id: TEntityId
    branch: IBranch

    name: string
    description: string
}
