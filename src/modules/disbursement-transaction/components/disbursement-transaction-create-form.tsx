import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import DisbursementCombobox from '@/modules/disbursement/components/disbursement-combobox'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import InfoTooltip from '@/components/tooltips/info-tooltip'
import { Checkbox } from '@/components/ui/checkbox'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm } from '@/types'

import {
    DisbursementTransactionSchema,
    IDisbursementTransaction,
    TDisbursementTransactionFormValue,
    useCreateDisbursementTransaction,
} from '../'

export interface IDisbursementTransactionFormProps
    extends IClassProps,
        IForm<
            Partial<TDisbursementTransactionFormValue>,
            IDisbursementTransaction,
            Error,
            TDisbursementTransactionFormValue
        > {}

const DisbursementTransactionCreateForm = ({
    className,
    ...formProps
}: IDisbursementTransactionFormProps) => {
    const form = useForm<TDisbursementTransactionFormValue>({
        resolver: standardSchemaResolver(DisbursementTransactionSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            disbursement_id: '',
            is_reference_number_checked: false,
            reference_number: '',
            amount: 0,
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateDisbursementTransaction({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TDisbursementTransactionFormValue>({
            form,
            ...formProps,
            autoSave: false,
        })

    const onSubmit = form.handleSubmit((formData) => {
        createMutation.mutate(formData)
    }, handleFocusError)

    const { error: rawError, isPending, reset } = createMutation

    const error = serverRequestErrExtractor({ error: rawError })

    return (
        <Form {...form}>
            <form
                className={cn('flex w-full flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="grid gap-x-6 gap-y-4 sm:gap-y-3"
                    disabled={isPending || formProps.readOnly}
                >
                    <fieldset className="space-y-3">
                        <FormFieldWrapper
                            control={form.control}
                            label={
                                <span>
                                    Disbursement Type *
                                    <InfoTooltip
                                        className="ml-1"
                                        content="Type of disbursement is required for creating a disbursement transaction"
                                    />
                                </span>
                            }
                            name="disbursement_id"
                            render={({ field }) => (
                                <DisbursementCombobox
                                    disabled={isDisabled(field.name)}
                                    onChange={(selected) => {
                                        field.onChange(selected.id)
                                    }}
                                    placeholder="Select disbursement type..."
                                    value={field.value}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Amount"
                            name="amount"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    min="0"
                                    placeholder="0.00"
                                    step="0.01"
                                    type="number"
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Reference Number"
                            name="reference_number"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Enter reference number"
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="is_reference_number_checked"
                            render={({ field }) => (
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        checked={field.value}
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        onCheckedChange={field.onChange}
                                    />
                                    <Label
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        htmlFor={field.name}
                                    >
                                        Reference number has been verified{' '}
                                        <InfoTooltip content="Always verify reference number of disbursement" />
                                    </Label>
                                </div>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Description"
                            name="description"
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Enter transaction description"
                                    rows={3}
                                />
                            )}
                        />
                    </fieldset>
                </fieldset>
                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                    readOnly={formProps.readOnly}
                    submitText="Create"
                />
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
            className={cn('max-w-lg', className)}
            description={description}
            title={title}
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
