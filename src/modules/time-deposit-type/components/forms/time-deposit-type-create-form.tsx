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

import { IClassProps, IForm } from '@/types'

import { useCreateTimeDepositType } from '../..'
import {
    ITimeDepositType,
    ITimeDepositTypeCreateRequest,
} from '../../time-deposit-type.types'
import {
    TTimeDepositTypeCreateSchema,
    timeDepositTypeCreateSchema,
} from '../../time-deposit-type.validation'

type TTimeDepositTypeFormValues = TTimeDepositTypeCreateSchema

export interface ITimeDepositTypeFormProps
    extends IClassProps,
        IForm<
            Partial<ITimeDepositTypeCreateRequest>,
            ITimeDepositType,
            Error,
            TTimeDepositTypeFormValues
        > {}

const TimeDepositTypeCreateForm = ({
    className,
    ...formProps
}: ITimeDepositTypeFormProps) => {
    const form = useForm<TTimeDepositTypeFormValues>({
        resolver: standardSchemaResolver(timeDepositTypeCreateSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            description: '',
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateTimeDepositType()

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TTimeDepositTypeFormValues>({
            form,
            autoSave: formProps.autoSave,
            readOnly: formProps.readOnly,
            hiddenFields: formProps.hiddenFields,
            disabledFields: formProps.disabledFields,
            defaultValues: formProps.defaultValues,
        })

    const onSubmit = form.handleSubmit(async (formData) => {
        const request = createMutation.mutateAsync(formData)

        toast.promise(request, {
            loading: 'Creating Time Deposit Type...',
            success: (data) => {
                formProps.onSuccess?.(data)
                return 'Time Deposit Type Created'
            },
            error: (e) => {
                const errorMessage = serverRequestErrExtractor({ error: e })
                formProps.onError?.(e)
                return errorMessage
            },
        })
    }, handleFocusError)

    const { error: errorResponse, isPending, reset } = createMutation

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
                            label="Time Deposit Type Name"
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
                                        form.setValue('currency', currency)
                                    }}
                                    placeholder="Select Currency"
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Pre-Mature"
                            name="pre_mature"
                            render={({ field: { onChange, ...field } }) => (
                                <CurrencyInput
                                    {...field}
                                    currency={form.watch('currency')}
                                    onValueChange={(newValue = '') =>
                                        onChange(newValue)
                                    }
                                    placeholder="Pre-Mature"
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
                                        <InputGroupText>%</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Excess"
                            name="excess"
                            render={({ field: { onChange, ...field } }) => (
                                <CurrencyInput
                                    {...field}
                                    currency={form.watch('currency')}
                                    onValueChange={(newValue = '') =>
                                        onChange(newValue)
                                    }
                                    placeholder="Excess Amount"
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
                    submitText="Create"
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
    formProps?: Omit<ITimeDepositTypeFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('max-w-2xl w-full', className)}
            description={description}
            title={title}
            {...props}
        >
            <TimeDepositTypeCreateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default TimeDepositTypeCreateForm
