import { ReactNode } from 'react'

import Image from '@/components/image'
import ImageMatch from '@/components/image-match'

interface FeatureCardProps {
    title: string
    description: string
    icon: ReactNode
    imageSrc: string
    imageAlt: string
    useImageMatch?: boolean
}

const FeatureCard = ({
    title,
    description,
    icon,
    imageSrc,
    imageAlt,
    useImageMatch = false,
}: FeatureCardProps) => {
    return (
        <div className="bg-card overflow-hidden rounded-lg shadow-sm">
            <div className="relative h-40 w-full p-3 bg-background/40">
                {useImageMatch ? (
                    <ImageMatch
                        alt={imageAlt}
                        className="h-full w-full object-contain"
                        containerClassName="h-full w-full"
                        src={imageSrc}
                    />
                ) : (
                    <Image
                        alt={imageAlt}
                        className="h-full w-full rounded-2xl object-cover"
                        src={imageSrc}
                    />
                )}
            </div>
            <div className="p-4">
                <h3 className="text-foreground mb-2 min-h-[28px] font-bold md:mb-4">
                    {icon}
                    {title}
                </h3>
                <p className="text-muted-foreground text-sm md:text-base">
                    {description}
                </p>
            </div>
        </div>
    )
}

export default FeatureCard
