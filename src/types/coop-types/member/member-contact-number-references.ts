import { ITimeStamps, TEntityId } from '../../common'

export interface IMemberContactNumberReferencesRequest {
    id?: TEntityId
    name: string
    description: string
    contactNumber: string
}

export interface IMemberContactNumberReferences extends ITimeStamps {
    id: TEntityId
    name: string
    description: string
    contactNumber: string
}
