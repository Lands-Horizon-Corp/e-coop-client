import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { CurrencyInput } from '@/modules/currency'
import {
    IFinancialStatementAccountGrouping,
    IFinancialStatementAccountGroupingRequest,
    TFinancialStatementGroupingFormValues,
    financialStatementGroupingSchema,
    useUpdateById,
} from '@/modules/financial-statement-account-grouping'

import Modal, { IModalProps } from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

export interface IFinancialStatementGroupingFormProps
    extends IClassProps,
        IForm<
            Partial<IFinancialStatementAccountGroupingRequest>,
            IFinancialStatementAccountGrouping,
            string,
            TFinancialStatementGroupingFormValues
        > {
    groupingId?: TEntityId
}

const FinancialStatementAccountsGroupingUpdateForm = ({
    groupingId,
    readOnly,
    className,
    defaultValues,
    disabledFields,
    onSuccess,
    ...formProps
}: IFinancialStatementGroupingFormProps) => {
    const form = useForm<TFinancialStatementGroupingFormValues>({
        resolver: standardSchemaResolver(financialStatementGroupingSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            ...defaultValues,
        },
    })

    const updateMutation = useUpdateById({
        options: {
            onSuccess: (data) => {
                onSuccess?.(data)
                toast.success(
                    'Financial statement grouping updated successfully'
                )
            },
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TFinancialStatementGroupingFormValues>({
            form,
            ...formProps,
            readOnly,
            disabledFields,
        })

    const onSubmit = form.handleSubmit(
        (formData: TFinancialStatementGroupingFormValues) => {
            if (groupingId) {
                updateMutation.mutate({
                    id: groupingId,
                    payload: formData,
                })
            }
        },
        handleFocusError
    )

    const { error, isPending, reset } = updateMutation

    const errorMessage = serverRequestErrExtractor({ error })

    return (
        <Form {...form}>
            <form
                className={cn('flex w-full flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="grid gap-x-6 gap-y-4 sm:gap-y-3"
                    disabled={isPending || readOnly}
                >
                    <FormFieldWrapper
                        control={form.control}
                        label="Name"
                        name="name"
                        render={({ field }) => (
                            <Input
                                {...field}
                                autoComplete="off"
                                disabled={isDisabled(field.name)}
                                id={field.name}
                                placeholder="Group Name"
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        label="Description"
                        name="description"
                        render={({ field }) => (
                            <Input
                                {...field}
                                autoComplete="off"
                                disabled={isDisabled(field.name)}
                                id={field.name}
                                placeholder="Description"
                            />
                        )}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                        <FormFieldWrapper
                            control={form.control}
                            label="Debit"
                            name="debit"
                            render={({ field: { onChange, ...field } }) => (
                                <CurrencyInput
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    onValueChange={(newValue = '') => {
                                        onChange(newValue)
                                    }}
                                    placeholder="Debit"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Credit"
                            name="credit"
                            render={({ field: { onChange, ...field } }) => (
                                <CurrencyInput
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    onValueChange={(newValue = '') => {
                                        onChange(newValue)
                                    }}
                                    placeholder="Credit"
                                />
                            )}
                        />
                    </div>
                </fieldset>
                {!readOnly && (
                    <>
                        <Separator />
                        <div className="space-y-2">
                            <FormErrorMessage errorMessage={errorMessage} />
                            <div className="flex items-center justify-end gap-x-2">
                                <Button
                                    className="w-full sm:w-fit px-8"
                                    onClick={() => {
                                        form.reset()
                                        reset()
                                    }}
                                    size="sm"
                                    type="button"
                                    variant="ghost"
                                >
                                    Reset
                                </Button>
                                <Button
                                    className="w-full sm:w-fit px-8"
                                    disabled={isPending}
                                    size="sm"
                                    type="submit"
                                >
                                    {isPending ? (
                                        <LoadingSpinner />
                                    ) : groupingId ? (
                                        'Update'
                                    ) : (
                                        'Create'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </form>
        </Form>
    )
}

const FinancialStatementAccountGroupingUpdateModal = ({
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IFinancialStatementGroupingFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('shadow-none', className)}
            overlayClassName="!bg-transparent backdrop-blur-sm"
            {...props}
        >
            <FinancialStatementAccountsGroupingUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default FinancialStatementAccountGroupingUpdateModal
