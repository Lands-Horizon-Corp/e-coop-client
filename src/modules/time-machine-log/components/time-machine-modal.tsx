import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { useGetById } from '@/modules/user-organization'
import useActionSecurityStore from '@/store/action-security-store'

import TimezoneCombobox from '@/components/comboboxes/timezone-combobox'
import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { InfoFillCircleIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

import { IClassProps, IForm, TEntityId } from '@/types'

import { useCreateTimeMachine } from '../time-machine-log.service'
import {
    ITimeMachineLog,
    TTimeMachineCancelRequest,
} from '../time-machine-log.types'
import {
    TIME_MACHINE_REASON_OPTIONS,
    TTimeMachineReasonOption,
} from '../time-machine-log.utils'
import { TimeMachineLogSchema } from '../time-machine-log.validation'
import TimeMachineCancelFormModal from './cancel-time-machine-modal'
import TimeLeft from './time-left'
import TimeMachineLogsList from './time-machine-log-list'

type TTimeMachineFormValues = z.infer<typeof TimeMachineLogSchema>

export interface ITimeMachineCancelFormProps
    extends
        IClassProps,
        IForm<
            Partial<TTimeMachineCancelRequest>,
            ITimeMachineLog,
            Error,
            TTimeMachineFormValues
        > {
    reason?: TTimeMachineReasonOption
    description?: string
    frozenAt?: string
}

const TimeMachineForm = ({
    className,
    userOrganizationId,
    description,
    reason,
    frozenAt,
    ...formProps
}: ITimeMachineCancelFormProps & { userOrganizationId: string }) => {
    const timeMachineCancel = useModalState()

    const userOrgId = userOrganizationId

    const { onOpenSecurityAction } = useActionSecurityStore()

    const { data: userOrganization, refetch } = useGetById({
        id: userOrganizationId,
        options: {
            enabled: !!userOrganizationId,
        },
    })

    const hasCurrentTimeMachine = !!userOrganization?.time_machine_time

    useSubscribe(
        'time_machine_log',
        `update.${userOrganization?.time_machine_log_id}`,
        () => {}
    )

    const form = useForm<TTimeMachineFormValues>({
        resolver: standardSchemaResolver(TimeMachineLogSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            reason: reason,
            frozen_until_seconds: 3600,
            description: description,
            frozen_at: frozenAt || new Date().toISOString(),
            ...formProps.defaultValues,
        },
    })

    const timeMachineMutation = useCreateTimeMachine({
        options: {
            ...withToastCallbacks({
                onSuccess: (data) => {
                    formProps.onSuccess?.(data)
                    refetch()
                },
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TTimeMachineFormValues>({
            form,
            autoSave: formProps.autoSave,
            readOnly: formProps.readOnly,
            hiddenFields: formProps.hiddenFields,
            disabledFields: hasCurrentTimeMachine
                ? [
                      ...(formProps.disabledFields || []),
                      'frozen_at',
                      'description',
                      'frozen_until_seconds',
                      'reason',
                  ]
                : formProps.disabledFields,
            defaultValues: formProps.defaultValues,
        })

    const onSubmit = form.handleSubmit((formData) => {
        onOpenSecurityAction({
            title: 'Time Machine Confirmation',
            description: 'Type password to implement time machine.',
            onSuccess: () => {
                toast.promise(
                    timeMachineMutation.mutateAsync({
                        userOrganizationId: userOrgId,
                        ...formData,
                        frozen_at: new Date(formData.frozen_at).toISOString(),
                    }),
                    {
                        loading: 'Creating Time Machine...',
                        error: 'Failed to create Time machine',
                    }
                )
            },
        })
    }, handleFocusError)

    const { error: errorResponse, isPending, reset } = timeMachineMutation

    const error = serverRequestErrExtractor({ error: errorResponse })

    const frozenAtValue = userOrganization?.time_machine_time

    const frozenAtInput = form.watch('frozen_at')
    const frozenUntilSeconds = form.watch('frozen_until_seconds')
    const serverFrozenUntil = userOrganization?.time_machine_log?.frozen_until

    return (
        <div className="flex space-x-5  max-h-[80vh] min-w-[70vw] m-2">
            <TimeMachineLogsList userOrganizationId={userOrgId} />
            <div className="flex flex-col w-1/2 space-y-5">
                <Form {...form}>
                    <TimeMachineCancelFormModal
                        {...timeMachineCancel}
                        formProps={{
                            userOrganizationId: userOrgId,
                            onSuccess: () => {
                                refetch()
                                form.reset()
                            },
                        }}
                    />

                    <form
                        className={cn(
                            'flex bg-background border rounded-2xl p-5 w-full flex-col gap-y-4',
                            className
                        )}
                        onSubmit={onSubmit}
                        ref={formRef}
                    >
                        <TimeLeft
                            frozenAtInput={frozenAtInput}
                            frozenAtValue={frozenAtValue}
                            frozenUntilSeconds={frozenUntilSeconds}
                            serverFrozenUntil={serverFrozenUntil}
                            timezone={form.watch('timezone')}
                        />

                        <fieldset
                            className="grid gap-x-6 gap-y-4 sm:gap-y-3"
                            disabled={isPending || formProps.readOnly}
                        >
                            <fieldset className="space-y-3">
                                <FormFieldWrapper
                                    control={form.control}
                                    label={
                                        <>
                                            Date Time Machine{' '}
                                            <span className="text-muted-foreground">
                                                MM / dd / yyyy, hh:mm
                                            </span>
                                        </>
                                    }
                                    labelClassName="flex justify-between items-end"
                                    name="frozen_at"
                                    render={({ field }) => {
                                        const localValue = field.value
                                            ? new Date(field.value)
                                                  .toLocaleString('sv-SE', {
                                                      hour12: false,
                                                  })
                                                  .replace(' ', 'T')
                                                  .slice(0, 16)
                                            : ''

                                        return (
                                            <InputDate
                                                {...field}
                                                autoComplete="off"
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                                id={field.name}
                                                placeholder="Date"
                                                type="datetime-local"
                                                value={localValue}
                                            />
                                        )
                                    }}
                                />
                                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                    <FormFieldWrapper
                                        control={form.control}
                                        label="Timezone"
                                        name="timezone"
                                        render={({ field }) => (
                                            <TimezoneCombobox
                                                className="bg-card"
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                                id={field.name}
                                                onChange={field.onChange}
                                                value={field.value}
                                            />
                                        )}
                                    />

                                    <FormFieldWrapper
                                        control={form.control}
                                        label={<>Frozen until (seconds) </>}
                                        name="frozen_until_seconds"
                                        render={({ field }) => (
                                            <>
                                                <Input
                                                    {...field}
                                                    autoComplete="off"
                                                    disabled={isDisabled(
                                                        field.name
                                                    )}
                                                    id={field.name}
                                                    placeholder="Frozen until in seconds"
                                                    type="number"
                                                />
                                                <div className="">
                                                    <span className="text-muted-foreground text-xs">
                                                        (Optional, default is 0
                                                        for indefinite)
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    />
                                </div>

                                <FormFieldWrapper
                                    control={form.control}
                                    label="Reason"
                                    name="reason"
                                    render={({ field }) => (
                                        <Select
                                            disabled={isDisabled(field.name)}
                                            onValueChange={(value) =>
                                                field.onChange(value)
                                            }
                                            value={
                                                field.value?.toString() || ''
                                            }
                                        >
                                            <SelectTrigger className="h-11 min-w-full max-w-[460px]! bg-card overflow-hidden">
                                                <div className="flex min-w-0 items-center gap-2 overflow-hidden">
                                                    <InfoFillCircleIcon className="size-4 shrink-0 text-muted-foreground" />
                                                    <div className="min-w-0 flex-1 overflow-hidden text-ellipsis">
                                                        <SelectValue placeholder="Select reason" />
                                                    </div>
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
                            disableSubmit={isPending || !!frozenAtValue}
                            error={error}
                            isLoading={isPending}
                            onReset={() => {
                                form.reset()
                                reset()
                            }}
                            readOnly={formProps.readOnly}
                            submitText={'Proceed'}
                        />
                    </form>
                </Form>
                <Button
                    disabled={!frozenAtValue}
                    onClick={() => timeMachineCancel.openModal()}
                    type="button"
                    variant="outline"
                >
                    Cancel Time Machine
                </Button>
            </div>
        </div>
    )
}

export const TimeMachineFormModal = ({
    title = '',
    description = '',
    className,
    formProps,
    userOrganizationId,
    ...props
}: IModalProps & {
    formProps?: Omit<ITimeMachineCancelFormProps, 'className'>
} & { userOrganizationId: TEntityId }) => {
    return (
        <Modal
            className={cn(
                ' min-w-fit flex items-center shadow-none justify-center border-0 bg-transparent',
                className
            )}
            description={description}
            title={title}
            {...props}
        >
            <TimeMachineForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                }}
                userOrganizationId={userOrganizationId}
            />
        </Modal>
    )
}

export default TimeMachineFormModal
