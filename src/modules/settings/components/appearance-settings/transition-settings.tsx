import { Fragment } from 'react'

import { toast } from 'sonner'

import { cn } from '@/helpers'
import {
    type AnimationVariant,
    useTheme,
} from '@/modules/settings/provider/theme-provider'

import { IClassProps } from '@/types'

interface AnimationPreviewProps {
    variant: AnimationVariant
    title: string
    description: string
    isSelected: boolean
    onClick: () => void
}

interface Props extends IClassProps {}

const animationConfig = {
    circle: {
        title: 'Circle',
        description: 'Smooth circular expanding transition',
        animation: 'circle-expand 2s ease-in-out infinite',
        className: 'w-16 h-16 rounded-full bg-primary/60',
    },
    'circle-blur': {
        title: 'Circle Blur',
        description: 'Circular transition with blur effect',
        animation: 'blur-pulse 2.5s ease-in-out infinite',
        className: 'w-20 h-20 rounded-full bg-primary/60',
    },
    polygon: {
        title: 'Polygon',
        description: 'Directional wipe transition effect',
        animation: 'wipe-in 2s ease-in-out infinite',
        className: 'absolute inset-y-0 w-full bg-primary/60',
    },
    gif: {
        title: 'GIF',
        description: 'Custom GIF animation transition',
        animation: 'circle-expand 2s ease-in-out infinite',
        className: 'w-16 h-16 rounded-full bg-primary/60',
    },
} as const

const AnimationPreview = ({
    variant,
    title,
    description,
    isSelected,
    onClick,
}: AnimationPreviewProps) => {
    const config = animationConfig[variant]

    return (
        <div className="space-y-1 cursor-pointer group" onClick={onClick}>
            <div
                className={cn(
                    'bg-background border rounded-xl h-32 flex items-center justify-center group-hover:border-primary ease-in-out duration-100 relative overflow-hidden',
                    isSelected && 'border-4 border-primary/80'
                )}
                tabIndex={0}
            >
                <div className="relative w-full h-full flex items-center justify-center">
                    <div className="absolute inset-0 bg-muted" />
                    <div className="relative z-10 flex items-center justify-center w-full h-full">
                        <div
                            className={config.className}
                            style={{
                                animation: config.animation,
                                ...(variant === 'polygon' && { left: '0' }),
                            }}
                        />
                        <span className="relative z-20 text-xs font-medium text-muted-foreground">
                            {title}
                        </span>
                    </div>
                </div>
            </div>
            <p className="font-medium">{title}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
        </div>
    )
}

const TransitionSettings = ({ className }: Props) => {
    const { animationVariant, setAnimationVariant } = useTheme()

    const handleVariantChange = (variant: AnimationVariant) => {
        setAnimationVariant(variant)
        toast.message(
            `Set transition to ${variant.charAt(0).toUpperCase() + variant.slice(1).replace('-', ' ')}`
        )
    }

    const displayVariants: AnimationVariant[] = [
        'circle',
        'circle-blur',
        'polygon',
    ]

    return (
        <Fragment>
            {/* Custom CSS animations */}
            <style>{`
                @keyframes circle-expand {
                    0% { transform: scale(0.2); opacity: 0.3; }
                    50% { transform: scale(1.5); opacity: 0.8; }
                    100% { transform: scale(0.2); opacity: 0.3; }
                }
                @keyframes wipe-in {
                    0% { transform: translateX(-100%); }
                    50% { transform: translateX(0%); }
                    100% { transform: translateX(100%); }
                }
                @keyframes blur-pulse {
                    0% { transform: scale(0.3); filter: blur(2px); opacity: 0.4; }
                    50% { transform: scale(1.2); filter: blur(1px); opacity: 0.8; }
                    100% { transform: scale(0.3); filter: blur(2px); opacity: 0.4; }
                }
            `}</style>

            <div
                className={cn('flex flex-col gap-y-4 flex-1 w-full', className)}
            >
                <div>
                    <p className="text-lg">Theme Transitions</p>
                    <p className="text-muted-foreground text-sm">
                        Choose animation style for theme switching
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-x-4 w-full">
                    {displayVariants.map((variant) => {
                        const config = animationConfig[variant]
                        return (
                            <AnimationPreview
                                description={config.description}
                                isSelected={animationVariant === variant}
                                key={variant}
                                onClick={() => handleVariantChange(variant)}
                                title={config.title}
                                variant={variant}
                            />
                        )
                    })}
                </div>
            </div>
        </Fragment>
    )
}

export default TransitionSettings
