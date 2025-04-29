import { TEntityId } from '../common'

export interface IRolesRequest {
    name: string
    description?: string
    color?: string
    apiKey: string
    readRole?: boolean
    writeRole?: boolean
    updateRole?: boolean
    deleteRole?: boolean
    readErrorDetails?: boolean
    writeErrorDetails?: boolean
    updateErrorDetails?: boolean
    deleteErrorDetails?: boolean
    readGender?: boolean
    writeGender?: boolean
    updateGender?: boolean
    deleteGender?: boolean
}

export interface IRoles {
    id: TEntityId
    name: string
    description?: string

    color?: string
    apiKey?: string
    createdAt: Date
    updatedAt: Date

    readRole?: boolean
    writeRole?: boolean
    updateRole?: boolean
    deleteRole?: boolean
    readErrorDetails?: boolean
    writeErrorDetails?: boolean
    updateErrorDetails?: boolean
    deleteErrorDetails?: boolean
    readGender?: boolean
    writeGender?: boolean
    updateGender?: boolean
    deleteGender?: boolean
}
