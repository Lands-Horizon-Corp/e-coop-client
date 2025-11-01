import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { CurrencyCombobox } from '@/modules/currency'

import IconCombobox from '@/components/comboboxes/icon-combobox'
import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { TIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm } from '@/types'

import { logger, useCreateChargesRateScheme } from '../..'
import {
    IChargesRateScheme,
    IChargesRateSchemeRequest,
} from '../../charges-rate-scheme.types'
import {
    ChargesRateSchemeSchema,
    TChargesRateCreateSchemeSchema,
} from '../../charges-rate-scheme.validation'

type TChargesRateSchemeFormValues = TChargesRateCreateSchemeSchema

export interface IChargesRateSchemeFormProps
    extends IClassProps,
        IForm<
            Partial<IChargesRateSchemeRequest>,
            IChargesRateScheme,
            Error,
            TChargesRateSchemeFormValues
        > {}

const ChargesRateSchemeCreateForm = ({
    className,
    ...formProps
}: IChargesRateSchemeFormProps) => {
    const form = useForm<TChargesRateSchemeFormValues>({
        resolver: standardSchemaResolver(ChargesRateSchemeSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            description: '',
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateChargesRateScheme()

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TChargesRateSchemeFormValues>({
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
            loading: 'Creating Charges Rate Scheme...',
            success: (data) => {
                formProps.onSuccess?.(data)
                return 'Charges Rate Scheme Created'
            },
            error: (e) => {
                const errorMessage = serverRequestErrExtractor({ error: e })
                formProps.onError?.(e)
                logger.error(errorMessage, e)
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
                            label="Charges Rate Scheme Name"
                            name="name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Charges Rate Scheme Name"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Icon"
                            name="icon"
                            render={({ field }) => (
                                <IconCombobox
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    onChange={field.onChange}
                                    placeholder="Scheme Icon"
                                    value={field.value as TIcon}
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
                                    onChange={(currency) =>
                                        field.onChange(currency.id)
                                    }
                                    placeholder="Description"
                                    value={field.value}
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

export const ChargesRateSchemeCreateFormModal = ({
    title = 'Create Charges Rate Scheme',
    description = 'Fill out the form to add a new charges rate scheme.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IChargesRateSchemeFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('max-w-2xl w-full', className)}
            description={description}
            title={title}
            {...props}
        >
            <ChargesRateSchemeCreateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default ChargesRateSchemeCreateForm
