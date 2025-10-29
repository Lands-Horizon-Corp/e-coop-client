import { UseFormReturn, useFieldArray } from 'react-hook-form'
import { toast } from 'sonner'

import { cn } from '@/helpers/tw-utils'
import { TTimeDepositTypeSchema } from '@/modules/time-deposit-type/time-deposit-type.validation'
import useConfirmModalStore from '@/store/confirm-modal-store'

import { PlusIcon, TrashIcon } from '@/components/icons'
import ActionTooltip from '@/components/tooltips/action-tooltip'
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
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
} from '@/components/ui/input-group'

import { IClassProps } from '@/types'

interface ITimeDepositComputationPreMatureSectionProps extends IClassProps {
    form: UseFormReturn<TTimeDepositTypeSchema>
    disabled?: boolean
}

const TimeDepositComputationPreMatureSection = ({
    form,
    disabled,
    className,
}: ITimeDepositComputationPreMatureSectionProps) => {
    const { onOpen } = useConfirmModalStore()

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'time_deposit_computations_pre_mature',
    })

    const { append: addDeletedId } = useFieldArray({
        control: form.control,
        name: 'time_deposit_computations_pre_mature_deleted',
    })

    const handleAddRow = () => {
        append({
            terms: 0,
            from: 0,
            to: 0,
            rate: 0,
        })
    }

    const handleRemoveRow = (index: number) => {
        const field = form.getValues(
            `time_deposit_computations_pre_mature.${index}`
        )

        if (field.id === undefined || field.id === null) return remove(index)

        onOpen({
            title: 'Remove Row',
            description: 'Are you sure you want to remove this row?',
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
                'space-y-4 max-w-full min-w-0 p-4 rounded-xl',
                className
            )}
        >
            <div className="flex items-center sticky top-0 z-10 bg-accent p-4 rounded-xl gap-x-4 justify-between">
                <div className="text-base">
                    Pre-Mature Time Deposit Computation
                    <p className="text-sm text-muted-foreground">
                        Define interest rates for pre-mature withdrawals based
                        on terms and day ranges.
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
                    Add
                </Button>
            </div>

            {fields.length === 0 ? (
                <Empty className="from-muted/50 w-full to-background bg-gradient-to-b from-30% rounded-2xl border p-8">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <PlusIcon />
                        </EmptyMedia>
                        <EmptyTitle>No Rows Added</EmptyTitle>
                        <EmptyDescription>
                            Add rows to define pre-mature interest rates based
                            on terms and day ranges.
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
            ) : (
                <div className="w-fit max-w-full relative space-y-1 ecoop-scroll overflow-auto">
                    <div className="space-y-2 pb-4 w-full rounded-2xl">
                        {fields.map((field, index) => {
                            return (
                                <div
                                    className="p-2 grid items-start grid-cols-[repeat(4,1fr)_auto] gap-4 rounded-lg bg-secondary/70 w-fit duration-200"
                                    key={field.id}
                                >
                                    <FormFieldWrapper
                                        control={form.control}
                                        label="Terms (Months)"
                                        name={`time_deposit_computations_pre_mature.${index}.terms`}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                disabled={disabled}
                                                placeholder="Terms"
                                            />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        label="From (Days)"
                                        name={`time_deposit_computations_pre_mature.${index}.from`}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                disabled={disabled}
                                                placeholder="From"
                                            />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        label="To (Days)"
                                        name={`time_deposit_computations_pre_mature.${index}.to`}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                disabled={disabled}
                                                placeholder="To"
                                            />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        label="Rate"
                                        name={`time_deposit_computations_pre_mature.${index}.rate`}
                                        render={({ field }) => (
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    disabled={disabled}
                                                    placeholder="Rate"
                                                    value={field.value}
                                                />
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupText>
                                                        %
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        )}
                                    />

                                    <ActionTooltip
                                        side="left"
                                        tooltipContent="Remove Row"
                                    >
                                        <Button
                                            className="size-9 shrink-0 ml-auto mt-6"
                                            disabled={disabled}
                                            hoverVariant="destructive"
                                            onClick={() =>
                                                handleRemoveRow(index)
                                            }
                                            size="icon"
                                            type="button"
                                            variant="destructive"
                                        >
                                            <TrashIcon className="size-4" />
                                        </Button>
                                    </ActionTooltip>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

export default TimeDepositComputationPreMatureSection
