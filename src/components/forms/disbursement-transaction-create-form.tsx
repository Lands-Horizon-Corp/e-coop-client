import z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { Path, useForm } from 'react-hook-form'

import DisbursementCombobox from '@/components/comboboxes/disbursement-combobox'
import Modal, { IModalProps } from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

import { cn } from '@/lib/utils'

import { disbursementTransactionSchema } from '@/validations/form-validation/disbursement-transaction-schema'

import { useCreateDisbursement } from '@/hooks/api-hooks/use-disbursement-transaction'
import { useAlertBeforeClosing } from '@/hooks/use-alert-before-closing'

import {
    IClassProps,
    IDisbursementTransaction,
    IDisbursementTransactionRequest,
    IForm,
} from '@/types'

type TDisbursementTransactionFormValues = z.infer<
    typeof disbursementTransactionSchema
>

export interface IDisbursementTransactionFormProps
    extends IClassProps,
        IForm<
            Partial<IDisbursementTransactionRequest>,
            IDisbursementTransaction,
            string,
            TDisbursementTransactionFormValues
        > {}

const DisbursementTransactionCreateForm = ({
    readOnly,
    className,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
}: IDisbursementTransactionFormProps) => {
    const form = useForm<TDisbursementTransactionFormValues>({
        resolver: zodResolver(disbursementTransactionSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            disbursement_id: '',
            description: '',
            is_reference_number_checked: false,
            reference_number: '',
            amount: 0,
            ...defaultValues,
        },
    })

    const createMutation = useCreateDisbursement({ onSuccess, onError })

    const onSubmit = form.handleSubmit((formData) => {
        createMutation.mutate(formData)
    })

    const { error, isPending, reset } = createMutation

    const isDisabled = (field: Path<TDisbursementTransactionFormValues>) =>
        readOnly || disabledFields?.includes(field) || false

    const isDirty = Object.keys(form.formState.dirtyFields).length > 0

    useAlertBeforeClosing(isDirty)

    return (
        <Form {...form}>
            <form
                onSubmit={onSubmit}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isPending || readOnly}
                    className="grid gap-x-6 gap-y-4 sm:gap-y-3"
                >
                    <fieldset className="space-y-3">
                        <FormFieldWrapper
                            control={form.control}
                            name="disbursement_id"
                            label="Disbursement Type"
                            render={({ field }) => (
                                <DisbursementCombobox
                                    value={field.value}
                                    disabled={isDisabled(field.name)}
                                    placeholder="Select disbursement type..."
                                    onChange={(selected) => {
                                        field.onChange(selected.id)
                                    }}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="amount"
                            label="Amount"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="reference_number"
                            label="Reference Number"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Enter reference number"
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="is_reference_number_checked"
                            render={({ field }) => (
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id={field.name}
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={isDisabled(field.name)}
                                    />
                                    <Label
                                        htmlFor={field.name}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Reference number has been verified
                                    </Label>
                                </div>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="description"
                            label="Description"
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    id={field.name}
                                    autoComplete="off"
                                    placeholder="Enter transaction description"
                                    disabled={isDisabled(field.name)}
                                    rows={3}
                                />
                            )}
                        />
                    </fieldset>
                </fieldset>
                <Separator />
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
                        >
                            Reset
                        </Button>
                        <Button
                            size="sm"
                            type="submit"
                            disabled={isPending}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            {isPending ? (
                                <LoadingSpinner />
                            ) : (
                                'Create Transaction'
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}

export const DisbursementTransactionCreateFormModal = ({
    title = 'Create Disbursement Transaction',
    description = 'Fill out the form to create a new disbursement transaction.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IDisbursementTransactionFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('max-w-lg', className)}
            {...props}
        >
            <DisbursementTransactionCreateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default DisbursementTransactionCreateForm
