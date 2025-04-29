import { ITimeStamps, TEntityId } from '../../common'
import { IMemberGenderHistory } from './member-gender-history'

export interface IMemberGender extends ITimeStamps {
    id: TEntityId
    name: string
    description: string
    history?: IMemberGenderHistory[]
}
