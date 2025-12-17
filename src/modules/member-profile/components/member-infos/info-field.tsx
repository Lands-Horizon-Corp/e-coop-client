import { ReactNode } from 'react'

export const InfoField = ({
    label,
    value,
    icon,
    className = '',
}: {
    icon?: ReactNode
    label: string
    value: string | React.ReactNode
    className?: string
}) => (
    <div className={`space-y-1 ${className}`}>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {label}
        </p>
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            {icon && <span className="text-muted-foreground">{icon}</span>}
            <span>{value || '__'}</span>
        </div>
    </div>
)
