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
import { Input } from '@/components/ui/input'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    useCreateLoanStatus,
    useUpdateLoanStatusById,
} from '../../loan-status.service'
import { ILoanStatus, ILoanStatusRequest } from '../../loan-status.types'
import {
    LoanStatusSchema,
    TLoanStatusSchema,
} from '../../loan-status.validation'

export interface ILoanStatusFormProps
    extends IClassProps,
        IForm<Partial<ILoanStatusRequest>, ILoanStatus, Error> {
    loanStatusId?: TEntityId
}

const LoanStatusCreateUpdateForm = ({
    loanStatusId,
    className,
    ...formProps
}: ILoanStatusFormProps) => {
    const form = useForm<TLoanStatusSchema>({
        resolver: standardSchemaResolver(LoanStatusSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            icon: '',
            color: '',
            description: '',
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateLoanStatus({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Loan Status Created',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })
    const updateMutation = useUpdateLoanStatusById({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Loan Status Updated',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TLoanStatusSchema>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((payload) => {
        if (loanStatusId) {
            updateMutation.mutate({ id: loanStatusId, payload })
        } else {
            createMutation.mutate(payload)
        }
    }, handleFocusError)

    const {
        error: rawError,
        isPending,
        reset,
    } = loanStatusId ? updateMutation : createMutation

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
                            name="name"
                            label="Name *"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Loan Status Name"
                                    autoComplete="loan-status-name"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <div className="grid gap-x-2 md:grid-cols-2">
                            <FormFieldWrapper
                                control={form.control}
                                name="icon"
                                label="Icon *"
                                render={({ field }) => (
                                    <IconCombobox
                                        {...field}
                                        value={field.value as TIcon}
                                        placeholder="Select status icon"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="color"
                                label={'color'}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="color"
                                        id={field.name}
                                        placeholder="Color"
                                        autoComplete="loan-status-color"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                        </div>
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
                    submitText={loanStatusId ? 'Update' : 'Create'}
                    onReset={() => {
                        form.reset()
                        reset?.()
                    }}
                />
            </form>
        </Form>
    )
}

export const LoanStatusCreateUpdateFormModal = ({
    title = 'Create Loan Status',
    description = 'Fill out the form to add a new loan status.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<ILoanStatusFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <LoanStatusCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default LoanStatusCreateUpdateForm
