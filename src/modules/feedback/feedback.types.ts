import { ReactNode } from 'react'

import { ITimeStamps, TEntityId } from '@/types/common'

import { IMedia } from '../media/media.types'

export interface IFeedbackRequest {
    id?: TEntityId | null
    email: string
    description: string
    feedback_type: 'general' | 'bug' | 'feature'
    media_id?: TEntityId | null
}

export interface IFeedback extends ITimeStamps {
    id: TEntityId
    email: string
    description: string
    feedback_type: 'general' | 'bug' | 'feature'
    media_id?: TEntityId
    media?: IMedia
}

export type TSoftwareUpdateEntryStatus = 'general' | 'bug' | 'feature'

export interface SoftwareUpdates {
    name: string
    version: string
    description: string
    date: Date
    updates: SoftwareUpdateEntry[]
}

export interface SoftwareUpdateEntry {
    text: string
    updateStatus: TSoftwareUpdateEntryStatus
    Icon?: ReactNode
}
