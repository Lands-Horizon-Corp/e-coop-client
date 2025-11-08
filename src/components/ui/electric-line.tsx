import { cn } from '@/helpers'

interface ElectricLineProps {
    className?: string
    length?: number
    thickness?: number
    flowSpeed?: number
    flowColor?: string
    lineColor?: string
    glowIntensity?: 'low' | 'medium' | 'high'
}

export const ElectricLine = ({
    className,
    length = 100,
    thickness = 2,
    flowSpeed = 2,
}: ElectricLineProps) => {
    return (
        <div className={cn('relative text-primary', className)}>
            <svg
                className="overflow-visible"
                height={thickness + 10}
                viewBox={`0 0 ${length} ${thickness + 10}`}
                width={length}
            >
                {/* Main line - uses current text color with reduced opacity */}
                <line
                    className="opacity-60 stroke-current"
                    strokeOpacity={0.3}
                    strokeWidth={thickness}
                    x1="0"
                    x2={length}
                    y1={thickness / 2 + 5}
                    y2={thickness / 2 + 5}
                />

                {/* Electric flow - uses current text color */}
                <line
                    className="animate-electric-flow stroke-current opacity-90 dark:opacity-100"
                    strokeDasharray="8 12"
                    strokeWidth={thickness}
                    style={{
                        animationDuration: `${flowSpeed}s`,
                    }}
                    x1="0"
                    x2={length}
                    y1={thickness / 2 + 5}
                    y2={thickness / 2 + 5}
                />

                {/* Reduced glow for the flow - uses current text color */}
                <line
                    className="animate-electric-flow stroke-current opacity-20"
                    filter="blur(1px)"
                    strokeDasharray="8 12"
                    strokeWidth={thickness + 1}
                    style={{
                        animationDuration: `${flowSpeed}s`,
                    }}
                    x1="0"
                    x2={length}
                    y1={thickness / 2 + 5}
                    y2={thickness / 2 + 5}
                />

                {/* Flow particles - uses current text color */}
                <circle
                    className="animate-electric-particle fill-current opacity-100"
                    r="2"
                    style={{
                        animationDuration: `${flowSpeed}s`,
                    }}
                >
                    <animateMotion
                        dur={`${flowSpeed}s`}
                        path={`M0,${thickness / 2 + 5} L${length},${thickness / 2 + 5}`}
                        repeatCount="indefinite"
                    />
                </circle>

                {/* Reduced particle glow - uses current text color */}
                <circle
                    className="animate-electric-particle fill-current opacity-30"
                    filter="blur(1.5px)"
                    r="3"
                    style={{
                        animationDuration: `${flowSpeed}s`,
                    }}
                >
                    <animateMotion
                        dur={`${flowSpeed}s`}
                        path={`M0,${thickness / 2 + 5} L${length},${thickness / 2 + 5}`}
                        repeatCount="indefinite"
                    />
                </circle>
            </svg>
        </div>
    )
}
