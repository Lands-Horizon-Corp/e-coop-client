import * as React from 'react'

import { cn } from '@/helpers'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface KpiCardProps {
    label: React.ReactNode
    value?: React.ReactNode
    description?: React.ReactNode
    subDescription?: React.ReactNode
    trend?: React.ReactNode
    icon?: React.ReactNode
    isLoading?: boolean
    className?: string
}

const KpiCard = ({
    label,
    value,
    description,
    subDescription,
    trend,
    icon,
    isLoading = false,
    className,
}: KpiCardProps) => {
    return (
        <Card
            className={cn(
                'relative bg-card border shadow-sm rounded-xl',
                className
            )}
        >
            <CardContent className="p-6 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {icon}
                        {label}
                    </div>

                    {trend && (
                        <div className="text-xs font-medium px-2 py-1 rounded-full bg-muted">
                            {trend}
                        </div>
                    )}
                </div>

                {/* Value */}
                {isLoading ? (
                    <Skeleton className="h-8 w-28" />
                ) : (
                    <div className="text-3xl font-bold tracking-tight">
                        {value ?? 0}
                    </div>
                )}

                {/* Description */}
                {!isLoading && description && (
                    <div className="text-sm text-foreground font-medium flex items-center gap-1">
                        {description}
                    </div>
                )}

                {/* Sub Description */}
                {!isLoading && subDescription && (
                    <div className="text-xs text-muted-foreground">
                        {subDescription}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default KpiCard
