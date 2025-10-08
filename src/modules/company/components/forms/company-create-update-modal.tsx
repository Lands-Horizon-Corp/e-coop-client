import { useForm } from 'react-hook-form'
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

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import { useCreateCompany, useUpdateCompanyById } from '../../company.service'
import { ICompany, ICompanyRequest } from '../../company.types'
import { CompanySchema } from '../../company.validation'

type TCompanyFormValues = z.infer<typeof CompanySchema>

export interface ICompanyFormProps
    extends IClassProps,
        IForm<Partial<ICompanyRequest>, ICompany, Error, TCompanyFormValues> {
    companyId?: TEntityId
}

const CompanyCreateUpdateForm = ({
    className,
    ...formProps
}: ICompanyFormProps) => {
    const form = useForm<TCompanyFormValues>({
        resolver: standardSchemaResolver(CompanySchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            description: '',
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateCompany({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Company Created',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })
    const updateMutation = useUpdateCompanyById({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Company updated',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TCompanyFormValues>({
            form,
            readOnly: formProps.readOnly,
            hiddenFields: formProps.hiddenFields,
            disabledFields: formProps.disabledFields,
            defaultValues: formProps.defaultValues,
            autoSave: false,
        })

    const onSubmit = form.handleSubmit((formData) => {
        if (formProps.companyId) {
            updateMutation.mutate({
                id: formProps.companyId,
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
    } = formProps.companyId ? updateMutation : createMutation

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
                            label="Company Name"
                            name="name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Company Name"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Company Photo"
                            name="media_id"
                            render={({ field }) => {
                                const value = form.watch('media')

                                return (
                                    <ImageField
                                        {...field}
                                        onChange={(newImage) => {
                                            if (newImage)
                                                field.onChange(newImage.id)
                                            else field.onChange(undefined)

                                            form.setValue('media', newImage)
                                        }}
                                        placeholder="Upload Company Photo"
                                        value={
                                            value
                                                ? (value as IMedia).download_url
                                                : value
                                        }
                                    />
                                )
                            }}
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
                    submitText={formProps.companyId ? 'Update' : 'Create'}
                />
            </form>
        </Form>
    )
}

export const CompanyCreateUpdateFormModal = ({
    title = 'Create Company',
    description = 'Fill out the form to add a new company.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<ICompanyFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('', className)}
            description={description}
            title={title}
            {...props}
        >
            <CompanyCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default CompanyCreateUpdateForm
