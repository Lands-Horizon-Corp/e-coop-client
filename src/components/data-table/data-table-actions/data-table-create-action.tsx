import { IconType } from 'react-icons/lib'

import { PlusIcon } from '@/components/icons'
import { Button, ButtonProps } from '@/components/ui/button'
import LoadingSpinner from '@/components/spinners/loading-spinner'

import { cn } from '@/lib'

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
            size={other.size ?? 'sm'}
            onClick={onClick}
            variant={other.variant ?? 'default'}
            disabled={disabled || isLoading}
            className={cn('gap-x-1 rounded-md', className)}
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
