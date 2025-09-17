import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
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
                ref={formRef}
                onSubmit={onSubmit}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isPending || readOnly}
                    className="grid gap-x-6 gap-y-4 sm:gap-y-3"
                >
                    <FormFieldWrapper
                        control={form.control}
                        name="name"
                        label="Name"
                        render={({ field }) => (
                            <Input
                                {...field}
                                id={field.name}
                                placeholder="Group Name"
                                autoComplete="off"
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="description"
                        label="Description"
                        render={({ field }) => (
                            <Input
                                {...field}
                                id={field.name}
                                placeholder="Description"
                                autoComplete="off"
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                        <FormFieldWrapper
                            control={form.control}
                            name="debit"
                            label="Debit"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="debit"
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="credit"
                            label="Credit"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    onChange={(e) => {
                                        field.onChange(parseInt(e.target.value))
                                    }}
                                    placeholder="credit"
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
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
                                    size="sm"
                                    type="button"
                                    variant="ghost"
                                    onClick={() => {
                                        form.reset()
                                        reset()
                                    }}
                                    className="w-full sm:w-fit px-8"
                                >
                                    Reset
                                </Button>
                                <Button
                                    size="sm"
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full sm:w-fit px-8"
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
