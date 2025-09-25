import * as React from 'react'

import { cn } from '@/helpers/tw-utils'
import { ICompany, useGetAllCompany } from '@/modules/company'

import { CheckIcon, ChevronDownIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
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

import { TEntityId } from '@/types'

import {
    CompanyCreateUpdateFormModal,
    ICompanyFormProps,
} from './forms/company-create-update-modal'

export interface ICompanyComboboxCreateProps
    extends Pick<
        ICompanyFormProps,
        'defaultValues' | 'disabledFields' | 'hiddenFields'
    > {}

interface Props {
    value?: TEntityId
    disabled?: boolean
    className?: string
    placeholder?: string
    companyComboboxCreateProps?: ICompanyComboboxCreateProps
    onChange?: (selected: ICompany) => void
}

const CompanyCombobox = ({
    value,
    className,
    disabled = false,
    companyComboboxCreateProps,
    placeholder = 'Select Company...',
    onChange,
}: Props) => {
    const [open, setOpen] = React.useState(false)
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

    return (
        <>
            <CompanyCreateUpdateFormModal
                open={createModal}
                onOpenChange={setCreateModal}
                formProps={{
                    ...companyComboboxCreateProps,
                    onSuccess: (newCompany) => {
                        onChange?.(newCompany as ICompany)
                        setCreateModal(false)
                    },
                }}
            />
            <Popover modal open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn('w-full justify-between px-3', className)}
                        disabled={disabled || isLoading}
                    >
                        {selectedCompany ? (
                            <div className="flex items-center gap-2 min-w-0">
                                <PreviewMediaWrapper
                                    media={selectedCompany.media}
                                >
                                    <ImageDisplay
                                        src={
                                            selectedCompany.media?.download_url
                                        }
                                        className="size-4 rounded-full border bg-muted object-cover flex-shrink-0"
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
                        <ChevronDownIcon className="opacity-50 flex-shrink-0" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0">
                    <Command>
                        <CommandInput
                            placeholder="Search Company..."
                            className="h-9"
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
                                            value={option.name}
                                            onSelect={() => {
                                                setOpen(false)
                                                onChange?.(option)
                                            }}
                                        >
                                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                                <PreviewMediaWrapper
                                                    media={option.media}
                                                >
                                                    <ImageDisplay
                                                        src={
                                                            option.media
                                                                ?.download_url
                                                        }
                                                        className="h-5 w-5 rounded-full border bg-muted object-cover flex-shrink-0"
                                                    />
                                                </PreviewMediaWrapper>
                                                <span className="truncate">
                                                    {option.name}
                                                </span>
                                            </div>
                                            <CheckIcon
                                                className={cn(
                                                    'ml-auto flex-shrink-0',
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
