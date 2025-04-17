import {
    Select,
    SelectItem,
    SelectGroup,
    SelectValue,
    SelectLabel,
    SelectContent,
    SelectTrigger,
} from '@/components/ui/select'
import LoadingSpinner from '@/components/spinners/loading-spinner'

import { cn } from '@/lib'
import { PICKERS_SELECT_PAGE_SIZE } from '@/constants'
import { useFilteredPaginatedMemberTypes } from '@/hooks/api-hooks/member/use-member-type'

import useFilterState from '@/hooks/use-filter-state'
import { TFilterObject } from '@/contexts/filter-context'

import { IClassProps } from '@/types'
import { IMemberTypeResource, TEntityId } from '@/server/types'

interface MemberTypeSelectProps extends IClassProps {
    value?: TEntityId
    disabled?: boolean
    placeholder?: string
    filter?: TFilterObject
    onChange?: (selectedMemberType: IMemberTypeResource) => void
}

const MemberTypeSelect = ({
    value,
    filter,
    disabled,
    className,
    placeholder,
    onChange,
}: MemberTypeSelectProps) => {
    const { finalFilterPayload } = useFilterState({ defaultFilter: filter })

    const {
        data: { data: memberTypes },
        isLoading,
    } = useFilteredPaginatedMemberTypes({
        filterPayload: finalFilterPayload,
        pagination: {
            pageIndex: 0,
            pageSize: PICKERS_SELECT_PAGE_SIZE,
        },
        enabled: !disabled,
        showMessage: false,
    })

    return (
        <Select
            value={value}
            onValueChange={(selectedValue: TEntityId) => {
                const selectedMemberType = memberTypes.find(
                    (mt) => mt.id === selectedValue
                )
                if (selectedMemberType && onChange) {
                    onChange(selectedMemberType)
                }
            }}
            disabled={disabled || isLoading}
        >
            <SelectTrigger
                disabled={isLoading || disabled}
                className={cn('', className)}
            >
                <SelectValue
                    placeholder={placeholder || 'Select Member Type'}
                />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Member Types </SelectLabel>
                    {isLoading && (
                        <SelectLabel className="text-sm font-normal text-foreground/70">
                            <LoadingSpinner className="inline size-3" /> Loading
                            Member Types...
                        </SelectLabel>
                    )}
                    {memberTypes.map(({ id, name }) => (
                        <SelectItem key={id} value={id}>
                            {name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

export default MemberTypeSelect
