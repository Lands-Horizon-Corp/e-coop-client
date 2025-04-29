import { ITimeStamps, TEntityId } from '../common'
import { IMemberGenderHistoryResource } from './member-gender-history'

export interface IMemberGenderResource extends ITimeStamps {
    id: TEntityId
    name: string
    description: string
    history?: IMemberGenderHistoryResource[]
}
