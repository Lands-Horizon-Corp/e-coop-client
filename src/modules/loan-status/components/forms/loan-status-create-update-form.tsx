import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'

import IconCombobox from '@/components/comboboxes/icon-combobox'
import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { TIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

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
                            label="Name *"
                            name="name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="loan-status-name"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Loan Status Name"
                                />
                            )}
                        />
                        <div className="grid gap-x-2 md:grid-cols-2">
                            <FormFieldWrapper
                                control={form.control}
                                label="Icon *"
                                name="icon"
                                render={({ field }) => (
                                    <IconCombobox
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        placeholder="Select status icon"
                                        value={field.value as TIcon}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label={'color'}
                                name="color"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        autoComplete="loan-status-color"
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        placeholder="Color"
                                        type="color"
                                    />
                                )}
                            />
                        </div>
                        <FormFieldWrapper
                            control={form.control}
                            label="Description"
                            name="description"
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    content={field.value}
                                    disabled={isDisabled(field.name)}
                                    placeholder="Description"
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
                        reset?.()
                    }}
                    readOnly={formProps.readOnly}
                    submitText={loanStatusId ? 'Update' : 'Create'}
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
            className={cn('', className)}
            description={description}
            title={title}
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
