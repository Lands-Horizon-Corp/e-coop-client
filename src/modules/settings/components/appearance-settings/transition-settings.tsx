import { Fragment } from 'react'

import { toast } from 'sonner'

import { cn } from '@/helpers'
import { useTheme } from '@/modules/settings/provider/theme-provider'

import { IClassProps } from '@/types'

interface Props extends IClassProps {}

const TransitionSettings = ({ className }: Props) => {
    const { animationVariant, setAnimationVariant } = useTheme()

    const handleVariantChange = (variant: typeof animationVariant) => {
        setAnimationVariant(variant)
        toast.message(
            `Set transition to ${variant.charAt(0).toUpperCase() + variant.slice(1).replace('-', ' ')}`
        )
    }

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
                    {/* Circle Transition */}
                    <div
                        className="space-y-1 cursor-pointer group"
                        onClick={() => handleVariantChange('circle')}
                    >
                        <div
                            tabIndex={0}
                            className={cn(
                                'bg-background border rounded-xl h-32 flex items-center justify-center group-hover:border-primary ease-in-out duration-100 relative overflow-hidden',
                                animationVariant === 'circle' &&
                                    'border-4 border-primary/80'
                            )}
                        >
                            <div className="relative w-full h-full flex items-center justify-center">
                                {/* Background */}
                                <div className="absolute inset-0 bg-muted" />
                                {/* Circle animation */}
                                <div className="relative z-10 flex items-center justify-center w-full h-full">
                                    <div
                                        className="absolute w-16 h-16 rounded-full bg-primary/60"
                                        style={{
                                            animation:
                                                'circle-expand 2s ease-in-out infinite',
                                        }}
                                    />
                                    <span className="relative z-20 text-xs font-medium text-muted-foreground">
                                        Circle
                                    </span>
                                </div>
                            </div>
                        </div>
                        <p>Circle</p>
                        <p className="text-xs text-muted-foreground">
                            Smooth circular expanding transition
                        </p>
                    </div>

                    {/* Circle Blur Transition */}
                    <div
                        className="space-y-1 cursor-pointer group"
                        onClick={() => handleVariantChange('circle-blur')}
                    >
                        <div
                            tabIndex={0}
                            className={cn(
                                'bg-background border rounded-xl h-32 flex items-center justify-center group-hover:border-primary ease-in-out duration-100 relative overflow-hidden',
                                animationVariant === 'circle-blur' &&
                                    'border-4 border-primary/80'
                            )}
                        >
                            <div className="relative w-full h-full flex items-center justify-center">
                                {/* Background */}
                                <div className="absolute inset-0 bg-muted" />
                                {/* Circle blur animation */}
                                <div className="relative z-10 flex items-center justify-center w-full h-full">
                                    <div
                                        className="absolute w-20 h-20 rounded-full bg-primary/60"
                                        style={{
                                            animation:
                                                'blur-pulse 2.5s ease-in-out infinite',
                                        }}
                                    />
                                    <span className="relative z-20 text-xs font-medium text-muted-foreground">
                                        Blur
                                    </span>
                                </div>
                            </div>
                        </div>
                        <p>Circle Blur</p>
                        <p className="text-xs text-muted-foreground">
                            Circular transition with blur effect
                        </p>
                    </div>

                    {/* Polygon Transition */}
                    <div
                        className="space-y-1 cursor-pointer group"
                        onClick={() => handleVariantChange('polygon')}
                    >
                        <div
                            tabIndex={0}
                            className={cn(
                                'bg-background border rounded-xl h-32 flex items-center justify-center group-hover:border-primary ease-in-out duration-100 relative overflow-hidden',
                                animationVariant === 'polygon' &&
                                    'border-4 border-primary/80'
                            )}
                        >
                            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                                {/* Background */}
                                <div className="absolute inset-0 bg-muted" />
                                {/* Wipe animation */}
                                <div className="relative z-10 flex items-center justify-center w-full h-full">
                                    <div
                                        className="absolute inset-y-0 w-full bg-primary/60"
                                        style={{
                                            animation:
                                                'wipe-in 2s ease-in-out infinite',
                                            left: '0',
                                        }}
                                    />
                                    <span className="relative z-20 text-xs font-medium text-muted-foreground">
                                        Wipe
                                    </span>
                                </div>
                            </div>
                        </div>
                        <p>Polygon</p>
                        <p className="text-xs text-muted-foreground">
                            Directional wipe transition effect
                        </p>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default TransitionSettings
