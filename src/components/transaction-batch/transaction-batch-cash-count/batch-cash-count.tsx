import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { formatNumber } from '@/utils'
import { useFieldArray, useForm } from 'react-hook-form'

import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
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

import { cashCountBatchSchema } from '@/validations/form-validation/cash-count-schema'

import { useUpdateBatchCashCounts } from '@/hooks/api-hooks/use-cash-count'
import { useFormHelper } from '@/hooks/use-form-helper'

import {
    ICashCount,
    ICashCountBatchRequest,
    IClassProps,
    IForm,
    TEntityId,
} from '@/types'

type TFormValues = z.infer<typeof cashCountBatchSchema>

export interface IBatchCashCountFormProps
    extends IClassProps,
        IForm<
            Partial<ICashCountBatchRequest>,
            ICashCount[],
            string,
            TFormValues
        > {}

const BatchCashCount = ({
    defaultValues,
    onSuccess,
    onError,
    ...other
}: IBatchCashCountFormProps) => {
    const form = useForm<TFormValues>({
        resolver: zodResolver(cashCountBatchSchema),
        reValidateMode: 'onChange',
        mode: 'onChange',
        defaultValues: {
            cash_counts: [],
            deleted_cash_counts: [],
            ...defaultValues,
        },
    })

    const { mutate, isPending, error, reset } = useUpdateBatchCashCounts({
        onSuccess: (data) => {
            form.reset(defaultValues)
            onSuccess?.(data)
        },
        onError,
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
    })

    useFormHelper<ICashCountBatchRequest>({ form, defaultValues, ...other })

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-1">
                <fieldset
                    disabled={isPending || other.readOnly}
                    className="grid gap-x-6 gap-y-4 rounded-xl bg-secondary dark:bg-popover sm:gap-y-3"
                >
                    <FormFieldWrapper
                        name="cash_counts"
                        control={form.control}
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
                                                key={field.fieldKey}
                                                className="border-none odd:bg-background/50 hover:bg-transparent odd:hover:bg-muted/50 odd:dark:bg-muted/50"
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
                                                                disabled={
                                                                    other.readOnly
                                                                }
                                                                min={0}
                                                                step={1}
                                                                type="number"
                                                                className="h-8 w-24"
                                                                placeholder="qty"
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
                    <div className="space-y-2">
                        <FormErrorMessage errorMessage={error} />
                        <div className="flex items-center justify-end gap-x-2">
                            <Button
                                size="sm"
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                    form.reset()
                                    reset()
                                }}
                                className="w-full self-end px-8 sm:w-fit"
                                disabled={isPending || !form.formState.isDirty}
                            >
                                Reset
                            </Button>
                            <Button
                                size="sm"
                                type="submit"
                                disabled={isPending || !form.formState.isDirty}
                                className="w-full self-end px-8 sm:w-fit"
                            >
                                {isPending ? (
                                    <LoadingSpinner />
                                ) : (
                                    'Save Cashcount'
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </form>
        </Form>
    )
}

export default BatchCashCount
