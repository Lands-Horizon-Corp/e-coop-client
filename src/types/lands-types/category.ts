import { ITimeStamps, TEntityId } from '../common'

export interface ICategory extends ITimeStamps {
    id: TEntityId
    name: string
    description?: string
}
