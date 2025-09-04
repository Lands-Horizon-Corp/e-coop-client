import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { IMedia } from '@/modules/media'

import { CountryCombobox } from '@/components/comboboxes/country-combobox'
import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import TextEditor from '@/components/text-editor'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import ImageField from '@/components/ui/image-field'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    useCreateMemberGovernmentBenefit,
    useUpdateMemberGovernmentBenefit,
} from '../../member-government-benefit.service'
import { IMemberGovernmentBenefit } from '../../member-government-benefit.types'
import { MemberGovernmentBenefitSchema } from '../../member-government-benefit.validation'

type TMemberGovernmentBenefitFormValues = z.infer<
    typeof MemberGovernmentBenefitSchema
>

export interface IMemberGovernmentBenefitFormProps
    extends IClassProps,
        IForm<
            Partial<IMemberGovernmentBenefit>,
            IMemberGovernmentBenefit,
            Error,
            TMemberGovernmentBenefitFormValues
        > {
    memberProfileId: TEntityId
    benefitId?: TEntityId
}

const MemberGovernmentBenefitCreateUpdateForm = ({
    className,
    benefitId,
    memberProfileId,
    ...formProps
}: IMemberGovernmentBenefitFormProps) => {
    const form = useForm<TMemberGovernmentBenefitFormValues>({
        resolver: standardSchemaResolver(MemberGovernmentBenefitSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            country_code: '',
            value: '',
            description: '',
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateMemberGovernmentBenefit({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const updateMutation = useUpdateMemberGovernmentBenefit({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TMemberGovernmentBenefitFormValues>({
            form,
            ...formProps,
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
    }, handleFocusError)

    const {
        error: rawError,
        isPending,
        reset,
    } = benefitId ? updateMutation : createMutation

    const error = serverRequestErrExtractor({ error: rawError })

    return (
        <Form {...form}>
            <form
                ref={formRef}
                onSubmit={onSubmit}
                className={cn('flex flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isPending || formProps.readOnly}
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
                                className="relative col-span-4"
                                description="mm/dd/yyyy"
                                descriptionClassName="absolute top-0 right-0"
                                render={({ field }) => (
                                    <InputDate
                                        {...field}
                                        placeholder="Expiry Date"
                                        className="block"
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
                <FormFooterResetSubmit
                    error={error}
                    readOnly={formProps.readOnly}
                    isLoading={isPending}
                    disableSubmit={!form.formState.isDirty}
                    submitText={benefitId ? 'Update' : 'Create'}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                />
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
