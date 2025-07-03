import z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { Path, useForm } from 'react-hook-form'

import { CountryCombobox } from '@/components/comboboxes/country-combobox'
import Modal, { IModalProps } from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import TextEditor from '@/components/text-editor'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import ImageField from '@/components/ui/image-field'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

import { cn } from '@/lib/utils'

import { entityIdSchema } from '@/validations/common'

import {
    useCreateMemberGovernmentBenefit,
    useUpdateMemberGovernmentBenefit,
} from '@/hooks/api-hooks/member/use-member-profile-settings'

import {
    IClassProps,
    IForm,
    IMedia,
    IMemberGovernmentBenefit,
    TEntityId,
} from '@/types'

export const memberGovernmentBenefitSchema = z.object({
    id: entityIdSchema.optional(),
    name: z.string().min(1, 'Name is required'),

    member_profile_id: entityIdSchema,
    organization_id: entityIdSchema.optional(),
    branch_id: entityIdSchema.optional(),

    country_code: z.string().min(1, 'Country is required'),
    value: z.string().min(1, 'Value is required'),
    expiry_date: z.coerce
        .string()
        .date()
        .transform((val) => new Date(val).toISOString()),
    description: z.string().optional(),
    front_media_id: entityIdSchema.optional(),
    front_media: z.any(),
    back_media_id: entityIdSchema.optional(),
    back_media: z.any(),
})

type TMemberGovernmentBenefitFormValues = z.infer<
    typeof memberGovernmentBenefitSchema
>

export interface IMemberGovernmentBenefitFormProps
    extends IClassProps,
        IForm<
            Partial<IMemberGovernmentBenefit>,
            IMemberGovernmentBenefit,
            string,
            TMemberGovernmentBenefitFormValues
        > {
    memberProfileId: TEntityId
    benefitId?: TEntityId
}

const MemberGovernmentBenefitCreateUpdateForm = ({
    readOnly,
    className,
    benefitId,
    defaultValues,
    disabledFields,
    memberProfileId,
    onError,
    onSuccess,
}: IMemberGovernmentBenefitFormProps) => {
    const form = useForm<TMemberGovernmentBenefitFormValues>({
        resolver: zodResolver(memberGovernmentBenefitSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            country_code: '',
            value: '',
            description: '',
            ...defaultValues,
        },
    })

    const createMutation = useCreateMemberGovernmentBenefit({
        onSuccess,
        onError,
        showMessage: true,
    })

    const updateMutation = useUpdateMemberGovernmentBenefit({
        onSuccess,
        onError,
        showMessage: true,
    })

    const onSubmit = form.handleSubmit((formData) => {
        if (benefitId) {
            updateMutation.mutate({
                memberProfileId,
                benefitId,
                data: formData,
            })
        } else {
            createMutation.mutate({
                memberProfileId,
                data: formData,
            })
        }
    })

    const { error, isPending, reset } = benefitId
        ? updateMutation
        : createMutation

    const isDisabled = (field: Path<TMemberGovernmentBenefitFormValues>) =>
        readOnly || disabledFields?.includes(field) || false

    return (
        <Form {...form}>
            <form
                onSubmit={onSubmit}
                className={cn('flex flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isPending || readOnly}
                    className="grid gap-x-6 gap-y-4 sm:gap-y-3"
                >
                    <fieldset className="space-y-3">
                        <FormFieldWrapper
                            control={form.control}
                            name="name"
                            label="Name *"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Government Benefit Name"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <div className="grid w-full gap-4 sm:grid-cols-8">
                            <FormFieldWrapper
                                control={form.control}
                                name="country_code"
                                label="Country *"
                                className="col-span-full"
                                render={({ field }) => (
                                    <CountryCombobox
                                        {...field}
                                        placeholder="Country"
                                        defaultValue={field.value}
                                        onChange={(country) =>
                                            field.onChange(country.alpha2)
                                        }
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="value"
                                label="Value *"
                                className="col-span-4"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="Value or ID No"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="expiry_date"
                                label="Expiry Date *"
                                className="col-span-4"
                                render={({ field }) => (
                                    <Input
                                        type="date"
                                        {...field}
                                        placeholder="Expiry Date"
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
                            label="Description"
                            render={({ field }) => (
                                <TextEditor
                                    {...field}
                                    content={field.value}
                                    placeholder="Description..."
                                    textEditorClassName="!max-w-none bg-background"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <div className="grid gap-4 sm:grid-cols-2">
                            <FormFieldWrapper
                                control={form.control}
                                name="front_media_id"
                                label="Front ID Photo *"
                                render={({ field }) => {
                                    const value = form.watch('front_media')

                                    return (
                                        <ImageField
                                            {...field}
                                            placeholder="Upload ID Front Photo"
                                            value={
                                                value
                                                    ? (value as IMedia)
                                                          .download_url
                                                    : value
                                            }
                                            onChange={(newImage) => {
                                                if (newImage)
                                                    field.onChange(newImage.id)
                                                else field.onChange(undefined)

                                                form.setValue(
                                                    'front_media',
                                                    newImage
                                                )
                                            }}
                                        />
                                    )
                                }}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="back_media_id"
                                label="Back ID Photo *"
                                render={({ field }) => {
                                    const value = form.watch('back_media')

                                    return (
                                        <ImageField
                                            {...field}
                                            placeholder="Upload ID Back Photo"
                                            value={
                                                value
                                                    ? (value as IMedia)
                                                          .download_url
                                                    : value
                                            }
                                            onChange={(newImage) => {
                                                if (newImage)
                                                    field.onChange(newImage.id)
                                                else field.onChange(undefined)

                                                form.setValue(
                                                    'back_media',
                                                    newImage
                                                )
                                            }}
                                        />
                                    )
                                }}
                            />
                        </div>
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
                            ) : benefitId ? (
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

export const MemberGovernmentBenefitCreateUpdateFormModal = ({
    title = 'Create Government Benefit',
    description = 'Fill out the form to add or update government benefit.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<IMemberGovernmentBenefitFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <MemberGovernmentBenefitCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default MemberGovernmentBenefitCreateUpdateForm
