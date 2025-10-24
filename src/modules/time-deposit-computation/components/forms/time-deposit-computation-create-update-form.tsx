import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    useCreateTimeDepositComputation,
    useUpdateTimeDepositComputationById,
} from '../../time-deposit-computation.service'
import {
    ITimeDepositComputation,
    ITimeDepositComputationRequest,
} from '../../time-deposit-computation.types'
import { timeDepositComputationSchema } from '../../time-deposit-computation.validation'

type TTimeDepositComputationFormValues = z.infer<
    typeof timeDepositComputationSchema
>

export interface ITimeDepositComputationFormProps
    extends IClassProps,
        IForm<
            Partial<ITimeDepositComputationRequest>,
            ITimeDepositComputation,
            Error,
            TTimeDepositComputationFormValues
        > {
    timeDepositComputationId?: TEntityId
}

const TimeDepositComputationCreateUpdateForm = ({
    className,
    ...formProps
}: ITimeDepositComputationFormProps) => {
    const form = useForm<TTimeDepositComputationFormValues>({
        resolver: standardSchemaResolver(timeDepositComputationSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateTimeDepositComputation({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Time Deposit Computation Created',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })
    const updateMutation = useUpdateTimeDepositComputationById({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Time Deposit Computation updated',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError } =
        useFormHelper<TTimeDepositComputationFormValues>({
            form,
            autoSave: formProps.autoSave,
            readOnly: formProps.readOnly,
            hiddenFields: formProps.hiddenFields,
            disabledFields: formProps.disabledFields,
            defaultValues: formProps.defaultValues,
        })

    const onSubmit = form.handleSubmit((formData) => {
        if (formProps.timeDepositComputationId) {
            updateMutation.mutate({
                id: formProps.timeDepositComputationId,
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
    } = formProps.timeDepositComputationId ? updateMutation : createMutation

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
                        {/* <FormFieldWrapper
                            control={form.control}
                            label="Time Deposit Computation Name"
                            name="name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Time Deposit Computation Name"
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
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Description"
                                />
                            )}
                        /> */}
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
                    submitText={
                        formProps.timeDepositComputationId ? 'Update' : 'Create'
                    }
                />
            </form>
        </Form>
    )
}

export const TimeDepositComputationCreateUpdateFormModal = ({
    title = 'Create Time Deposit Computation',
    description = 'Fill out the form to add a new time deposit computation.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<ITimeDepositComputationFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('', className)}
            description={description}
            title={title}
            {...props}
        >
            <TimeDepositComputationCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default TimeDepositComputationCreateUpdateForm
