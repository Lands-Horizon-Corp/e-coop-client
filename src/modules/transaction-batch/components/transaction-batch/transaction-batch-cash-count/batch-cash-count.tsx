import { Path, useFieldArray, useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { formatNumber } from '@/helpers/number-utils'
import {
    CashCountBatchFormValues,
    CashCountBatchSchema,
    ICashCount,
    ICashCountBatchRequest,
} from '@/modules/cash-count'
import { useUpdateBatchCashCounts } from '@/modules/transaction-batch/transaction-batch.service'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

type TFormValues = CashCountBatchFormValues

export interface IBatchCashCountFormProps
    extends IClassProps,
        IForm<
            Partial<ICashCountBatchRequest>,
            ICashCount[],
            Error,
            TFormValues
        > {}

const BatchCashCount = ({
    className,
    ...formProps
}: IBatchCashCountFormProps) => {
    const form = useForm<TFormValues>({
        resolver: standardSchemaResolver(CashCountBatchSchema),
        reValidateMode: 'onChange',
        mode: 'onChange',
        defaultValues: {
            cash_counts: [],
            deleted_cash_counts: [],
            ...formProps.defaultValues,
        },
    })

    const {
        mutate,
        isPending,
        error: rawError,
        reset,
    } = useUpdateBatchCashCounts({
        options: {
            onSuccess: (data) => {
                form.reset(formProps.defaultValues)
                formProps.onSuccess?.(data)
            },
            onError: formProps.onError,
        },
    })

    const { fields: cashCounts } = useFieldArray({
        control: form.control,
        name: 'cash_counts',
        keyName: 'fieldKey',
    })

    const watchedCashCounts = form.watch('cash_counts')

    const cashCountTotal = watchedCashCounts?.reduce(
        (sum, item) =>
            sum + Number(item.bill_amount || 0) * Number(item.quantity || 0),
        0
    )

    const grandTotal =
        cashCountTotal + Number(form.getValues('deposit_in_bank') || 0)

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TFormValues>({
            form,
            ...formProps,
            autoSave: false,
        })

    const onSubmit = form.handleSubmit((data) => {
        mutate({
            cash_counts: data.cash_counts.filter((entry) => entry.quantity > 0),
            deleted_cash_counts: [
                ...(data.deleted_cash_counts || []),
                ...data.cash_counts
                    .filter((entry) => entry.quantity === 0 && entry.id)
                    .map((entry) => entry.id as TEntityId),
            ],
            cash_count_total: cashCountTotal,
            grand_total: grandTotal,
        })
    }, handleFocusError)

    const error = serverRequestErrExtractor({ error: rawError })

    return (
        <Form {...form}>
            <form
                className={cn('space-y-1', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="grid gap-x-6 gap-y-4 rounded-xl overflow-clip bg-secondary dark:bg-popover sm:gap-y-3"
                    disabled={isPending || formProps.readOnly}
                >
                    <FormFieldWrapper
                        control={form.control}
                        name="cash_counts"
                        render={() => (
                            <div>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-left">
                                                Bill Amount
                                            </TableHead>
                                            <TableHead className="text-left">
                                                Quantity
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Subtotal
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {cashCounts.map((field, index) => (
                                            <TableRow
                                                className="border-none odd:bg-background/50 hover:bg-transparent odd:hover:bg-muted/50 odd:dark:bg-muted/50"
                                                key={field.fieldKey}
                                            >
                                                <TableCell className="h-fit py-1.5">
                                                    <FormFieldWrapper
                                                        control={form.control}
                                                        name={`cash_counts.${index}.name`}
                                                        render={({ field }) => (
                                                            <span>
                                                                {field.value}
                                                            </span>
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell className="h-fit py-1.5">
                                                    <FormFieldWrapper
                                                        control={form.control}
                                                        name={`cash_counts.${index}.quantity`}
                                                        render={({ field }) => (
                                                            <Input
                                                                {...field}
                                                                className="h-8 w-24"
                                                                disabled={isDisabled(
                                                                    `cash_counts.${index}.quantity` as Path<TFormValues>
                                                                )}
                                                                min={0}
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    const val =
                                                                        form.getValues(
                                                                            `cash_counts.${index}.bill_amount`
                                                                        )

                                                                    field.onChange(
                                                                        e
                                                                    )

                                                                    form.setValue(
                                                                        `cash_counts.${index}.amount`,
                                                                        e.target
                                                                            .value !==
                                                                            undefined
                                                                            ? val *
                                                                                  Number(
                                                                                      e
                                                                                          .target
                                                                                          .value
                                                                                  )
                                                                            : e
                                                                                  .target
                                                                                  .value
                                                                    )
                                                                }}
                                                                onKeyDown={(
                                                                    e
                                                                ) => {
                                                                    if (
                                                                        e.key ===
                                                                            '.' ||
                                                                        e.key ===
                                                                            'e' ||
                                                                        e.key ===
                                                                            '-'
                                                                    ) {
                                                                        e.preventDefault()
                                                                    }
                                                                }}
                                                                placeholder="qty"
                                                                step={1}
                                                                type="number"
                                                            />
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell className="h-fit py-1.5 text-right">
                                                    <span>
                                                        {formatNumber(
                                                            Number(
                                                                watchedCashCounts?.[
                                                                    index
                                                                ]
                                                                    ?.bill_amount ||
                                                                    0
                                                            ) *
                                                                Number(
                                                                    watchedCashCounts?.[
                                                                        index
                                                                    ]
                                                                        ?.quantity ||
                                                                        0
                                                                ),
                                                            2
                                                        )}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {cashCounts.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={3}>
                                                    <div className="flex flex-col items-center justify-center gap-y-4 py-8 text-xs text-muted-foreground/70">
                                                        <span>
                                                            No cash counts or
                                                            bills/coins does not
                                                            exist yet.
                                                        </span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    />
                </fieldset>

                <div className="rounded-xl bg-secondary py-2 dark:bg-popover">
                    <div className="flex items-center justify-between gap-x-2 px-4 py-1">
                        <p className="text-xs font-semibold text-muted-foreground/80">
                            Cash Count Total
                        </p>
                        <p className="text-xl">
                            {cashCountTotal.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </p>
                    </div>
                    <Separator className="bg-muted-foreground/10 dark:bg-background/80" />
                    <div className="flex items-center justify-between gap-x-3 px-4 py-1">
                        <p className="text-xs font-semibold text-muted-foreground/80">
                            Grand Total
                        </p>
                        <p className="text-xl text-primary">
                            {grandTotal.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </p>
                    </div>
                </div>
                {form.formState.isDirty && (
                    <FormFooterResetSubmit
                        disableSubmit={!form.formState.isDirty}
                        error={error}
                        isLoading={isPending}
                        onReset={() => {
                            form.reset()
                            reset()
                        }}
                        readOnly={formProps.readOnly}
                        submitText="Save Cashcount"
                    />
                )}
            </form>
        </Form>
    )
}

export default BatchCashCount
