import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    useCreateLoanClearanceAnalysis,
    useUpdateLoanClearanceAnalysisById,
} from '../..'
import {
    ILoanClearanceAnalysis,
    ILoanClearanceAnalysisRequest,
} from '../../loan-clearance-analysis.types'
import {
    LoanClearanceAnalysisSchema,
    TLoanClearanceAnalysisSchema,
} from '../../loan-clearance-analysis.validation'

export interface ILoanClearanceAnalysisFormProps
    extends IClassProps,
        IForm<
            Partial<ILoanClearanceAnalysisRequest>,
            ILoanClearanceAnalysis,
            Error,
            TLoanClearanceAnalysisSchema
        > {
    loanClearanceAnalysisId?: TEntityId
    loanTransactionId: TEntityId
}

const LoanClearanceAnalysisCreateUpdateForm = ({
    className,
    loanTransactionId,
    ...formProps
}: ILoanClearanceAnalysisFormProps) => {
    const form = useForm<TLoanClearanceAnalysisSchema>({
        resolver: standardSchemaResolver(LoanClearanceAnalysisSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            loan_transaction_id: loanTransactionId, // Set the required loan transaction id
            regular_deduction_description: '',
            regular_deduction_amount: undefined,
            balances_description: '',
            balances_amount: undefined,
            balances_count: undefined,
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateLoanClearanceAnalysis({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Loan Clearance Analysis Created',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const updateMutation = useUpdateLoanClearanceAnalysisById({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Loan Clearance Analysis updated',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TLoanClearanceAnalysisSchema>({
            form,
            readOnly: formProps.readOnly,
            hiddenFields: formProps.hiddenFields,
            disabledFields: formProps.disabledFields,
            defaultValues: formProps.defaultValues,
            autoSave: false,
        })

    const onSubmit = form.handleSubmit((formData) => {
        if (formProps.loanClearanceAnalysisId) {
            updateMutation.mutate({
                id: formProps.loanClearanceAnalysisId,
                payload: formData,
            })
        } else {
            createMutation.mutate(formData)
        }
    }, handleFocusError)

    const {
        error: errorResponse,
        isPending,
        reset,
    } = formProps.loanClearanceAnalysisId ? updateMutation : createMutation

    const error = serverRequestErrExtractor({ error: errorResponse })

    return (
        <Form {...form}>
            <form
                ref={formRef}
                onSubmit={onSubmit}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isPending || formProps.readOnly}
                    className="grid gap-x-6 gap-y-4 sm:gap-y-3"
                >
                    <fieldset className="space-y-3">
                        <FormFieldWrapper
                            control={form.control}
                            name="regular_deduction_description"
                            label="Regular Deduction Description"
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    id={field.name}
                                    placeholder="Regular Deduction Description"
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="regular_deduction_amount"
                            label="Regular Deduction Amount"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="balances_description"
                            label="Balances Description"
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    id={field.name}
                                    placeholder="Balances Description"
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="balances_amount"
                            label="Balances Amount"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="balances_count"
                            label="Balances Count"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="number"
                                    step="1"
                                    placeholder="0"
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                    </fieldset>
                </fieldset>

                <FormFooterResetSubmit
                    error={error}
                    readOnly={formProps.readOnly}
                    isLoading={isPending}
                    disableSubmit={!form.formState.isDirty}
                    submitText={
                        formProps.loanClearanceAnalysisId ? 'Update' : 'Create'
                    }
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                />
            </form>
        </Form>
    )
}

export const LoanClearanceAnalysisCreateUpdateFormModal = ({
    title = 'Create Loan Clearance Analysis',
    description = 'Fill out the form to add a new loan clearance analysis.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<ILoanClearanceAnalysisFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <LoanClearanceAnalysisCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default LoanClearanceAnalysisCreateUpdateForm
