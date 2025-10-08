import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

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
    LoanClearanceAnalysisInstitutionSchema,
    TLoanClearanceAnalysisInstitutionSchema,
} from '../../loan-clearance-analysis-institution.validation'

type TLoanClearanceAnalysisInstitutionFormValues =
    TLoanClearanceAnalysisInstitutionSchema & {
        fieldKey?: string
    }
type ILoanClearanceAnalysisInstitution =
    TLoanClearanceAnalysisInstitutionFormValues

export interface ILoanClearanceAnalysisInstitutionFormProps
    extends IClassProps,
        IForm<
            Partial<TLoanClearanceAnalysisInstitutionFormValues>,
            ILoanClearanceAnalysisInstitution,
            Error,
            TLoanClearanceAnalysisInstitutionFormValues
        > {
    loanTransactionId?: TEntityId
}

const LoanClearanceAnalysisInstitutionCreateUpdateForm = ({
    className,
    loanTransactionId,
    onSuccess,
    readOnly,
    ...formProps
}: ILoanClearanceAnalysisInstitutionFormProps) => {
    const form = useForm<TLoanClearanceAnalysisInstitutionFormValues>({
        resolver: standardSchemaResolver(
            LoanClearanceAnalysisInstitutionSchema
        ),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            loan_transaction_id: loanTransactionId,
            name: '',
            description: '',
            ...formProps.defaultValues,
        },
    })

    const { formRef, isDisabled } =
        useFormHelper<TLoanClearanceAnalysisInstitutionFormValues>({
            form,
            readOnly,
            autoSave: false,
        })

    const onSubmit = form.handleSubmit((formData, e) => {
        e?.stopPropagation()
        e?.preventDefault()
        onSuccess?.(formData)
        form.reset()
    })

    return (
        <Form {...form}>
            <form
                className={cn(
                    'flex w-full max-w-full min-w-0 flex-col gap-y-4',
                    className
                )}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <div className="space-y-4">
                    <FormFieldWrapper
                        control={form.control}
                        label="Institution Name"
                        name="name"
                        render={({ field }) => (
                            <Input
                                {...field}
                                disabled={isDisabled(field.name)}
                                id={field.name}
                                placeholder="Institution name"
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Description"
                        name="description"
                        render={({ field }) => (
                            <Textarea
                                {...field}
                                disabled={isDisabled(field.name)}
                                id={field.name}
                                placeholder="Institution description"
                                rows={3}
                            />
                        )}
                    />
                </div>

                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty}
                    onReset={() => {
                        form.reset()
                    }}
                    onSubmit={(e) => onSubmit(e)}
                    readOnly={readOnly}
                    resetButtonType="button"
                    submitButtonType="button"
                    submitText={
                        formProps.defaultValues?.fieldKey ? 'Update' : 'Create'
                    }
                />
            </form>
        </Form>
    )
}

export const LoanClearanceAnalysisInstitutionCreateUpdateModal = ({
    title = 'Add Institution',
    description = 'Add a new institution entry.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: ILoanClearanceAnalysisInstitutionFormProps
}) => {
    return (
        <Modal
            className={cn('!max-w-lg', className)}
            description={description}
            title={title}
            {...props}
        >
            <LoanClearanceAnalysisInstitutionCreateUpdateForm
                {...formProps}
                onSuccess={(institution) => {
                    formProps?.onSuccess?.(institution)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default LoanClearanceAnalysisInstitutionCreateUpdateForm
