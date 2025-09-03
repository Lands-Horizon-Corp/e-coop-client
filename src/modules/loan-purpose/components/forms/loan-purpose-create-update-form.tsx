import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'

import IconCombobox from '@/components/comboboxes/icon-combobox'
import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { TIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import TextEditor from '@/components/text-editor'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    useCreateLoanPurpose,
    useUpdateLoanPurposeById,
} from '../../loan-purpose.service'
import { ILoanPurpose, ILoanPurposeRequest } from '../../loan-purpose.types'
import {
    LoanPurposeSchema,
    TLoanPurposeSchema,
} from '../../loan-purpose.validation'

export interface ILoanPurposeFormProps
    extends IClassProps,
        IForm<Partial<ILoanPurposeRequest>, ILoanPurpose, Error> {
    loanPurposeId?: TEntityId
}

const LoanPurposeCreateUpdateForm = ({
    loanPurposeId,
    className,
    ...formProps
}: ILoanPurposeFormProps) => {
    const form = useForm<TLoanPurposeSchema>({
        resolver: standardSchemaResolver(LoanPurposeSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            icon: '',
            description: '',
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateLoanPurpose({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Created',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })
    const updateMutation = useUpdateLoanPurposeById({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Updated',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TLoanPurposeSchema>({
            form,
            ...formProps,
            autoSave: !!loanPurposeId,
        })

    const onSubmit = form.handleSubmit((payload) => {
        if (loanPurposeId) {
            updateMutation.mutate({ id: loanPurposeId, payload })
        } else {
            createMutation.mutate(payload)
        }
    }, handleFocusError)

    const {
        error: rawError,
        isPending,
        reset,
    } = loanPurposeId ? updateMutation : createMutation

    const error = serverRequestErrExtractor({ error: rawError })

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
                            name="icon"
                            label="Icon"
                            render={({ field }) => (
                                <IconCombobox
                                    {...field}
                                    value={field.value as TIcon}
                                    placeholder="Select purpose icon"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="description"
                            label="Description"
                            render={({ field }) => (
                                <TextEditor
                                    {...field}
                                    content={field.value}
                                    placeholder="Description"
                                    disabled={isDisabled(field.name)}
                                    textEditorClassName="bg-background"
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
                    submitText={loanPurposeId ? 'Update' : 'Create'}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                />
            </form>
        </Form>
    )
}

export const LoanPurposeCreateUpdateFormModal = ({
    title = 'Create Loan Purpose',
    description = 'Fill out the form to add a new loan purpose.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<ILoanPurposeFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <LoanPurposeCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default LoanPurposeCreateUpdateForm
