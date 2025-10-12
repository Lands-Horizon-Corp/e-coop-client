export interface ILandsTeamMember {
    name: string
    image: string
    position: string
    description: string
    linkedInUrl?: string
    instagramUrl?: string
    facebookUrl?: string
}

export interface IFeatureItem {
    icon: string
    title: string
    alt: string
    description: string
}

export interface IFeatureCardData {
    id: string
    title: string
    description: string
    icon: React.ReactNode
    imageSrc: string
    imageAlt: string
    useImageMatch: boolean
}

// Utility types for better type inference
export type FeatureItemKey = keyof IFeatureItem
export type FeatureCardDataKey = keyof IFeatureCardData
export type LandsTeamMemberKey = keyof ILandsTeamMember
