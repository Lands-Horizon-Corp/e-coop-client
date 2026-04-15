import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import useActionSecurityStore from '@/store/action-security-store'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { InfoFillCircleIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import { useTimeMachineCancel } from '../time-machine-log.service'
import {
    ITimeMachineLog,
    TTimeMachineCancelRequest,
} from '../time-machine-log.types'
import { TIME_MACHINE_REASON_OPTIONS } from '../time-machine-log.utils'
import { TimeMachineCancelSchema } from '../time-machine-log.validation'

type TCancelTimeMachineFormValues = z.infer<typeof TimeMachineCancelSchema>

export interface ITimeMachineCancelFormProps
    extends
        IClassProps,
        IForm<
            Partial<TTimeMachineCancelRequest>,
            ITimeMachineLog,
            Error,
            TCancelTimeMachineFormValues
        > {
    userOrganizationId?: TEntityId
}

const TimeMachineCancelForm = ({
    className,
    ...formProps
}: ITimeMachineCancelFormProps) => {
    const form = useForm<TCancelTimeMachineFormValues>({
        resolver: standardSchemaResolver(TimeMachineCancelSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            reason: undefined,
            description: '',
            ...formProps.defaultValues,
        },
    })

    const { onOpenSecurityAction } = useActionSecurityStore()

    const cancelMutation = useTimeMachineCancel({
        options: {
            ...withToastCallbacks({
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TCancelTimeMachineFormValues>({
            form,
            autoSave: formProps.autoSave,
            readOnly: formProps.readOnly,
            hiddenFields: formProps.hiddenFields,
            disabledFields: formProps.disabledFields,
            defaultValues: formProps.defaultValues,
        })

    const onSubmit = form.handleSubmit((formData) => {
        onOpenSecurityAction({
            title: 'Time Machine Confirmation',
            description: 'Type password to cancel time machine.',
            onSuccess: () => {
                toast.promise(
                    cancelMutation.mutateAsync({
                        userOrganizationId: formProps.userOrganizationId,
                        ...formData,
                    }),
                    {
                        loading: 'Cancelling Time Machine...',
                        error: 'Error cancelling Time Machine',
                    }
                )
            },
        })
    }, handleFocusError)

    const { error: errorResponse, isPending, reset } = cancelMutation

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
                            label="Reason"
                            name="reason"
                            render={({ field }) => (
                                <Select
                                    onValueChange={(value) =>
                                        field.onChange(value)
                                    }
                                    value={field.value?.toString() || ''}
                                >
                                    <SelectTrigger className="h-11 w-full bg-card">
                                        <div className="flex min-w-0 items-center gap-2">
                                            <InfoFillCircleIcon className="size-4 shrink-0 text-muted-foreground" />
                                            <SelectValue
                                                className="min-w-0 flex-1 truncate text-left"
                                                placeholder="Select reason"
                                            />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TIME_MACHINE_REASON_OPTIONS.map(
                                            (value) => (
                                                <SelectItem
                                                    key={value}
                                                    value={value.toString()}
                                                >
                                                    {value}
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
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
                        />
                    </fieldset>
                </fieldset>
                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty || isPending}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                    readOnly={formProps.readOnly}
                    submitText={'Cancel Time Machine'}
                />
            </form>
        </Form>
    )
}

export const TimeMachineCancelFormModal = ({
    title = 'Cancel Time Machine',
    description = 'Fill out the form to cancel time machine.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<ITimeMachineCancelFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('min-w-fit!', className)}
            description={description}
            title={title}
            {...props}
        >
            <TimeMachineCancelForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default TimeMachineCancelFormModal
