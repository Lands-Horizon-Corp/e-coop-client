import { TEntityId } from '../common'

export interface IContact {
    id: TEntityId
    first_name: string
    last_name: string
    email: string
    description?: string
    created_at: string
    updated_at: string
}

export interface IContactRequest {
    firstName: string
    lastName: string
    email: string
    contactNumber: string
    description?: string
}
