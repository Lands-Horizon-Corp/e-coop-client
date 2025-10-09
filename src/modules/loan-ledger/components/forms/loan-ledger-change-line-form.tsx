import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import { useChangeLoanLedgerLineNumber } from '../../loan-ledger.service'
import {
    ILoanLedger,
    ILoanLedgerChangeLineRequest,
} from '../../loan-ledger.types'
import {
    LoanLedgerChangeLineSchema,
    TLoanLedgerChangeLineSchema,
} from '../../loan-ledger.validation'

export interface ILoanLedgerChangeLineFormProps
    extends IClassProps,
        IForm<
            Partial<ILoanLedgerChangeLineRequest>,
            ILoanLedger,
            Error,
            TLoanLedgerChangeLineSchema
        > {
    loanLedgerId?: TEntityId
}

const LoanLedgerChangeLineForm = ({
    className,
    ...formProps
}: ILoanLedgerChangeLineFormProps) => {
    const form = useForm<TLoanLedgerChangeLineSchema>({
        resolver: standardSchemaResolver(LoanLedgerChangeLineSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            line_number: 0,
            ...formProps.defaultValues,
        },
    })
    const changeLineMutation = useChangeLoanLedgerLineNumber({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Line number changed',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })
    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TLoanLedgerChangeLineSchema>({
            form,
            autoSave: formProps.autoSave,
            readOnly: formProps.readOnly,
            hiddenFields: formProps.hiddenFields,
            disabledFields: formProps.disabledFields,
            defaultValues: formProps.defaultValues,
        })

    const onSubmit = form.handleSubmit(async (formData) => {
        if (!formProps.loanLedgerId)
            return toast.warning('Missing loan ledger ID')

        toast.promise(
            changeLineMutation.mutateAsync({
                id: formProps.loanLedgerId,
                payload: formData,
            }),
            {
                loading: 'Changing line number...',
                success: 'Line number changed',
                error: 'Error changing line number',
            }
        )
    }, handleFocusError)

    const { error: errorResponse, isPending, reset } = changeLineMutation

    const error = serverRequestErrExtractor({ error: errorResponse })
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
                            label="Line Number"
                            name="line_number"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Enter new line number"
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
                    submitText={'Change Line'}
                />
            </form>
        </Form>
    )
}

export const LoanLedgerChangeLineFormModal = ({
    title = 'Change Line Number',
    description = 'Update the line number for this loan ledger entry. This changes the area where the record is printed on the passbook.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<ILoanLedgerChangeLineFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('', className)}
            description={description}
            title={title}
            {...props}
        >
            <LoanLedgerChangeLineForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default LoanLedgerChangeLineForm
