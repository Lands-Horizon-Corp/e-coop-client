import { useFieldArray } from 'react-hook-form'
import { type UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

import { cn } from '@/helpers/tw-utils'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Trash2 } from 'lucide-react'

import { ArrowRightIcon, PlusIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import { IClassProps } from '@/types'

import { type TMutualFundSchema } from '../../../mutual-fund.validation'

interface IMutualFundTableSectionProps extends IClassProps {
    form: UseFormReturn<TMutualFundSchema>
    disabled?: boolean
}

const MutualFundTableSection = ({
    form,
    disabled,
    className,
}: IMutualFundTableSectionProps) => {
    const { onOpen } = useConfirmModalStore()

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'mutual_fund_tables',
    })

    const { append: addDeletedId } = useFieldArray({
        control: form.control,
        name: 'mutual_fund_table_delete_ids',
    })

    const handleAddRow = () => {
        append({
            months_from: 0,
            months_to: 0,
            amount: 0,
        })
    }

    const handleRemoveRow = (index: number) => {
        const field = form.getValues(`mutual_fund_tables.${index}`)

        if (field.id === undefined || field.id === null) return remove(index)

        onOpen({
            title: 'Remove Row',
            description: 'Are you sure you want to remove this table entry?',
            onConfirm: () => {
                if (field.id) addDeletedId(field.id)

                remove(index)
                toast.success('Entry removed')
            },
        })
    }

    return (
        <div
            className={cn(
                'space-y-4 bg-card max-w-full min-w-0 p-4 rounded-xl',
                className
            )}
        >
            <div className="flex items-center gap-x-4 justify-between">
                <div className="text-base">
                    Mutual Fund Tables
                    <p className="text-sm text-muted-foreground">
                        Define amount ranges by months for mutual fund
                        calculation.
                    </p>
                </div>
                <Button
                    disabled={disabled}
                    hoverVariant="primary"
                    onClick={handleAddRow}
                    size="sm"
                    type="button"
                    variant="outline"
                >
                    <PlusIcon className="size-4" />
                    Add Row
                </Button>
            </div>

            {fields.length > 0 && (
                <Table
                    className="text-sm"
                    wrapperClassName="max-w-full relative space-y-1 h-[50vh] ecoop-scroll overflow-auto"
                >
                    <TableHeader className="bg-secondary sticky top-0 z-10">
                        <TableRow className="bg-secondary hover:bg-secondary">
                            <TableHead className="px-3 py-2">
                                Months From
                            </TableHead>
                            <TableHead className="w-[24px]" />
                            <TableHead className="px-3 py-2">
                                Months To
                            </TableHead>
                            <TableHead className="px-3 py-2 text-right">
                                Amount
                            </TableHead>
                            <TableHead className="w-12 px-3 py-2" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {fields.map((field, index) => (
                            <TableRow
                                className="hover:bg-muted/50 border-b"
                                key={field.id}
                            >
                                <TableCell className="px-3 py-2">
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`mutual_fund_tables.${index}.months_from`}
                                        render={({ field: inputField }) => (
                                            <Input
                                                {...inputField}
                                                disabled={disabled}
                                                placeholder="0"
                                            />
                                        )}
                                    />
                                </TableCell>
                                <TableCell className="px-3 py-2">
                                    <ArrowRightIcon />
                                </TableCell>
                                <TableCell className="px-3 py-2">
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`mutual_fund_tables.${index}.months_to`}
                                        render={({ field: inputField }) => (
                                            <Input
                                                {...inputField}
                                                disabled={disabled}
                                                placeholder="0"
                                            />
                                        )}
                                    />
                                </TableCell>
                                <TableCell className="px-3 py-2">
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`mutual_fund_tables.${index}.amount`}
                                        render={({ field: inputField }) => (
                                            <Input
                                                {...inputField}
                                                className="text-right"
                                                disabled={disabled}
                                                placeholder="0.00"
                                            />
                                        )}
                                    />
                                </TableCell>
                                <TableCell className="w-12 px-3 py-2">
                                    <Button
                                        disabled={disabled}
                                        hoverVariant="destructive"
                                        onClick={() => handleRemoveRow(index)}
                                        size="icon-sm"
                                        type="button"
                                        variant="ghost"
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
            {fields.length === 0 && (
                <Empty className="from-muted/50 mt-4 !w-full to-background bg-gradient-to-b from-30% rounded-2xl border p-8">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <PlusIcon />
                        </EmptyMedia>
                        <EmptyTitle>No Table Entries Yet</EmptyTitle>
                        <EmptyDescription>
                            Add mutual fund table entries to define amount
                            ranges based on month periods.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <Button
                            onClick={handleAddRow}
                            size="sm"
                            type="button"
                            variant="outline"
                        >
                            <PlusIcon className="size-4" />
                            Add First Row
                        </Button>
                    </EmptyContent>
                </Empty>
            )}
        </div>
    )
}

export default MutualFundTableSection
