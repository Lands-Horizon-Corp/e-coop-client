import { useFieldArray } from 'react-hook-form'
import { type UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

import { cn } from '@/helpers/tw-utils'
import MemberTypeCombobox from '@/modules/member-type/components/member-type-combobox'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Trash2 } from 'lucide-react'

import { PlusIcon } from '@/components/icons'
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

interface IMutualFundAdditionalMemberSectionProps extends IClassProps {
    form: UseFormReturn<TMutualFundSchema>
    disabled?: boolean
}

const MutualFundAdditionalMemberSection = ({
    form,
    disabled,
    className,
}: IMutualFundAdditionalMemberSectionProps) => {
    const { onOpen } = useConfirmModalStore()

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'mutual_fund_additional_members',
    })

    const { append: addDeletedId } = useFieldArray({
        control: form.control,
        name: 'mutual_fund_additional_members_delete_ids',
    })

    const handleAddRow = () => {
        append({
            member_type_id: '',
            member_type: undefined,
            number_of_members: 1,
            ratio: 0,
        })
    }

    const handleRemoveRow = (index: number) => {
        const field = form.getValues(`mutual_fund_additional_members.${index}`)

        if (field.id === undefined || field.id === null) return remove(index)

        onOpen({
            title: 'Remove Row',
            description:
                'Are you sure you want to remove this additional member entry?',
            onConfirm: () => {
                if (field.id) addDeletedId(field.id)

                remove(index)
                toast.success('Row removed')
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
                    Additional Members
                    <p className="text-sm text-muted-foreground">
                        Define additional member types with their ratios.
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
                            <TableHead className="px-3 py-2 w-[500px]">
                                Member Type
                            </TableHead>
                            <TableHead className="px-3 py-2 text-center">
                                Number of Members
                            </TableHead>
                            <TableHead className="px-3 py-2 text-right">
                                Ratio (%)
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
                                <TableCell className="pl-0 py-2">
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`mutual_fund_additional_members.${index}.member_type_id`}
                                        render={({ field: inputField }) => (
                                            <MemberTypeCombobox
                                                {...inputField}
                                                disabled={disabled}
                                                onChange={(memberType) => {
                                                    inputField.onChange(
                                                        memberType?.id
                                                    )
                                                    form.setValue(
                                                        `mutual_fund_additional_members.${index}.member_type`,
                                                        memberType
                                                    )
                                                }}
                                                placeholder="Select member type"
                                            />
                                        )}
                                    />
                                </TableCell>
                                <TableCell className="px-3 py-2">
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`mutual_fund_additional_members.${index}.number_of_members`}
                                        render={({ field: inputField }) => (
                                            <Input
                                                {...inputField}
                                                className="text-right"
                                                disabled={disabled}
                                                placeholder="1"
                                            />
                                        )}
                                    />
                                </TableCell>
                                <TableCell className="px-3 py-2">
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`mutual_fund_additional_members.${index}.ratio`}
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
                        <EmptyTitle>No Additional Members Yet</EmptyTitle>
                        <EmptyDescription>
                            Add additional member types to define their
                            participation ratios in the mutual fund.
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

export default MutualFundAdditionalMemberSection
