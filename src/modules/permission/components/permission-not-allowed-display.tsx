import { cn } from '@/helpers'

import { ShieldExclamationIcon } from '@/components/icons'
import { Badge } from '@/components/ui/badge'

import { NotAllowedDisplayProps } from './permission-guard'

const PermissionNotAllowedDisplay = ({
    permissionName,
    resourceName,
    className,
}: NotAllowedDisplayProps) => {
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
                    You don't have{' '}
                    {permissionName && (
                        <Badge
                            className="mx-1 px-2.5 py-0.5 text-xs font-medium"
                            variant="destructive"
                        >
                            {permissionName}
                        </Badge>
                    )}
                    {!permissionName && 'the required'} permission
                    {resourceName && (
                        <>
                            {' '}
                            for{' '}
                            <Badge
                                className="mx-1 px-2.5 py-0.5 text-xs font-medium"
                                variant="secondary"
                            >
                                {resourceName}
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
