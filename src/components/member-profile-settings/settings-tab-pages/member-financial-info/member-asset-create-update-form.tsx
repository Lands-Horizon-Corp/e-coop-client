import z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { toInputDateString } from '@/utils'
import { Path, useForm } from 'react-hook-form'

import Modal, { IModalProps } from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import TextEditor from '@/components/text-editor'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

import { cn } from '@/lib/utils'

import { entityIdSchema } from '@/validations/common'

import {
    useCreateMemberProfileAsset,
    useUpdateMemberProfileAsset,
} from '@/hooks/api-hooks/member/use-member-profile-settings'

import { IClassProps, IForm, IMedia, IMemberAsset, TEntityId } from '@/types'

import ImageField from '../../../ui/image-field'

export const memberAssetSchema = z.object({
    id: z.string().optional(),
    member_profile_id: entityIdSchema.optional(),
    branch_id: entityIdSchema.optional(),
    name: z.string().min(1, 'Asset name is required'),

    cost: z.coerce.number(),
    entry_date: z.coerce
        .string()
        .date()
        .transform((val) => new Date(val).toISOString()),

    description: z.string().min(1, 'Description is required'),

    media_id: entityIdSchema.optional(),
    media: z.any(),
})

type TMemberAssetFormValues = z.infer<typeof memberAssetSchema>

export interface IMemberAssetFormProps
    extends IClassProps,
        IForm<
            Partial<IMemberAsset>,
            IMemberAsset,
            string,
            TMemberAssetFormValues
        > {
    memberProfileId: TEntityId
    assetId?: TEntityId
}

const MemberAssetCreateUpdateForm = ({
    memberProfileId,
    assetId,
    readOnly,
    className,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
}: IMemberAssetFormProps) => {
    const form = useForm<TMemberAssetFormValues>({
        resolver: zodResolver(memberAssetSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            member_profile_id: memberProfileId,
            ...defaultValues,
            entry_date: toInputDateString(
                defaultValues?.entry_date ?? new Date()
            ),
        },
    })

    const createMutation = useCreateMemberProfileAsset({
        onSuccess,
        onError,
        showMessage: true,
    })
    const updateMutation = useUpdateMemberProfileAsset({
        onSuccess,
        onError,
        showMessage: true,
    })

    const onSubmit = form.handleSubmit((formData) => {
        if (assetId) {
            updateMutation.mutate({
                memberProfileId,
                assetId,
                data: formData,
            })
        } else {
            createMutation.mutate({
                memberProfileId,
                data: formData,
            })
        }
    })

    const { error, isPending, reset } = assetId
        ? updateMutation
        : createMutation

    const isDisabled = (field: Path<TMemberAssetFormValues>) =>
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
                    <fieldset className="space-y-3">
                        <FormFieldWrapper
                            control={form.control}
                            name="name"
                            label="Asset Name *"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Asset Name"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <div className="grid grid-cols-2 gap-x-2">
                            <FormFieldWrapper
                                control={form.control}
                                name="cost"
                                label="Asset Cost *"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id={field.name}
                                        type="number"
                                        placeholder="Cost"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="entry_date"
                                label="Entry Date *"
                                render={({ field }) => (
                                    <Input
                                        type="date"
                                        {...field}
                                        placeholder="Entry Date"
                                        className="block [&::-webkit-calendar-picker-indicator]:hidden"
                                        value={field.value ?? ''}
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                        </div>
                        <FormFieldWrapper
                            control={form.control}
                            name="description"
                            label="Asset Description *"
                            render={({ field }) => (
                                <TextEditor
                                    {...field}
                                    content={field.value}
                                    disabled={isDisabled(field.name)}
                                    placeholder="Asset Description..."
                                    textEditorClassName="bg-background !max-w-none"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="media_id"
                            label="Asset Photo"
                            render={({ field }) => {
                                const value = form.watch('media')

                                return (
                                    <ImageField
                                        {...field}
                                        placeholder="Upload Asset Photo"
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
                    </fieldset>
                </fieldset>
                <FormErrorMessage errorMessage={error} />
                <div>
                    <Separator className="my-2 sm:my-4" />
                    <div className="flex items-center justify-end gap-x-2">
                        <Button
                            size="sm"
                            type="button"
                            variant="ghost"
                            onClick={() => {
                                form.reset()
                                reset()
                            }}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            Reset
                        </Button>
                        <Button
                            type="submit"
                            size="sm"
                            disabled={isPending}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            {isPending ? (
                                <LoadingSpinner />
                            ) : assetId ? (
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

export const MemberAssetCreateUpdateFormModal = ({
    title = 'Create Asset',
    description = 'Fill out the form to add or update asset.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<IMemberAssetFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <MemberAssetCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default MemberAssetCreateUpdateForm
