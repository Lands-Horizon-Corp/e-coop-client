import { useForm } from 'react-hook-form'
import z from 'zod'

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

import {
    useCreateTagTemplate,
    useUpdateTagTemplateById,
} from '../../tag-template.service'
import { ITagTemplate } from '../../tag-template.types'
import { TagTemplateSchema } from '../../tag-template.validation'
import { TAG_CATEGORY } from '../../tag.constants'

type TTagTemplateFormValues = z.infer<typeof TagTemplateSchema>

export interface ITagTemplateFormProps
    extends IClassProps,
        IForm<
            Partial<TTagTemplateFormValues>,
            ITagTemplate,
            Error,
            TTagTemplateFormValues
        > {
    tagTemplateId?: TEntityId
}

const TagTemplateCreateUpdateForm = ({
    tagTemplateId,
    className,
    ...formProps
}: ITagTemplateFormProps) => {
    const form = useForm<TTagTemplateFormValues>({
        resolver: standardSchemaResolver(TagTemplateSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            name: '',
            category: TAG_CATEGORY[0],
            color: '',
            icon: '',
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateTagTemplate({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Tag template created',
                textError: 'Failed to create tag template',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })
    const updateMutation = useUpdateTagTemplateById({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Tag template updated',
                textError: 'Failed to update tag template',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TTagTemplateFormValues>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((formData) => {
        if (tagTemplateId) {
            updateMutation.mutate({ id: tagTemplateId, payload: formData })
        } else {
            createMutation.mutate(formData)
        }
    }, handleFocusError)

    const {
        error: rawError,
        isPending,
        reset,
    } = tagTemplateId ? updateMutation : createMutation
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
                    <FormFieldWrapper
                        control={form.control}
                        label="Name *"
                        name="name"
                        render={({ field }) => (
                            <Input
                                {...field}
                                autoComplete="off"
                                disabled={isDisabled(field.name)}
                                id={field.name}
                                placeholder="Tag Name"
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
                                placeholder="Optional description"
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Category *"
                        name="category"
                        render={({ field }) => (
                            <Select
                                disabled={isDisabled(field.name)}
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {TAG_CATEGORY.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Color *"
                        name="color"
                        render={({ field }) => (
                            <Input
                                {...field}
                                disabled={isDisabled(field.name)}
                                id={field.name}
                                type="color"
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Icon *"
                        name="icon"
                        render={({ field }) => (
                            <IconCombobox
                                {...field}
                                disabled={isDisabled(field.name)}
                                value={field.value as TIcon}
                            />
                        )}
                    />
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
                    submitText={tagTemplateId ? 'Update' : 'Create'}
                />
            </form>
        </Form>
    )
}

export const TagTemplateCreateUpdateFormModal = ({
    title = 'Create Tag Template',
    description = 'Fill out the form to add a new tag template.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<ITagTemplateFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('', className)}
            description={description}
            title={title}
            {...props}
        >
            <TagTemplateCreateUpdateForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default TagTemplateCreateUpdateForm
