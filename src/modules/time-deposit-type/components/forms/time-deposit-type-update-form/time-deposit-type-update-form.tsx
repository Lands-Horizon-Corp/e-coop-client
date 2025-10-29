import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { CurrencyCombobox, CurrencyInput } from '@/modules/currency'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
} from '@/components/ui/input-group'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import { ITimeDepositTypeRequest, useUpdateTimeDepositTypeById } from '../../..'
import { logger } from '../../../'
import { ITimeDepositType } from '../../../time-deposit-type.types'
import {
    TTimeDepositTypeSchema,
    timeDepositTypeSchema,
} from '../../../time-deposit-type.validation'
import TimeDepositComputationSection from './time-deposit-computation-section'

export interface ITimeDepositTypeFormProps
    extends IClassProps,
        IForm<
            Partial<ITimeDepositTypeRequest>,
            ITimeDepositType,
            Error,
            TTimeDepositTypeSchema
        > {
    timeDepositTypeId: TEntityId
}

const TimeDepositTypeUpdateForm = ({
    timeDepositTypeId,
    className,
    ...formProps
}: ITimeDepositTypeFormProps) => {
    const form = useForm<TTimeDepositTypeSchema>({
        resolver: standardSchemaResolver(timeDepositTypeSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            description: '',
            ...formProps.defaultValues,
        },
    })

    const updateMutation = useUpdateTimeDepositTypeById()

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TTimeDepositTypeSchema>({
            form,
            autoSave: formProps.autoSave,
            readOnly: formProps.readOnly,
            hiddenFields: formProps.hiddenFields,
            disabledFields: formProps.disabledFields,
            defaultValues: formProps.defaultValues,
        })

    const onSubmit = form.handleSubmit(async (formData) => {
        toast.promise(
            updateMutation.mutateAsync({
                id: timeDepositTypeId,
                payload: formData,
            }),
            {
                loading: 'Updating time deposit type...',
                success: (data) => {
                    formProps?.onSuccess?.(data)
                    form.reset(data)
                    return 'Time deposit type updated successfully'
                },
                error: (e) => {
                    const errorMessage = serverRequestErrExtractor({ error: e })
                    formProps?.onError?.(e)

                    logger.error(errorMessage)
                    return errorMessage
                },
            }
        )
    }, handleFocusError)

    const { isPending, reset } = updateMutation

    return (
        <Form {...form}>
            <form
                className={cn(
                    'flex w-full max-w-full flex-col gap-y-4',
                    className
                )}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="grid gap-x-6 gap-y-4 sm:gap-y-3 min-w-0 max-w-full"
                    disabled={isPending || formProps.readOnly}
                >
                    <fieldset className="space-y-3 min-w-0 max-w-full">
                        <div className="p-4 space-y-2 rounded-xl bg-popover">
                            <div className="mb-2">
                                <p>Time Deposit Details</p>
                                <p className="text-xs text-muted-foreground">
                                    Modify the basic time deposit details
                                </p>
                            </div>
                            <div className="flex items-start gap-x-2 w-full">
                                <FormFieldWrapper
                                    control={form.control}
                                    label="Name"
                                    name="name"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            autoComplete="off"
                                            disabled={isDisabled(field.name)}
                                            id={field.name}
                                            placeholder="Time Deposit Type Name"
                                        />
                                    )}
                                />
                                <FormFieldWrapper
                                    className="w-fit"
                                    control={form.control}
                                    label="Currency"
                                    name="currency_id"
                                    render={({ field }) => (
                                        <CurrencyCombobox
                                            {...field}
                                            className="w-fit"
                                            disabled={isDisabled(field.name)}
                                            onChange={(currency) => {
                                                field.onChange(currency.id)
                                                form.setValue(
                                                    'currency',
                                                    currency
                                                )
                                            }}
                                            placeholder="Select Currency"
                                        />
                                    )}
                                />
                            </div>

                            <div className="flex items-start gap-x-2">
                                <FormFieldWrapper
                                    control={form.control}
                                    label="Pre-Mature"
                                    name="pre_mature"
                                    render={({
                                        field: { onChange, ...field },
                                    }) => (
                                        <CurrencyInput
                                            {...field}
                                            currency={form.watch('currency')}
                                            onValueChange={(newValue = '') =>
                                                onChange(newValue)
                                            }
                                            placeholder="0"
                                        />
                                    )}
                                />

                                <FormFieldWrapper
                                    control={form.control}
                                    label="Pre-Mature Rate"
                                    name="pre_mature_rate"
                                    render={({ field }) => (
                                        <InputGroup>
                                            <InputGroupInput {...field} />
                                            <InputGroupAddon align="inline-end">
                                                <InputGroupText>
                                                    %
                                                </InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                    )}
                                />

                                <FormFieldWrapper
                                    control={form.control}
                                    label="Excess"
                                    name="excess"
                                    render={({
                                        field: { onChange, ...field },
                                    }) => (
                                        <CurrencyInput
                                            {...field}
                                            currency={form.watch('currency')}
                                            onValueChange={(newValue = '') =>
                                                onChange(newValue)
                                            }
                                            placeholder="0"
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
                                        autoComplete="off"
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        placeholder="Description"
                                    />
                                )}
                            />
                        </div>

                        <TimeDepositComputationSection form={form} />
                    </fieldset>
                </fieldset>
                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                    readOnly={formProps.readOnly}
                    submitText="Update"
                />
            </form>
        </Form>
    )
}

export const TimeDepositTypeCreateFormModal = ({
    title = 'Create Time Deposit Type',
    description = 'Fill out the form to add a new time deposit type.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<ITimeDepositTypeFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('max-w-2xl w-full', className)}
            description={description}
            title={title}
            {...props}
        >
            <TimeDepositTypeUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default TimeDepositTypeUpdateForm
