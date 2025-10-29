import { useRef } from 'react'

import { UseFormReturn, useFieldArray } from 'react-hook-form'
import { toast } from 'sonner'

import { cn } from '@/helpers/tw-utils'
import { CurrencyInput } from '@/modules/currency'
import { TTimeDepositTypeSchema } from '@/modules/time-deposit-type/time-deposit-type.validation'
import useConfirmModalStore from '@/store/confirm-modal-store'

import {
    ArrowRightIcon,
    EyeIcon,
    PlusIcon,
    TrashIcon,
} from '@/components/icons'
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
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'

import { IClassProps } from '@/types'

import TimeDepositComputationPreMatureSection from './time-deposit-computation-pre-mature-section'

interface ITimeDepositComputationSectionProps extends IClassProps {
    form: UseFormReturn<TTimeDepositTypeSchema>
    disabled?: boolean
}

const TimeDepositComputationSection = ({
    form,
    disabled,
    className,
}: ITimeDepositComputationSectionProps) => {
    const { onOpen } = useConfirmModalStore()

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'time_deposit_computations',
    })

    const { append: addDeletedId } = useFieldArray({
        control: form.control,
        name: 'time_deposit_computations_deleted',
    })

    const handleAddRow = () => {
        append({
            minimum_amount: 0,
            maximum_amount: 0,
            header_1: 0,
            header_2: 0,
            header_3: 0,
            header_4: 0,
            header_5: 0,
            header_6: 0,
            header_7: 0,
            header_8: 0,
            header_9: 0,
            header_10: 0,
            header_11: 0,
        })
    }

    const currency = form.watch('currency')

    const handleRemoveRow = (index: number) => {
        const field = form.getValues(`time_deposit_computations.${index}`)

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

    const actionContainerRef = useRef<HTMLDivElement>(null)

    return (
        <div
            className={cn(
                'space-y-4 bg-card max-w-full min-w-0 p-4 rounded-xl',
                className
            )}
        >
            <div className="flex items-center gap-x-4 justify-between">
                <div className="text-base">
                    Time Deposit Computation
                    <p className="text-sm text-muted-foreground">
                        Define interest rates based on amount ranges and terms
                        (in days).
                    </p>
                </div>
                <div
                    className="flex items-center gap-x-2"
                    ref={actionContainerRef}
                >
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
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                disabled={disabled}
                                hoverVariant="primary"
                                size="sm"
                                type="button"
                                variant="outline"
                            >
                                <EyeIcon className="size-4" />
                                Browse Premature
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            className="w-full !max-w-3xl rounded-l-xl bg-popover border-none"
                            closeClassName="hidden"
                            sheetContainer={actionContainerRef.current}
                            side="right"
                        >
                            <SheetHeader className="hidden">
                                <SheetTitle className="hidden">
                                    Pre-Mature Time Deposit Computation
                                </SheetTitle>
                                <SheetDescription className="hidden">
                                    Manage interest rates for pre-mature
                                    withdrawals based on terms and day ranges.
                                </SheetDescription>
                            </SheetHeader>
                            <div className="h-[calc(100vh-140px)] overflow-auto ecoop-scroll">
                                <TimeDepositComputationPreMatureSection
                                    disabled={disabled}
                                    form={form}
                                />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {fields.length > 0 && (
                <div className="w-fit max-w-full z-10 relative space-y-1 ecoop-scroll overflow-auto">
                    <div className="space-y-2 p-1 top-0">
                        <div className="grid items-end grid-cols-[390px_repeat(11,4.5rem)] w-fit gap-2">
                            <div className="grid grid-cols-2 font-medium text-lg sticky left-0 z-50 gap-x-2 items-center">
                                <p className="p-1.5 bg-accent flex items-center justify-center text-accent-foreground h-full rounded-md text-center">
                                    Min. Amount
                                </p>
                                <p className="p-1.5 bg-accent flex items-center justify-center text-accent-foreground h-full rounded-md text-center">
                                    Max. Amount
                                </p>
                            </div>
                            <FormFieldWrapper
                                control={form.control}
                                label="Day"
                                name="header_1"
                                render={({ field }) => (
                                    <Input {...field} disabled={disabled} />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="Day"
                                name="header_2"
                                render={({ field }) => (
                                    <Input {...field} disabled={disabled} />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="Day"
                                name="header_3"
                                render={({ field }) => (
                                    <Input {...field} disabled={disabled} />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="Day"
                                name="header_4"
                                render={({ field }) => (
                                    <Input {...field} disabled={disabled} />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="Day"
                                name="header_5"
                                render={({ field }) => (
                                    <Input {...field} disabled={disabled} />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="Day"
                                name="header_6"
                                render={({ field }) => (
                                    <Input {...field} disabled={disabled} />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="Day"
                                name="header_7"
                                render={({ field }) => (
                                    <Input {...field} disabled={disabled} />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="Day"
                                name="header_8"
                                render={({ field }) => (
                                    <Input {...field} disabled={disabled} />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="Day"
                                name="header_9"
                                render={({ field }) => (
                                    <Input {...field} disabled={disabled} />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="Day"
                                name="header_10"
                                render={({ field }) => (
                                    <Input {...field} disabled={disabled} />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="Day"
                                name="header_11"
                                render={({ field }) => (
                                    <Input {...field} disabled={disabled} />
                                )}
                            />
                        </div>
                    </div>

                    <div className="space-y-2 pb-4 w-full rounded-2xl">
                        {fields.map((field, index) => {
                            return (
                                <div
                                    className="p-1 grid items-start grid-cols-[390px_repeat(11,4.5rem)_auto] gap-2 rounded-lg bg-secondary/70 w-fit duration-200"
                                    key={field.id}
                                >
                                    <div className="items-start sticky left-0 grid z-50 grid-cols-[180px_auto_180px] gap-x-2">
                                        <FormFieldWrapper
                                            className="z-50 bg-secondary/70 backdrop-blur-sm rounded-xl"
                                            control={form.control}
                                            name={`time_deposit_computations.${index}.minimum_amount`}
                                            render={({
                                                field: { onChange, ...field },
                                            }) => (
                                                <CurrencyInput
                                                    {...field}
                                                    currency={currency}
                                                    onValueChange={(
                                                        newValue = ''
                                                    ) => {
                                                        onChange(newValue)
                                                    }}
                                                    placeholder="Min. Amount"
                                                />
                                            )}
                                        />
                                        <ArrowRightIcon className="mt-2" />
                                        <FormFieldWrapper
                                            control={form.control}
                                            name={`time_deposit_computations.${index}.maximum_amount`}
                                            render={({
                                                field: { onChange, ...field },
                                            }) => (
                                                <CurrencyInput
                                                    {...field}
                                                    currency={currency}
                                                    onValueChange={(
                                                        newValue = ''
                                                    ) => {
                                                        onChange(newValue)
                                                    }}
                                                    placeholder="Max. Amount"
                                                />
                                            )}
                                        />
                                    </div>

                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`time_deposit_computations.${index}.header_1`}
                                        render={({ field }) => (
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    disabled={disabled}
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
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`time_deposit_computations.${index}.header_2`}
                                        render={({ field }) => (
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    disabled={disabled}
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
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`time_deposit_computations.${index}.header_3`}
                                        render={({ field }) => (
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    disabled={disabled}
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
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`time_deposit_computations.${index}.header_4`}
                                        render={({ field }) => (
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    disabled={disabled}
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
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`time_deposit_computations.${index}.header_5`}
                                        render={({ field }) => (
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    disabled={disabled}
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
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`time_deposit_computations.${index}.header_6`}
                                        render={({ field }) => (
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    disabled={disabled}
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
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`time_deposit_computations.${index}.header_7`}
                                        render={({ field }) => (
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    disabled={disabled}
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
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`time_deposit_computations.${index}.header_8`}
                                        render={({ field }) => (
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    disabled={disabled}
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
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`time_deposit_computations.${index}.header_9`}
                                        render={({ field }) => (
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    disabled={disabled}
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
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`time_deposit_computations.${index}.header_10`}
                                        render={({ field }) => (
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    disabled={disabled}
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
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`time_deposit_computations.${index}.header_11`}
                                        render={({ field }) => (
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    disabled={disabled}
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
                                            className="size-9 shrink-0 ml-auto"
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

            {fields.length === 0 && (
                <Empty className="from-muted/50 !w-full to-background bg-gradient-to-b from-30% rounded-2xl border p-8">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <PlusIcon />
                        </EmptyMedia>
                        <EmptyTitle>No Rows Added</EmptyTitle>
                        <EmptyDescription>
                            Add rows to define interest rates based on amount
                            ranges.
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

export default TimeDepositComputationSection
