import { useEffect, useState } from 'react'

import * as SelectPrimitive from '@radix-ui/react-select'

import { cn } from '@/helpers'
import { IAccount } from '@/modules/account'
import { AccountPicker } from '@/modules/account/components'
import { IMemberProfile } from '@/modules/member-profile'
import MemberPicker from '@/modules/member-profile/components/member-picker'
import { TransactionAmountField } from '@/modules/transaction'
import { CellContext, Row } from '@tanstack/react-table'

import { Checkbox } from '@/components/ui/checkbox'
import { Input, InputProps } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

import InputDate from './input-date'

declare module '@tanstack/react-table' {
    interface TableMeta<TData> {
        updateData: <TValue>(
            rowIndex: number,
            columnId: keyof TData,
            value: TValue
        ) => void
        handleDeleteRow: (row: Row<TData>) => void
    }
}

interface CustomCellContext<TData extends object>
    extends CellContext<TData, unknown> {
    inputType?:
        | 'text'
        | 'checkbox'
        | 'select'
        | 'number'
        | 'date'
        | 'account-picker'
        | 'member-picker'
    options?: { label: string; value: string }[]
    inputProps?: InputProps
    selectTriggerProps?: React.ComponentProps<typeof SelectPrimitive.Trigger>
    checkboxProps?: React.ComponentProps<typeof Checkbox>
}

export const EditableCell = <T extends object>({
    getValue,
    row: { index },
    column: { id },
    inputType = 'text',
    options = [],
    inputProps,
    selectTriggerProps,
    checkboxProps,
    table,
}: CustomCellContext<T>) => {
    const initialValue = getValue()
    const [value, setValue] = useState(initialValue)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    const handleBlur = () => {
        table.options.meta?.updateData(index, id as keyof T, value)
    }

    const handleChange = (newValue: unknown) => {
        setValue(newValue)
        table.options.meta?.updateData(index, id as keyof T, newValue)
    }

    switch (inputType) {
        case 'text':
            return (
                <Input
                    {...inputProps}
                    className={cn('text-left', inputProps?.className)}
                    onBlur={handleBlur}
                    onChange={(e) => setValue(e.target.value)}
                    value={value as string}
                />
            )
        case 'number':
            return (
                <TransactionAmountField
                    {...inputProps}
                    className={cn('text-left', inputProps?.className)}
                    isDefault
                    onBlur={handleBlur}
                    onChange={(e) => {
                        handleChange(Number(e.target.value))
                    }}
                    value={value as number}
                />
            )
        case 'select':
            return (
                <Select
                    defaultValue={value as string}
                    onOpenChange={setOpen}
                    onValueChange={handleChange}
                    open={open}
                    value={value as string}
                >
                    <SelectTrigger
                        className={cn(
                            'max-w-xs',
                            selectTriggerProps?.className
                        )}
                    >
                        <SelectValue placeholder="select a value" />
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )
        case 'checkbox':
            return (
                <Checkbox
                    checked={value as boolean}
                    className={cn('size-8', checkboxProps?.className)}
                    onCheckedChange={handleChange}
                />
            )
        case 'account-picker':
            return (
                <AccountPicker
                    allowClear
                    nameOnly
                    onSelect={(selectedAccount) => {
                        handleChange(selectedAccount)
                    }}
                    placeholder="Select an Account"
                    triggerClassName={cn('', inputProps?.className)}
                    value={value as IAccount}
                />
            )
        case 'member-picker':
            return (
                <MemberPicker
                    allowClear
                    onSelect={(selectedMember) => {
                        handleChange(selectedMember)
                    }}
                    placeholder="Select Member"
                    showPBNo={false}
                    triggerClassName={cn('!w-full', inputProps?.className)}
                    triggerVariant="outline"
                    value={value as IMemberProfile}
                />
            )
        case 'date':
            return <InputDate onChange={handleChange} value={value as string} />
        default:
            return null
    }
}
