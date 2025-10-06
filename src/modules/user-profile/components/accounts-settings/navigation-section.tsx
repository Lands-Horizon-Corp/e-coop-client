import { Link } from '@tanstack/react-router'
import { useLocation } from '@tanstack/react-router'

import { cn } from '@/helpers/tw-utils'

import { SettingsIcon } from '@/components/icons'

interface NavigationItem {
    name: string
    path: string
}

interface NavigationSectionProps {
    items: NavigationItem[]
    title?: string
    className?: string
}

export const NavigationSection = ({
    items,
    title,
    className,
}: NavigationSectionProps) => {
    const { pathname } = useLocation()

    return (
        <div className={cn('space-y-1', className)}>
            {title && (
                <p className="font-medium text-muted-foreground uppercase tracking-wide mb-1">
                    <SettingsIcon className="size-5 inline mr-2" />
                    {title}
                </p>
            )}
            <div className="space-y-0.5">
                {items.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path as string}
                        className={cn(
                            'block px-2 py-1.5 rounded-md transition-colors duration-200',
                            'hover:bg-accent hover:text-accent-foreground',
                            pathname === item.path
                                ? 'bg-accent text-accent-foreground font-medium'
                                : 'text-muted-foreground'
                        )}
                    >
                        {item.name}
                    </Link>
                ))}
            </div>
        </div>
    )
}
