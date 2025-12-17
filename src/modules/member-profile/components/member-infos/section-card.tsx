import { ReactNode } from 'react'

import { cn } from '@/helpers'

import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const SectionCard = ({
    icon,
    title,
    subtitle,
    children,
    className,
}: {
    icon?: ReactNode
    title?: string
    subtitle?: string
    children: ReactNode
    className?: string
}) => {
    return (
        <div
            className={cn('rounded-xl border border-border bg-card', className)}
        >
            {title && (
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        {icon && <span className="text-primary">{icon}</span>}
                        <div>
                            <CardTitle className="text-base font-semibold text-foreground">
                                {title}
                            </CardTitle>
                            {subtitle && (
                                <p className="text-xs text-muted-foreground">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>
                </CardHeader>
            )}
            <CardContent>{children}</CardContent>
        </div>
    )
}
