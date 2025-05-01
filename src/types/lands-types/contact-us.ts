import { IPaginatedResult } from '../coop-types'
import { ITimeStamps, TEntityId } from '../common'

export interface IContactUs extends ITimeStamps {
    id: TEntityId

    first_name: string
    last_name?: string

    email?: string
    contact_number?: string

    description: string
}

export interface IContactUsRequest {
    first_name: string
    last_name?: string

    email?: string
    contact_number?: string

    description: string
}

export interface IContactUsPaginated extends IPaginatedResult<IContactUs> {}
