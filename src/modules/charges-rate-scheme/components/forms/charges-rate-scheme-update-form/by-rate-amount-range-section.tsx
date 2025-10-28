import { UseFormReturn, useFieldArray } from 'react-hook-form'
import { toast } from 'sonner'

import { cn } from '@/helpers/tw-utils'
import { TChargesRateSchemeSchema } from '@/modules/charges-rate-scheme/charges-rate-scheme.validation'
import { CurrencyInput } from '@/modules/currency'
import useConfirmModalStore from '@/store/confirm-modal-store'

import { ArrowRightIcon, PlusIcon, TrashIcon } from '@/components/icons'
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
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
} from '@/components/ui/input-group'
import { Label } from '@/components/ui/label'

import { IClassProps } from '@/types'

// BY RATE OR AMOUNT RANGE COMPONENT Section

interface IByRateOrAmountRangeProps extends IClassProps {
    form: UseFormReturn<TChargesRateSchemeSchema>
    disabled?: boolean
}

const ByRateOrAmountRange = ({
    form,
    disabled,
    className,
}: IByRateOrAmountRangeProps) => {
    const { onOpen } = useConfirmModalStore()

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'charges_rate_by_range_or_minimum_amounts',
    })

    const { append: addDeletedId } = useFieldArray({
        control: form.control,
        name: 'charges_rate_by_range_or_minimum_amounts_deleted',
    })

    const currency = form.watch('currency')

    const handleAddRange = () => {
        append({
            from: 0,
            to: 0,
            charge: 0,
            amount: 0,
            minimum_amount: 0,
        })
    }

    const handleRemoveRange = (index: number) => {
        onOpen({
            title: 'Remove Range',
            description: 'Are you sure you want to remove this charge range?',
            onConfirm: () => {
                const field = form.getValues(
                    `charges_rate_by_range_or_minimum_amounts.${index}`
                )

                if (field.id) addDeletedId(field.id)

                remove(index)
                toast.success('Range removed')
            },
        })
    }

    return (
        <div className={cn('space-y-4 bg-card p-4 rounded-xl', className)}>
            <div className="flex items-center gap-x-4 justify-between">
                <div className="text-base">
                    Charge Ranges
                    <p className="text-sm text-muted-foreground">
                        This charge scheme applies rates (%) or fixed amounts
                        based on specific amount ranges. The applicable charge
                        depends on which range the transaction amount falls into
                        as defined in the table below.
                    </p>
                </div>
                <Button
                    disabled={disabled}
                    hoverVariant="primary"
                    onClick={handleAddRange}
                    size="sm"
                    type="button"
                    variant="outline"
                >
                    <PlusIcon className="size-4" />
                    Add Range
                </Button>
            </div>

            {fields.length === 0 ? (
                <Empty className="from-muted/50 to-background bg-gradient-to-b from-30% rounded-2xl border p-8">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <PlusIcon />
                        </EmptyMedia>
                        <EmptyTitle>No Charge Ranges</EmptyTitle>
                        <EmptyDescription>
                            Add charge ranges to define how charges are
                            calculated based on amount ranges.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <Button
                            onClick={handleAddRange}
                            size="sm"
                            type="button"
                            variant="outline"
                        >
                            <PlusIcon className="size-4" />
                            Add First Range
                        </Button>
                    </EmptyContent>
                </Empty>
            ) : (
                <div className="space-y-4 rounded-2xl">
                    {/* Header */}
                    <div className="grid grid-cols-[1fr_24px_1fr_1fr_1fr_1fr_auto] gap-2 px-3">
                        <Label className="text-xs text-muted-foreground">
                            From
                        </Label>
                        <span />
                        <Label className="text-xs size-4 text-muted-foreground">
                            To
                        </Label>
                        <Label className="text-xs text-muted-foreground">
                            Charge%
                        </Label>
                        <Label className="text-xs text-muted-foreground">
                            Amount
                        </Label>
                        <Label className="text-xs text-muted-foreground">
                            Min Amount
                        </Label>
                        <div className="w-9" />
                    </div>

                    {/* Ranges */}
                    {fields.map((field, index) => (
                        <div
                            className="grid grid-cols-[1fr_24px_1fr_1fr_1fr_1fr_auto] gap-2 items-start p-2 rounded-lg bg-secondary/70 hover:border-primary duration-200"
                            key={field.id}
                        >
                            <FormFieldWrapper
                                control={form.control}
                                name={`charges_rate_by_range_or_minimum_amounts.${index}.from`}
                                render={({ field: { onChange, ...field } }) => (
                                    <CurrencyInput
                                        {...field}
                                        currency={currency}
                                        disabled={disabled}
                                        onValueChange={(newValue = '') => {
                                            onChange(newValue)
                                        }}
                                        placeholder="0"
                                    />
                                )}
                            />
                            <ArrowRightIcon className="size-4 mt-2 text-muted-foreground justify-self-center" />
                            <FormFieldWrapper
                                control={form.control}
                                name={`charges_rate_by_range_or_minimum_amounts.${index}.to`}
                                render={({ field: { onChange, ...field } }) => (
                                    <CurrencyInput
                                        {...field}
                                        currency={currency}
                                        disabled={disabled}
                                        onValueChange={(newValue = '') => {
                                            onChange(newValue)
                                        }}
                                        placeholder="0"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name={`charges_rate_by_range_or_minimum_amounts.${index}.charge`}
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            value={field.value}
                                        />
                                        <InputGroupAddon align="inline-end">
                                            <InputGroupText>%</InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name={`charges_rate_by_range_or_minimum_amounts.${index}.amount`}
                                render={({ field: { onChange, ...field } }) => (
                                    <CurrencyInput
                                        {...field}
                                        currency={currency}
                                        disabled={disabled}
                                        onValueChange={(newValue = '') => {
                                            onChange(newValue)
                                        }}
                                        placeholder="0"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name={`charges_rate_by_range_or_minimum_amounts.${index}.minimum_amount`}
                                render={({ field: { onChange, ...field } }) => (
                                    <CurrencyInput
                                        {...field}
                                        currency={currency}
                                        disabled={disabled}
                                        onValueChange={(newValue = '') => {
                                            onChange(newValue)
                                        }}
                                        placeholder="0"
                                    />
                                )}
                            />
                            <ActionTooltip
                                side="left"
                                tooltipContent="Remove Range"
                            >
                                <Button
                                    className="size-9 shrink-0"
                                    disabled={disabled}
                                    hoverVariant="destructive"
                                    onClick={() => handleRemoveRange(index)}
                                    size="icon"
                                    type="button"
                                    variant="outline"
                                >
                                    <TrashIcon className="size-4" />
                                </Button>
                            </ActionTooltip>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ByRateOrAmountRange
