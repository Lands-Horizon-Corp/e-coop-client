import { ITimeStamps, TEntityId } from '@/types'

export interface ICategory extends ITimeStamps {
    id: TEntityId
    name: string
    description?: string
}
