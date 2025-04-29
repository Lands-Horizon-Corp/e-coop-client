import {
    Select,
    SelectItem,
    SelectGroup,
    SelectValue,
    SelectLabel,
    SelectContent,
    SelectTrigger,
    SelectSeparator,
} from '@/components/ui/select'
import LoadingSpinner from '@/components/spinners/loading-spinner'

import { cn } from '@/lib'
import { IClassProps } from '@/types'
import useFilterState from '@/hooks/use-filter-state'
import { PICKERS_SELECT_PAGE_SIZE } from '@/constants'
import { TFilterObject } from '@/contexts/filter-context'
import { IGender, TEntityId } from '@/types'

import { useFilteredPaginatedGenders } from '@/hooks/api-hooks/use-gender'
import {
    GenderCreateUpdateFormModal,
    IGenderFormProps,
} from '../forms/gender-forms/gender-create-update-form'
import { useState } from 'react'
import { PlusIcon } from '../icons'
import { Button } from '../ui/button'

export interface IGenderSelectCreateProps
    extends Pick<
        IGenderFormProps,
        'defaultValues' | 'disabledFields' | 'hiddenFields'
    > {}

interface GenderSelectProps extends IClassProps {
    value?: TEntityId
    disabled?: boolean
    placeholder?: string
    filter?: TFilterObject
    createGenderProps?: IGenderSelectCreateProps
    onChange?: (selectedGender: IGender) => void
}

const GenderSelect = ({
    value,
    filter,
    disabled,
    className,
    placeholder,
    createGenderProps,
    onChange,
}: GenderSelectProps) => {
    const [open, setOpen] = useState(false)
    const [createModal, setCreateModal] = useState(false)
    const { finalFilterPayload } = useFilterState({ defaultFilter: filter })

    const {
        data: { data: genders },
        isLoading,
    } = useFilteredPaginatedGenders({
        filterPayload: finalFilterPayload,
        pagination: {
            pageIndex: 0,
            pageSize: PICKERS_SELECT_PAGE_SIZE,
        },
        enabled: !disabled,
        showMessage: false,
    })

    return (
        <>
            <GenderCreateUpdateFormModal
                open={createModal}
                onOpenChange={setCreateModal}
                formProps={{
                    ...createGenderProps,
                    onSuccess: (newGender) => {
                        onChange?.(newGender)
                    },
                }}
            />
            <Select
                open={open}
                value={value}
                onOpenChange={setOpen}
                onValueChange={(selectedValue: TEntityId) => {
                    const selectedGender = genders.find(
                        (g) => g.id === selectedValue
                    )
                    if (selectedGender && onChange) {
                        onChange(selectedGender)
                    }
                }}
                disabled={disabled || isLoading}
            >
                <SelectTrigger className={cn('', className)}>
                    <SelectValue placeholder={placeholder || 'Select Gender'} />
                </SelectTrigger>
                <SelectContent>
                    {createGenderProps && (
                        <>
                            <SelectGroup>
                                <Button
                                    variant="ghost"
                                    onClick={() => setCreateModal(true)}
                                    className="w-full justify-start py-2 text-sm font-normal text-foreground/70"
                                >
                                    <PlusIcon className="mr-1" /> Add a gender
                                </Button>
                            </SelectGroup>
                            <SelectSeparator />
                        </>
                    )}
                    <SelectGroup>
                        <SelectLabel>Select Gender</SelectLabel>
                        {isLoading && (
                            <SelectLabel className="text-sm font-normal text-foreground/70">
                                <LoadingSpinner className="inline size-3" />{' '}
                                Loading Genders...
                            </SelectLabel>
                        )}
                        {genders.map(({ id, name }) => (
                            <SelectItem key={id} value={id}>
                                {name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </>
    )
}

export default GenderSelect
