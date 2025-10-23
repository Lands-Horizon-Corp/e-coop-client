import { ReactNode } from 'react'

export type ExploreView = 'organizations' | 'branches' | 'map'
export type SortBy = 'recent' | 'popular' | 'name' | 'location'

export interface EmptyStateProps {
    type: string
    icon: ReactNode
}

export interface ScrollableSectionProps {
    group: any
    sectionIndex: number
    type: 'organizations' | 'branches'
}
