import type { CellContext, TableMeta } from '@tanstack/react-table'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { JSX, useEffect, useState } from 'react'
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select'

export interface TableMetaWithUpdate<T> extends TableMeta<T> {
    updateData: (rowIndex: number, columnId: keyof T, value: any) => void
    deleteRow: (rowIndex: string) => void
}

export const EditableTextCell = <T extends Record<string, any>>({
    getValue,
    row: { index },
    column: { id },
    table,
}: CellContext<T, string>): JSX.Element => {
    const initialValue = getValue()
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    const handleBlur = () => {
        ;(table.options.meta as TableMetaWithUpdate<T>)?.updateData(
            index,
            id as keyof T,
            value
        )
    }

    return (
        <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleBlur}
        />
    )
}

export const EditableCheckboxCell = <T,>({
    getValue,
    row: { index },
    column: { id },
    table,
}: CellContext<T, boolean>): JSX.Element => {
    const initialValue: boolean = getValue() ?? false
    const [value, setValue] = useState<boolean>(initialValue)

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    const handleChange = (checked: boolean) => {
        setValue(checked)
        ;(table.options.meta as TableMetaWithUpdate<T>)?.updateData(
            index,
            id as keyof T,
            checked
        )
    }

    return (
        <Checkbox
            className="h-8 w-8"
            checked={value}
            onCheckedChange={(checked) => handleChange(!!checked)}
        />
    )
}

export const EditableSelectCell = <T,>({
    getValue,
    row,
    column,
    table,
    options,
}: CellContext<T, string> & {
    options: { label: string; value: string }[]
}) => {
    const initialValue: string = getValue() || ''
    const [value, setValue] = useState<string>(initialValue)
    const [open, setOpen] = useState<boolean>(false)

    function handleChange(value: string) {
        setValue(value)
        ;(table.options.meta as TableMetaWithUpdate<T>)?.updateData(
            row.index,
            column.id as keyof T,
            value
        )
    }

    useEffect(() => setValue(initialValue), [initialValue])

    return (
        <Select
            onValueChange={handleChange}
            value={value}
            defaultValue={value}
            open={open}
            onOpenChange={setOpen}
        >
            <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select a value" />
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
