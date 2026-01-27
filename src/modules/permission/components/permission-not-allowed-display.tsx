import { cn } from '@/helpers'

import { ShieldExclamationIcon } from '@/components/icons'
import { Badge } from '@/components/ui/badge'

import { NotAllowedDisplayProps } from './permission-guard'

const PermissionNotAllowedDisplay = ({
    permissionName,
    resourceType,
    conditionLogic = 'some',
    className,
}: NotAllowedDisplayProps) => {
    const actions = permissionName
        ? Array.isArray(permissionName)
            ? permissionName
            : [permissionName]
        : []

    const hasActions = actions.length > 0

    return (
        <div
            className={cn(
                'flex size-full items-center justify-center p-6',
                className
            )}
        >
            <div className="flex max-w-md flex-col items-center text-center">
                <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-destructive/10">
                    <ShieldExclamationIcon className="size-10 text-destructive" />
                </div>

                <h2 className="mb-3 text-xl font-semibold text-foreground">
                    Access Denied
                </h2>

                <p className="mb-4 text-muted-foreground">
                    You don’t have{' '}
                    {hasActions ? (
                        <>
                            {conditionLogic === 'all' ? 'all of' : 'permission'}{' '}
                            {actions.map((action) => (
                                <Badge
                                    className="mx-1 px-2.5 py-0.5 text-xs font-medium"
                                    key={action}
                                    variant="destructive"
                                >
                                    {action}
                                </Badge>
                            ))}
                        </>
                    ) : (
                        'the required permission'
                    )}
                    {resourceType && (
                        <>
                            {' '}
                            for{' '}
                            <Badge
                                className="mx-1 px-2.5 py-0.5 text-xs font-medium"
                                variant="secondary"
                            >
                                {resourceType}
                            </Badge>
                        </>
                    )}
                    .
                </p>
            </div>
        </div>
    )
}

export default PermissionNotAllowedDisplay
