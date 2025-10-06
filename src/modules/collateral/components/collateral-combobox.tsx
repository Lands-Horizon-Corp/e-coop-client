import * as React from 'react'

import { cn } from '@/helpers/tw-utils'

import {
    CheckIcon,
    ChevronDownIcon,
    PlusIcon,
    RenderIcon,
    TIcon,
} from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

import { TEntityId } from '@/types'

import { useGetAllCollateral } from '../collateral.service'
import { ICollateral } from '../collateral.types'
import {
    CollateralCreateUpdateFormModal,
    ICollateralFormProps,
} from './forms/collateral-create-update-form'

export interface ICollateralComboboxCreateProps
    extends Pick<
        ICollateralFormProps,
        'defaultValues' | 'disabledFields' | 'hiddenFields'
    > {}

interface Props
    extends Omit<React.ComponentPropsWithoutRef<'button'>, 'onChange'> {
    value?: TEntityId
    disabled?: boolean
    className?: string
    placeholder?: string
    collateralComboboxCreateProps?: ICollateralComboboxCreateProps
    onChange?: (selected: ICollateral) => void
}

const CollateralCombobox = React.forwardRef<HTMLButtonElement, Props>(
    (
        {
            value,
            className,
            disabled = false,
            collateralComboboxCreateProps,
            placeholder = 'Select Collateral...',
            onChange,
            ...other
        },
        ref
    ) => {
        const [open, setOpen] = React.useState(false)
        const [createModal, setCreateModal] = React.useState(false)

        const { data, isLoading } = useGetAllCollateral({
            options: {
                enabled: !disabled,
            },
        })

        // Extract selected option to const
        const selectedOption = value
            ? data?.find((option) => option.id === value)
            : undefined

        return (
            <>
                <CollateralCreateUpdateFormModal
                    open={createModal}
                    onOpenChange={setCreateModal}
                    formProps={{
                        ...collateralComboboxCreateProps,
                        onSuccess: (newCollateral) => {
                            onChange?.(newCollateral)
                            setCreateModal(false)
                        },
                    }}
                />
                <Popover modal open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            {...other}
                            ref={ref}
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className={cn(
                                'w-full justify-between px-3',
                                className
                            )}
                            disabled={disabled || isLoading}
                        >
                            {selectedOption ? (
                                <span>
                                    <RenderIcon
                                        className="inline mr-2"
                                        icon={selectedOption.icon as TIcon}
                                    />
                                    {selectedOption.name}
                                </span>
                            ) : (
                                <span className="text-muted-foreground">
                                    {placeholder}
                                </span>
                            )}
                            <ChevronDownIcon className="opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0">
                        <Command>
                            <CommandInput
                                placeholder="Search Collateral..."
                                className="h-9"
                            />
                            {isLoading ? (
                                <CommandEmpty>
                                    <LoadingSpinner className="mr-2 inline-block" />{' '}
                                    Loading...
                                </CommandEmpty>
                            ) : (
                                <CommandList className="ecoop-scroll">
                                    <CommandEmpty>
                                        No Collateral found.
                                    </CommandEmpty>
                                    {collateralComboboxCreateProps && (
                                        <>
                                            <CommandGroup>
                                                <CommandItem
                                                    onSelect={() => {
                                                        setCreateModal(true)
                                                    }}
                                                    onClick={() => {}}
                                                >
                                                    <PlusIcon /> Create new
                                                    collateral
                                                </CommandItem>
                                            </CommandGroup>
                                            <CommandSeparator />
                                        </>
                                    )}
                                    <CommandGroup>
                                        {data?.map((option) => (
                                            <CommandItem
                                                key={option.id}
                                                value={option.name}
                                                onSelect={() => {
                                                    setOpen(false)
                                                    onChange?.(option)
                                                }}
                                            >
                                                <span>
                                                    <RenderIcon
                                                        className="inline mr-2"
                                                        icon={
                                                            option.icon as TIcon
                                                        }
                                                    />
                                                    {option.name}
                                                </span>
                                                <CheckIcon
                                                    className={cn(
                                                        'ml-auto',
                                                        value === option.id
                                                            ? 'opacity-100'
                                                            : 'opacity-0'
                                                    )}
                                                />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            )}
                        </Command>
                    </PopoverContent>
                </Popover>
            </>
        )
    }
)

CollateralCombobox.displayName = 'CollateralCombobox'

export default CollateralCombobox
