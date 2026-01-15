import { UseFormReturn, useFieldArray } from 'react-hook-form'
import { toast } from 'sonner'

import { cn } from '@/helpers/tw-utils'
import { TChargesRateSchemeSchema } from '@/modules/charges-rate-scheme/charges-rate-scheme.validation'
import { CurrencyInput } from '@/modules/currency'
import LoanModeOfPaymentCombobox from '@/modules/loan-transaction/components/loan-mode-of-payment-combobox'
import MemberTypeCombobox from '@/modules/member-type/components/member-type-combobox'
import useConfirmModalStore from '@/store/confirm-modal-store'

import {
    ArrowRightIcon,
    InfoFillCircleIcon,
    PlusIcon,
    TrashIcon,
    XIcon,
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
import { InputGroup, InputGroupInput } from '@/components/ui/input-group'
import { Separator } from '@/components/ui/separator'

import { IClassProps } from '@/types'

interface IByTermMopMemberTypeProps extends IClassProps {
    form: UseFormReturn<TChargesRateSchemeSchema>
    disabled?: boolean
}

const ByTermMopMemberTypeSection = ({
    form,
    disabled,
    className,
}: IByTermMopMemberTypeProps) => {
    const { onOpen } = useConfirmModalStore()

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'charges_rate_scheme_model_of_payments',
    })

    const { append: addDeletedId } = useFieldArray({
        control: form.control,
        name: 'charges_rate_scheme_model_of_payments_deleted',
    })

    const handleAddRow = () => {
        append({
            from: 0,
            to: 0,
        })
    }

    const currency = form.watch('currency')
    const modeOfPayment = form.watch('mode_of_payment')
    const memberType = form.watch('member_type')

    const handleRemoveRow = (index: number) => {
        const field = form.getValues(
            `charges_rate_scheme_model_of_payments.${index}`
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
                'space-y-4 bg-card max-w-full min-w-0 p-4 rounded-xl',
                className
            )}
        >
            <div className="flex items-center gap-x-4 justify-between">
                <div className="text-base">
                    Mode of Payment & Member Type Rates
                    <p className="text-sm text-muted-foreground">
                        Define rates based on amount ranges with different
                        column values.
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

            <div className="space-y-2 flex items-end gap-x-4 !mb-0">
                <div className="flex items-start shrink-0 w-fit gap-x-2">
                    <FormFieldWrapper
                        control={form.control}
                        label="Mode of Payment"
                        name={`mode_of_payment`}
                        render={({ field }) => (
                            <LoanModeOfPaymentCombobox
                                {...field}
                                placeholder="Mode of Payment"
                            />
                        )}
                    />
                    {form.watch('mode_of_payment') && (
                        <Button
                            className="size-fit p-2 mt-6"
                            onClick={() =>
                                form.setValue('mode_of_payment', undefined)
                            }
                            size="icon"
                            variant="destructive"
                        >
                            <XIcon />
                        </Button>
                    )}
                    <Separator className="!h-6 mt-7" orientation="vertical" />
                    <FormFieldWrapper
                        control={form.control}
                        label="Member Type"
                        name={`member_type_id`}
                        render={({ field }) => (
                            <MemberTypeCombobox
                                {...field}
                                onChange={(memberType) => {
                                    field.onChange(memberType?.id)
                                    form.setValue('member_type', memberType)
                                }}
                                placeholder="Member Type"
                            />
                        )}
                    />
                    {form.watch('member_type_id') && (
                        <Button
                            className="size-fit p-2 mt-6"
                            onClick={() =>
                                form.setValue('member_type_id', undefined)
                            }
                            size="icon"
                            variant="destructive"
                        >
                            <XIcon />
                        </Button>
                    )}
                </div>
                <div className="text-foreground text-xs bg-secondary rounded-md p-2 ">
                    <InfoFillCircleIcon className="text-primary inline mr-1" />
                    This charges scheme only applicable to mode of payment{' '}
                    <span className="text-primary">
                        {modeOfPayment || 'All'}
                    </span>{' '}
                    and member type{' '}
                    <span className="text-primary">
                        {memberType?.name || 'All'}
                    </span>{' '}
                    otherwise computation will fallback to loan deduction.
                </div>
            </div>

            {fields.length > 0 && (
                <div className="w-fit max-w-full relative space-y-1 ecoop-scroll overflow-auto">
                    <div className="space-y-2 p-1 top-0">
                        <div className="grid items-end grid-cols-[390px_repeat(22,6rem)] w-fit gap-2">
                            <div className="grid grid-cols-2 font-medium text-lg sticky left-0 z-50 gap-x-2 items-center">
                                <p className="p-1.5 bg-accent flex items-center justify-center text-accent-foreground h-full rounded-md text-center">
                                    FROM
                                </p>
                                <p className="p-1.5 bg-accent flex items-center justify-center text-accent-foreground h-full rounded-md text-center">
                                    TO
                                </p>
                            </div>
                            <FormFieldWrapper
                                control={form.control}
                                label="01"
                                name="mode_of_payment_header_1"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="01"
                                        />
                                    </InputGroup>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="02"
                                name="mode_of_payment_header_2"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="02"
                                        />
                                    </InputGroup>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="03"
                                name="mode_of_payment_header_3"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="03"
                                        />
                                    </InputGroup>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="04"
                                name="mode_of_payment_header_4"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="04"
                                        />
                                    </InputGroup>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="05"
                                name="mode_of_payment_header_5"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="05"
                                        />
                                    </InputGroup>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="06"
                                name="mode_of_payment_header_6"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="06"
                                        />
                                    </InputGroup>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="07"
                                name="mode_of_payment_header_7"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="07"
                                        />
                                    </InputGroup>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="08"
                                name="mode_of_payment_header_8"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="08"
                                        />
                                    </InputGroup>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="09"
                                name="mode_of_payment_header_9"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="09"
                                        />
                                    </InputGroup>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="10"
                                name="mode_of_payment_header_10"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="10"
                                        />
                                    </InputGroup>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="11"
                                name="mode_of_payment_header_11"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="11"
                                        />
                                    </InputGroup>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="12"
                                name="mode_of_payment_header_12"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="12"
                                        />
                                    </InputGroup>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="13"
                                name="mode_of_payment_header_13"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="13"
                                        />
                                    </InputGroup>
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                label="14"
                                name="mode_of_payment_header_14"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="14"
                                        />
                                    </InputGroup>
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                label="15"
                                name="mode_of_payment_header_15"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="15"
                                        />
                                    </InputGroup>
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                label="16"
                                name="mode_of_payment_header_16"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="16"
                                        />
                                    </InputGroup>
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                label="17"
                                name="mode_of_payment_header_17"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="17"
                                        />
                                    </InputGroup>
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                label="18"
                                name="mode_of_payment_header_18"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="18"
                                        />
                                    </InputGroup>
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                label="19"
                                name="mode_of_payment_header_19"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="19"
                                        />
                                    </InputGroup>
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                label="20"
                                name="mode_of_payment_header_20"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="20"
                                        />
                                    </InputGroup>
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                label="21"
                                name="mode_of_payment_header_21"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="21"
                                        />
                                    </InputGroup>
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                label="22"
                                name="mode_of_payment_header_22"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="22"
                                        />
                                    </InputGroup>
                                )}
                            />
                        </div>
                    </div>

                    <div className="space-y-2 pb-4 w-full rounded-2xl">
                        {fields.map((field, index) => {
                            return (
                                <div
                                    className="p-1 grid items-start grid-cols-[390px_repeat(22,6rem)_auto] gap-2 rounded-lg bg-secondary/70 w-fit duration-200"
                                    key={field.id}
                                >
                                    <div className="items-start sticky left-0 grid z-50 grid-cols-[180px_auto_180px] gap-x-2">
                                        <FormFieldWrapper
                                            className="z-50 bg-secondary/70 backdrop-blur-sm rounded-xl"
                                            control={form.control}
                                            name={`charges_rate_scheme_model_of_payments.${index}.from`}
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
                                                    placeholder="From"
                                                />
                                            )}
                                        />
                                        <ArrowRightIcon className="mt-2" />
                                        <FormFieldWrapper
                                            control={form.control}
                                            name={`charges_rate_scheme_model_of_payments.${index}.to`}
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
                                                    placeholder="To"
                                                />
                                            )}
                                        />
                                    </div>

                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_scheme_model_of_payments.${index}.column1`}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                disabled={disabled}
                                                placeholder="%"
                                            />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_scheme_model_of_payments.${index}.column2`}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                disabled={disabled}
                                                placeholder="%"
                                            />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_scheme_model_of_payments.${index}.column3`}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                disabled={disabled}
                                                placeholder="%"
                                            />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_scheme_model_of_payments.${index}.column4`}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                disabled={disabled}
                                                placeholder="%"
                                            />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_scheme_model_of_payments.${index}.column5`}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                disabled={disabled}
                                                placeholder="%"
                                            />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_scheme_model_of_payments.${index}.column6`}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                disabled={disabled}
                                                placeholder="%"
                                            />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_scheme_model_of_payments.${index}.column7`}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                disabled={disabled}
                                                placeholder="%"
                                            />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_scheme_model_of_payments.${index}.column8`}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                disabled={disabled}
                                                placeholder="%"
                                            />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_scheme_model_of_payments.${index}.column9`}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                disabled={disabled}
                                                placeholder="%"
                                            />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_scheme_model_of_payments.${index}.column10`}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                disabled={disabled}
                                                placeholder="%"
                                            />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_scheme_model_of_payments.${index}.column11`}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                disabled={disabled}
                                                placeholder="%"
                                            />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_scheme_model_of_payments.${index}.column12`}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                disabled={disabled}
                                                placeholder="%"
                                            />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_scheme_model_of_payments.${index}.column13`}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                disabled={disabled}
                                                placeholder="%"
                                            />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_scheme_model_of_payments.${index}.column14`}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                disabled={disabled}
                                                placeholder="%"
                                            />
                                        )}
                                    />

                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_scheme_model_of_payments.${index}.column15`}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                disabled={disabled}
                                                placeholder="%"
                                            />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_scheme_model_of_payments.${index}.column16`}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                disabled={disabled}
                                                placeholder="%"
                                            />
                                        )}
                                    />

                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_scheme_model_of_payments.${index}.column17`}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                disabled={disabled}
                                                placeholder="%"
                                            />
                                        )}
                                    />

                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_scheme_model_of_payments.${index}.column18`}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                disabled={disabled}
                                                placeholder="%"
                                            />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_scheme_model_of_payments.${index}.column19`}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                disabled={disabled}
                                                placeholder="%"
                                            />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_scheme_model_of_payments.${index}.column20`}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                disabled={disabled}
                                                placeholder="%"
                                            />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_scheme_model_of_payments.${index}.column21`}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                disabled={disabled}
                                                placeholder="%"
                                            />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_scheme_model_of_payments.${index}.column22`}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                disabled={disabled}
                                                placeholder="%"
                                            />
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
                <Empty className="from-muted/50 mt-4 !w-full to-background bg-gradient-to-b from-30% rounded-2xl border p-8">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <PlusIcon />
                        </EmptyMedia>
                        <EmptyTitle>No Rows Added</EmptyTitle>
                        <EmptyDescription>
                            Add rows to define rates based on amount ranges.
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

export default ByTermMopMemberTypeSection
