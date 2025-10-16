import { cn } from '@/helpers'

import { Separator } from '@/components/ui/separator'

type BranchInfoItemProps = {
    className?: string
    title?: string
    content?: string | number | React.ReactNode
    icon?: React.ReactNode
    iconClassName?: string
    contentClassName?: string
    textAlign?: 'left' | 'center' | 'right'
    hideSeparator?: boolean
}

export const BranchInfoItem = ({
    className,
    title,
    content,
    icon,
    iconClassName,
    contentClassName,
    textAlign = 'left',
    hideSeparator = true,
}: BranchInfoItemProps) => {
    return (
        <div
            className={cn(
                'px-1 max-w-full mx-auto min-w-0 grow flex items-center gap-x-4  ',
                className
            )}
        >
            <span className=" text-xs font-bold shrink-0">
                {icon && (
                    <span className={cn('shrink-0', iconClassName)}>
                        {icon}
                    </span>
                )}
                {title}
            </span>
            {!hideSeparator && (
                <Separator className="min-h-8" orientation="vertical" />
            )}
            <span
                className={cn(
                    'text-muted-foreground text-xs min-h-8 w-full font-medium truncate',
                    textAlign === 'left' && 'text-left',
                    textAlign === 'center' && 'text-center w-full',
                    textAlign === 'right' && 'text-right',
                    contentClassName
                )}
            >
                {content}
            </span>
        </div>
    )
}
