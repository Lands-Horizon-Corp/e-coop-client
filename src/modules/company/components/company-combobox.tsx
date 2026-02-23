import * as React from 'react'

import { cn } from '@/helpers/tw-utils'
import { ICompany, useGetAllCompany } from '@/modules/company'
import { IPickerBaseProps } from '@/types/component-types/picker'
import { useHotkeys } from 'react-hotkeys-hook'

import { CheckIcon, ChevronDownIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button, ButtonProps } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { useInternalState } from '@/hooks/use-internal-state'

import { TEntityId } from '@/types'

import {
    CompanyCreateUpdateFormModal,
    ICompanyFormProps,
} from './forms/company-create-update-modal'

export interface ICompanyComboboxCreateProps extends Pick<
    ICompanyFormProps,
    'defaultValues' | 'disabledFields' | 'hiddenFields'
> {}
interface Props extends Omit<IPickerBaseProps, 'onSelect' | 'value'> {
    value?: TEntityId
    className?: string
    companyComboboxCreateProps?: ICompanyComboboxCreateProps
    onChange?: (selected: ICompany) => void
    mainTriggerProps?: ButtonProps
}

const CompanyCombobox = ({
    value,
    className,
    disabled = false,
    companyComboboxCreateProps,
    placeholder = 'Select Company...',
    onChange,
    modalState,
    shortcutHotKey = 'alt + C',
    allowShortcutHotKey = false,
    mainTriggerProps,
}: Props) => {
    const [open, setOpen] = useInternalState(
        false,
        modalState?.open,
        modalState?.onOpenChange
    )
    const [createModal, setCreateModal] = React.useState(false)
    const { data, isLoading } = useGetAllCompany({
        options: {
            enabled: !disabled,
        },
    })

    const selectedCompany = React.useMemo(
        () => data?.find((company) => company.id === value),
        [data, value]
    )

    useHotkeys(
        shortcutHotKey,
        (event) => {
            event?.preventDefault()
            setOpen(!open)
        },
        {
            enableOnFormTags: true,
            enabled: allowShortcutHotKey && !disabled && !isLoading,
        },
        [value, disabled, isLoading, allowShortcutHotKey, open]
    )

    return (
        <>
            <CompanyCreateUpdateFormModal
                formProps={{
                    ...companyComboboxCreateProps,
                    onSuccess: (newCompany) => {
                        onChange?.(newCompany as ICompany)
                        setCreateModal(false)
                    },
                }}
                onOpenChange={setCreateModal}
                open={createModal}
            />
            <Popover modal onOpenChange={setOpen} open={open}>
                <PopoverTrigger asChild>
                    <Button
                        {...mainTriggerProps}
                        aria-expanded={open}
                        className={cn('w-full justify-between px-3', className)}
                        disabled={disabled || isLoading}
                        role="combobox"
                        variant="outline"
                    >
                        {selectedCompany ? (
                            <div className="flex items-center gap-2 min-w-0">
                                <PreviewMediaWrapper
                                    media={selectedCompany.media}
                                >
                                    <ImageDisplay
                                        className="size-4 rounded-full border bg-muted object-cover shrink-0"
                                        src={
                                            selectedCompany.media?.download_url
                                        }
                                    />
                                </PreviewMediaWrapper>
                                <span className="truncate">
                                    {selectedCompany.name}
                                </span>
                            </div>
                        ) : (
                            <span className="text-muted-foreground">
                                {placeholder}
                            </span>
                        )}
                        <ChevronDownIcon className="opacity-50 shrink-0" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0">
                    <Command>
                        <CommandInput
                            className="h-9"
                            placeholder="Search Company..."
                        />
                        {isLoading ? (
                            <CommandEmpty>
                                <LoadingSpinner className="mr-2 inline-block" />{' '}
                                Loading...
                            </CommandEmpty>
                        ) : (
                            <CommandList className="ecoop-scroll">
                                <CommandEmpty>No Company found.</CommandEmpty>
                                {/* TODO: Once role is set */}
                                {/* {companyComboboxCreateProps && (
                                    <>
                                        <CommandGroup>
                                            <CommandItem
                                                onSelect={() => {
                                                    setCreateModal(true)
                                                }}
                                                onClick={() => {}}
                                            >
                                                <PlusIcon /> Create new company
                                            </CommandItem>
                                        </CommandGroup>
                                        <CommandSeparator />
                                    </>
                                )} */}
                                <CommandGroup>
                                    {data?.map((option) => (
                                        <CommandItem
                                            key={option.id}
                                            onSelect={() => {
                                                setOpen(false)
                                                onChange?.(option)
                                            }}
                                            value={option.name}
                                        >
                                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                                <PreviewMediaWrapper
                                                    media={option.media}
                                                >
                                                    <ImageDisplay
                                                        className="h-5 w-5 rounded-full border bg-muted object-cover shrink-0"
                                                        src={
                                                            option.media
                                                                ?.download_url
                                                        }
                                                    />
                                                </PreviewMediaWrapper>
                                                <span className="truncate">
                                                    {option.name}
                                                </span>
                                            </div>
                                            <CheckIcon
                                                className={cn(
                                                    'ml-auto shrink-0',
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

export default CompanyCombobox
