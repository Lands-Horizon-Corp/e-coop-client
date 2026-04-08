import z from 'zod'

import {
    IBaseEntityMeta,
    IPaginatedResult,
    ITimeStamps,
    TEntityId,
} from '@/types'

import { IMedia } from '../media'
import { AreaSchema } from './area.validation'

export interface IArea extends IBaseEntityMeta {
    media_id: TEntityId
    media: IMedia
    name: string
    latitude: number
    longitude: number
}

export type TPositions = Pick<ITimeStamps, 'updated_at'> & {
    longitude: number
    latitude: number
}

export type TUserLocation = {
    id: TEntityId
    media: IMedia
    full_name: string
    longitude: number
    latitute: number
    last_update_datetime: string
    positions: TPositions[]
}

export type IAreaRequest = z.infer<typeof AreaSchema>

export interface IAreaPaginated extends IPaginatedResult<IArea> {}
