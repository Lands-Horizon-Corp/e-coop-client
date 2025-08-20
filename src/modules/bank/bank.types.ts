import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types/common'

import { IMedia } from '../media/media.types'
import { BankSchema } from './bank.validation'

export interface IBank extends IBaseEntityMeta {
    id: TEntityId
    name: string
    media_id?: TEntityId
    media?: IMedia
    description?: string
}

export type IBankRequest = z.infer<typeof BankSchema>

export interface IBankPaginated extends IPaginatedResult<IBank> {}
