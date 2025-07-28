import z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { TAG_CATEGORY } from '@/constants'
import { Path, useForm } from 'react-hook-form'

import Modal, { IModalProps } from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

import { cn } from '@/lib/utils'

import { tagTemplateSchema } from '@/validations/form-validation/tag-template-schema'

import {
    useCreateTagTemplate,
    useUpdateTagTemplate,
} from '@/hooks/api-hooks/use-tag-template'

import { IClassProps, IForm, ITagTemplate, TEntityId, TIcon } from '@/types'

import IconCombobox from '../comboboxes/icon-combobox'
import { Textarea } from '../ui/textarea'

type TTagTemplateFormValues = z.infer<typeof tagTemplateSchema>

export interface ITagTemplateFormProps
    extends IClassProps,
        IForm<
            Partial<TTagTemplateFormValues>,
            ITagTemplate,
            string,
            TTagTemplateFormValues
        > {
    tagTemplateId?: TEntityId
}

const TagTemplateCreateUpdateForm = ({
    tagTemplateId,
    readOnly,
    className,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
}: ITagTemplateFormProps) => {
    const form = useForm<TTagTemplateFormValues>({
        resolver: zodResolver(tagTemplateSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            name: '',
            description: '',
            category: TAG_CATEGORY[0],
            color: '',
            icon: '',
            ...defaultValues,
        },
    })

    const createMutation = useCreateTagTemplate({ onSuccess, onError })
    const updateMutation = useUpdateTagTemplate({ onSuccess, onError })

    const onSubmit = form.handleSubmit((formData) => {
        if (tagTemplateId) {
            updateMutation.mutate({ id: tagTemplateId, data: formData })
        } else {
            createMutation.mutate(formData)
        }
    })

    const { error, isPending } = tagTemplateId ? updateMutation : createMutation

    const isDisabled = (field: Path<TTagTemplateFormValues>) =>
        readOnly || disabledFields?.includes(field) || false

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
                    <FormFieldWrapper
                        control={form.control}
                        name="name"
                        label="Name *"
                        render={({ field }) => (
                            <Input
                                {...field}
                                id={field.name}
                                placeholder="Tag Name"
                                autoComplete="off"
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        name="description"
                        label="Description"
                        render={({ field }) => (
                            <Textarea
                                {...field}
                                id={field.name}
                                placeholder="Optional description"
                                autoComplete="off"
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        name="category"
                        label="Category *"
                        render={({ field }) => (
                            <Select
                                disabled={isDisabled(field.name)}
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger>
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
                        name="color"
                        label="Color *"
                        render={({ field }) => (
                            <Input
                                {...field}
                                id={field.name}
                                type="color"
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        name="icon"
                        label="Icon *"
                        render={({ field }) => (
                            <IconCombobox
                                {...field}
                                value={field.value as TIcon}
                            />
                            // <Input
                            //     {...field}
                            //     id={field.name}
                            //     placeholder="e.g. star, heart"
                            //     autoComplete="off"
                            //     disabled={isDisabled(field.name)}
                            // />
                        )}
                    />
                </fieldset>
                <FormErrorMessage errorMessage={error} />
                <div>
                    <Separator className="my-2 sm:my-4" />
                    <div className="flex items-center justify-end gap-x-2">
                        <Button
                            size="sm"
                            type="button"
                            variant="ghost"
                            onClick={() => form.reset()}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            Reset
                        </Button>
                        <Button
                            size="sm"
                            type="submit"
                            disabled={isPending}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            {isPending ? (
                                <LoadingSpinner />
                            ) : tagTemplateId ? (
                                'Update'
                            ) : (
                                'Create'
                            )}
                        </Button>
                    </div>
                </div>
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
            title={title}
            description={description}
            className={cn('', className)}
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
