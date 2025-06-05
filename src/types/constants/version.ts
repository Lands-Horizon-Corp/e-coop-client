import { ReactNode } from 'react'

export enum UpdateStatus {
    FEATURE = 'feature',
    BUG = 'bug',
    GENERAL = 'general',
}

export interface SoftwareUpdates {
    name: string
    version: string
    description: string
    date: Date
    updates: Updates[]
}

export interface Updates {
    text: string
    updateStatus: UpdateStatus
    Icon?: ReactNode
}
