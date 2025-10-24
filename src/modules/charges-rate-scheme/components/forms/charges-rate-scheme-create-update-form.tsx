import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    useCreateChargesRateScheme,
    useUpdateChargesRateSchemeById,
} from '../..'
import {
    IChargesRateScheme,
    IChargesRateSchemeRequest,
} from '../../charges-rate-scheme.types'
import { ChargesRateSchemeSchema } from '../../charges-rate-scheme.validation'

type TChargesRateSchemeFormValues = z.infer<typeof ChargesRateSchemeSchema>

export interface IChargesRateSchemeFormProps
    extends IClassProps,
        IForm<
            Partial<IChargesRateSchemeRequest>,
            IChargesRateScheme,
            Error,
            TChargesRateSchemeFormValues
        > {
    chargesRateSchemeId?: TEntityId
}

const ChargesRateSchemeCreateUpdateForm = ({
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

    const createMutation = useCreateChargesRateScheme({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Charges Rate Scheme Created',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })
    const updateMutation = useUpdateChargesRateSchemeById({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Charges Rate Scheme updated',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TChargesRateSchemeFormValues>({
            form,
            autoSave: formProps.autoSave,
            readOnly: formProps.readOnly,
            hiddenFields: formProps.hiddenFields,
            disabledFields: formProps.disabledFields,
            defaultValues: formProps.defaultValues,
        })

    const onSubmit = form.handleSubmit((formData) => {
        if (formProps.chargesRateSchemeId) {
            updateMutation.mutate({
                id: formProps.chargesRateSchemeId,
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
    } = formProps.chargesRateSchemeId ? updateMutation : createMutation

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
                    submitText={
                        formProps.chargesRateSchemeId ? 'Update' : 'Create'
                    }
                />
            </form>
        </Form>
    )
}

export const ChargesRateSchemeCreateUpdateFormModal = ({
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
            className={cn('', className)}
            description={description}
            title={title}
            {...props}
        >
            <ChargesRateSchemeCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default ChargesRateSchemeCreateUpdateForm
