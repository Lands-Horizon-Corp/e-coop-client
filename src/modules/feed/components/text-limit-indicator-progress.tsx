import { cn } from '@/helpers'

const TextLimitIndicatorProgfress = ({
    textValue = '',
    limit = 255,
    svgCircleClassName,
    textClassName,
}: {
    limit?: number
    textValue?: string
    textClassName?: string
    svgCircleClassName?: string
}) => {
    const charCount = textValue.length || 0
    const remaining = limit - charCount
    const isNearLimit = remaining <= 50
    const isOverLimit = remaining < 0

    const circumference = 2 * Math.PI * 16
    const strokeDashoffset =
        circumference - (Math.min(charCount, limit) / limit) * circumference

    return (
        <div className="relative flex-shrink-0">
            <svg
                className={cn('h-8 w-8 -rotate-90', svgCircleClassName)}
                viewBox="0 0 40 40"
            >
                <circle
                    className="stroke-muted"
                    cx="20"
                    cy="20"
                    fill="none"
                    r="16"
                    strokeWidth="3"
                />
                <circle
                    className="transition-all duration-150"
                    cx="20"
                    cy="20"
                    fill="none"
                    r="16"
                    stroke={
                        isOverLimit
                            ? 'var(--destructive)'
                            : isNearLimit
                              ? 'var(--warning-foreground)'
                              : 'var(--primary)'
                    }
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    strokeWidth="3"
                />
            </svg>
            {isNearLimit ? (
                <span
                    className={cn(
                        'absolute inset-0 flex items-center justify-center text-[9px] font-bold',
                        isOverLimit
                            ? 'text-destructive'
                            : 'text-warning-foreground',
                        textClassName
                    )}
                >
                    {remaining}
                </span>
            ) : (
                <span
                    className={cn(
                        'absolute inset-0 flex items-center justify-center text-[9px] font-bold',
                        textClassName
                    )}
                >
                    {remaining}
                </span>
            )}
        </div>
    )
}

export default TextLimitIndicatorProgfress
