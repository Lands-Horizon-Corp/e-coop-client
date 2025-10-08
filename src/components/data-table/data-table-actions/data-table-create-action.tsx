import { cn } from '@/helpers/tw-utils'
import { IconType } from 'react-icons/lib'

import { PlusIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button, ButtonProps } from '@/components/ui/button'

export interface IDataTableCreateActionProps
    extends Omit<ButtonProps, 'onClick'> {
    label?: string
    isHidden?: boolean
    isLoading?: boolean
    Icon?: IconType
    onClick: () => void
}

const DataTableCreateAction = ({
    Icon,
    disabled,
    isLoading,
    className,
    label = 'Create',
    onClick,
    ...other
}: IDataTableCreateActionProps) => {
    return (
        <Button
            className={cn('gap-x-1 rounded-md', className)}
            disabled={disabled || isLoading}
            onClick={onClick}
            size={other.size ?? 'sm'}
            variant={other.variant ?? 'default'}
        >
            {isLoading ? (
                <LoadingSpinner />
            ) : Icon ? (
                <Icon className="mr-1 size-4" />
            ) : (
                <PlusIcon className="mr-1 size-4" />
            )}
            {label}
        </Button>
    )
}

export default DataTableCreateAction
