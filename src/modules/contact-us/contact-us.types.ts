import { ITimeStamps, TEntityId } from '@/types/common'

export interface IContactUsRequest {
    id?: TEntityId
    first_name: string
    last_name?: string
    email?: string
    contact_number?: string
    description: string
}

export interface IContactUs extends ITimeStamps {
    id: TEntityId
    first_name: string
    last_name?: string
    email?: string
    contact_number?: string
    description: string
}
