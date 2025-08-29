import { Path, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { IMedia } from '@/modules/media/media.types'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import ImageField from '@/components/ui/image-field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { useAlertBeforeClosing } from '@/hooks/use-alert-before-closing'

import { IClassProps, IForm, TEntityId } from '@/types'

import { useCreateBank, useUpdateBankById } from '../..'
import { IBank, IBankRequest } from '../../bank.types'
import { BankSchema } from '../../bank.validation'

type TBankFormValues = z.infer<typeof BankSchema>

export interface IBankFormProps
    extends IClassProps,
        IForm<Partial<IBankRequest>, IBank, Error, TBankFormValues> {
    bankId?: TEntityId
}

const BankCreateUpdateForm = ({
    bankId,
    readOnly,
    className,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
}: IBankFormProps) => {
    const form = useForm<TBankFormValues>({
        resolver: standardSchemaResolver(BankSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            description: '',
            ...defaultValues,
        },
    })

    const createMutation = useCreateBank({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Bank Created',
                onSuccess,
                onError,
            }),
        },
    })
    const updateMutation = useUpdateBankById({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Bank updated',
                onSuccess,
                onError,
            }),
        },
    })

    const onSubmit = form.handleSubmit((formData) => {
        if (bankId) {
            updateMutation.mutate({ id: bankId, payload: formData })
        } else {
            createMutation.mutate(formData)
        }
    })

    const {
        error: errorResponse,
        isPending,
        reset,
    } = bankId ? updateMutation : createMutation

    const error = serverRequestErrExtractor({ error: errorResponse })

    const isDisabled = (field: Path<TBankFormValues>) =>
        readOnly || disabledFields?.includes(field) || false

    const isDirty = Object.keys(form.formState.dirtyFields).length > 0

    useAlertBeforeClosing(isDirty)

    return (
        <Form {...form}>
            <form
                onSubmit={onSubmit}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isPending || readOnly}
                    className="grid gap-x-6 gap-y-4 sm:gap-y-3"
                >
                    <fieldset className="space-y-3">
                        <FormFieldWrapper
                            control={form.control}
                            name="name"
                            label="Bank Name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Bank Name"
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="media_id"
                            label="Bank Photo"
                            render={({ field }) => {
                                const value = form.watch('media')

                                return (
                                    <ImageField
                                        {...field}
                                        placeholder="Upload Bank Photo"
                                        value={
                                            value
                                                ? (value as IMedia).download_url
                                                : value
                                        }
                                        onChange={(newImage) => {
                                            if (newImage)
                                                field.onChange(newImage.id)
                                            else field.onChange(undefined)

                                            form.setValue('media', newImage)
                                        }}
                                    />
                                )
                            }}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="description"
                            label="Description"
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    id={field.name}
                                    autoComplete="off"
                                    placeholder="Description"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                    </fieldset>
                </fieldset>
                <FormFooterResetSubmit
                    error={error}
                    readOnly={readOnly}
                    isLoading={isPending}
                    disableSubmit={!form.formState.isDirty}
                    submitText={bankId ? 'Update' : 'Create'}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                />
            </form>
        </Form>
    )
}

export const BankCreateUpdateFormModal = ({
    title = 'Create Bank',
    description = 'Fill out the form to add a new bank.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IBankFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <BankCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default BankCreateUpdateForm
