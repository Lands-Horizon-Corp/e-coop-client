import { ITimeStamps, TEntityId } from '../common'

export interface IMemberContactNumberReferencesRequest {
    id?: TEntityId
    name: string
    description: string
    contactNumber: string
}

export interface IMemberContactNumberReferencesResource extends ITimeStamps {
    id: TEntityId
    name: string
    description: string
    contactNumber: string
}
