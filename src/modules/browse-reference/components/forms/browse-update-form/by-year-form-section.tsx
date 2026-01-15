import { UseFormReturn, useFieldArray } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { cn } from '@/helpers/tw-utils'
import { BrowseReferenceSchema } from '@/modules/browse-reference/browse-reference.validation'
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

type TBrowseReferenceFormValues = z.infer<typeof BrowseReferenceSchema>

interface IByYearFormSectionProps extends IClassProps {
    form: UseFormReturn<TBrowseReferenceFormValues>
    disabled?: boolean
}

const ByYearFormSection = ({
    form,
    disabled,
    className,
}: IByYearFormSectionProps) => {
    const { onOpen } = useConfirmModalStore()

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'interest_rates_by_year',
    })

    const { append: addDeletedId } = useFieldArray({
        control: form.control,
        name: 'interest_rates_by_year_deleted',
    })

    const handleAddRange = () => {
        append({
            from_year: 0,
            to_year: 0,
            interest_rate: 0,
        })
    }

    const handleRemoveRange = (index: number) => {
        const field = form.getValues(`interest_rates_by_year.${index}`)

        if (field.id === undefined || field.id === null) return remove(index)

        onOpen({
            title: 'Remove Year Range',
            description: 'Are you sure you want to remove this year range?',
            onConfirm: () => {
                if (field.id) addDeletedId(field.id)

                remove(index)
                toast.success('Year range removed')
            },
        })
    }

    return (
        <div className={cn('space-y-4 bg-card p-3.5 rounded-xl', className)}>
            <div className="flex items-center gap-x-4 justify-between">
                <div className="text-base">
                    Interest Year Ranges
                    <p className="text-xs text-muted-foreground">
                        Interest rates are applied based on a member's type and
                        the year they qualify. Each year range has its own rate;
                        otherwise, it will fall to the default value{' '}
                        {form.getValues('interest_rate')}%.
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
                        <EmptyTitle>No Year Ranges</EmptyTitle>
                        <EmptyDescription>
                            Add year ranges to define how interest rates are
                            calculated based on membership years.
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
                    <div className="grid grid-cols-[1fr_24px_1fr_1fr_auto] gap-2 px-3">
                        <Label className="text-xs text-muted-foreground">
                            From Year
                        </Label>
                        <span />
                        <Label className="text-xs text-muted-foreground">
                            To Year
                        </Label>
                        <Label className="text-xs text-muted-foreground">
                            Interest Rate
                        </Label>
                        <div className="w-9" />
                    </div>

                    {/* Ranges */}
                    {fields.map((field, index) => (
                        <div
                            className="grid grid-cols-[1fr_24px_1fr_1fr_auto] gap-2 items-start p-2 rounded-lg bg-secondary/70 hover:border-primary duration-200"
                            key={field.id}
                        >
                            <FormFieldWrapper
                                control={form.control}
                                name={`interest_rates_by_year.${index}.from_year`}
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            min={0}
                                            onChange={(e) =>
                                                field.onChange(e.target.value)
                                            }
                                            placeholder="0"
                                            value={field.value}
                                        />
                                    </InputGroup>
                                )}
                            />
                            <ArrowRightIcon className="size-4 mt-2 text-muted-foreground justify-self-center" />
                            <FormFieldWrapper
                                control={form.control}
                                name={`interest_rates_by_year.${index}.to_year`}
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            min={0}
                                            onChange={(e) =>
                                                field.onChange(e.target.value)
                                            }
                                            placeholder="0"
                                            value={field.value}
                                        />
                                    </InputGroup>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name={`interest_rates_by_year.${index}.interest_rate`}
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            min={0}
                                            onChange={(e) =>
                                                field.onChange(e.target.value)
                                            }
                                            placeholder="0.00"
                                            step="0.01"
                                            value={field.value || 0}
                                        />
                                        <InputGroupAddon align="inline-end">
                                            <InputGroupText>%</InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>
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

export default ByYearFormSection
