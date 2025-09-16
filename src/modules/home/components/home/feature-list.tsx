import { cn } from '@/helpers'

import { CheckIcon } from '@/components/icons'

interface FeatureItem {
    text: string
    id?: string
}

interface FeatureListProps {
    title?: string
    items: FeatureItem[]
    className?: string
    itemClassName?: string
    iconClassName?: string
    titleClassName?: string
}

const FeatureList = ({
    title,
    items,
    className,
    itemClassName,
    iconClassName,
    titleClassName,
}: FeatureListProps) => {
    return (
        <div className={cn('space-y-3 md:space-y-4', className)}>
            {title && (
                <h3
                    className={cn(
                        'text-lg font-semibold md:text-xl',
                        titleClassName
                    )}
                >
                    {title}
                </h3>
            )}
            <ul className="space-y-2">
                {items.map((item, index) => (
                    <li
                        key={item.id || index}
                        className={cn('flex items-start gap-3', itemClassName)}
                    >
                        <CheckIcon
                            className={cn(
                                'text-primary h-5 w-5',
                                iconClassName
                            )}
                            aria-hidden
                        />
                        <span className="text-current/70">{item.text}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default FeatureList
