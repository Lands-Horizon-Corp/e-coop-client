import { useEffect, useState } from 'react'

import { cn } from '@/helpers'
import { useGetById } from '@/modules/account'
import { AccountPicker } from '@/modules/account/components'
import { useGetMemberProfileById } from '@/modules/member-profile'
import MemberPicker from '@/modules/member-profile/components/member-picker'
import { TransactionAmountField } from '@/modules/transaction'
import { CellContext, Row } from '@tanstack/react-table'

import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

declare module '@tanstack/react-table' {
    interface TableMeta<TData> {
        updateData: (
            rowIndex: number,
            columnId: keyof TData,
            value: unknown
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
    className?: string
}

export const EditableCell = <T extends object>({
    getValue,
    row: { index },
    column: { id },
    table,
    inputType = 'text',
    options = [],
    className,
}: CustomCellContext<T>) => {
    const initialValue = getValue()
    const [value, setValue] = useState(initialValue)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    const { data: account } = useGetById({ id: value as string })
    const { data: member } = useGetMemberProfileById({
        id: value as string,
    })

    const handleBlur = () => {
        table.options.meta?.updateData(index, id as keyof T, value)
    }

    const handleChange = (newValue: unknown) => {
        setValue(newValue)
        table.options.meta?.updateData(index, id as keyof T, newValue)
    }

    if (inputType === 'text') {
        return (
            <Input
                value={value as string}
                className={cn('text-left', className)}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleBlur}
            />
        )
    }
    if (inputType === 'number') {
        return (
            <TransactionAmountField
                className={cn('text-left', className)}
                value={value as number}
                onChange={(e) => {
                    handleChange(Number(e.target.value))
                }}
                onBlur={handleBlur}
                isDefault
            />
        )
    }
    if (inputType === 'select') {
        return (
            <Select
                onValueChange={handleChange}
                value={value as string}
                defaultValue={value as string}
                open={open}
                onOpenChange={setOpen}
            >
                <SelectTrigger className={cn('max-w-xs', className)}>
                    <SelectValue placeholder="select a value" />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem value={option.value} key={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        )
    }
    if (inputType === 'checkbox') {
        return (
            <Checkbox
                className={cn('size-8', className)}
                checked={value as boolean}
                onCheckedChange={handleChange}
            />
        )
    }
    if (inputType === 'account-picker') {
        return (
            <AccountPicker
                value={account ?? undefined}
                onSelect={(selectedAccount) => {
                    handleChange(selectedAccount.id)
                }}
                triggerClassName={cn('max-w-xs', className)}
                nameOnly
                placeholder="Select an Account"
            />
        )
    }
    if (inputType === 'member-picker') {
        return (
            <MemberPicker
                value={member}
                onSelect={(selectedMember) => {
                    handleChange(selectedMember.id)
                }}
                triggerClassName={cn('max-w-xs', className)}
                triggerVariant="outline"
                placeholder="Select Member"
                showPBNo={false}
            />
        )
    }
    return null
}
