import { useEffect } from 'react'

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
    useGetAllGovernmentIds,
    useUpdateMemberGovernmentBenefit,
} from '../../member-government-benefit.service'
import {
    IGovernmentId,
    IMemberGovernmentBenefit,
} from '../../member-government-benefit.types'
import { MemberGovernmentBenefitSchema } from '../../member-government-benefit.validation'
import GovernmentIdCombobox from '../government-id-combobox'

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
            country_code: 'PHL',
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

    const name = form.watch('name')
    const isoAlpha3 = form.watch('country_code')
    const government: IGovernmentId | undefined = form.watch('government')

    const { data } = useGetAllGovernmentIds({
        isoAlpha3,
        options: {
            enabled: !!isoAlpha3,
        },
    })

    useEffect(() => {
        if (government || !name || name.length === 0 || data?.length === 0)
            return

        const matchedGovernment = data?.find((gov) => gov.name === name)

        if (matchedGovernment) {
            form.setValue('government', matchedGovernment)
        }
    }, [data, form, government, name])

    const error = serverRequestErrExtractor({ error: rawError })

    return (
        <Form {...form}>
            <form
                className={cn(
                    'flex min-w-0 max-w-full flex-col gap-y-4',
                    className
                )}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="grid gap-x-6 min-w-0 max-w-full gap-y-4 sm:gap-y-3"
                    disabled={isPending || formProps.readOnly}
                >
                    <fieldset className="space-y-3 max-w-full min-w-0">
                        <div className="grid w-full min-w-0 max-w-full gap-4 sm:grid-cols-8">
                            <FormFieldWrapper
                                className="col-span-full"
                                control={form.control}
                                label="Country *"
                                name="country_code"
                                render={({ field }) => (
                                    <CountryCombobox
                                        {...field}
                                        customTriggerClassName="bg-popover"
                                        defaultValue={field.value}
                                        disabled={isDisabled(field.name)}
                                        onChange={(country) => {
                                            field.onChange(country.alpha3)
                                        }}
                                        placeholder="Country"
                                        undefinable={false}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                className="col-span-full"
                                control={form.control}
                                label="Name *"
                                name="name"
                                render={({ field }) => (
                                    <GovernmentIdCombobox
                                        className="col-span-full bg-popover"
                                        disabled={!isoAlpha3}
                                        isoAlpha3={isoAlpha3}
                                        {...field}
                                        onChange={(governmentId) => {
                                            form.setValue(
                                                'name',
                                                governmentId?.name ?? ''
                                            )
                                            form.setValue(
                                                'government',
                                                governmentId
                                            )
                                        }}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                className="col-span-4"
                                control={form.control}
                                label={
                                    government?.field_name
                                        ? government.field_name
                                        : 'Value *'
                                }
                                name="value"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        className="bg-popover"
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        placeholder="Value or ID No"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                className="relative col-span-4"
                                control={form.control}
                                description="mm/dd/yyyy"
                                descriptionClassName="absolute top-0 right-0"
                                label="Expiry Date *"
                                name="expiry_date"
                                render={({ field }) => (
                                    <InputDate
                                        {...field}
                                        className="block bg-popover"
                                        disabled={isDisabled(field.name)}
                                        placeholder="Expiry Date"
                                        value={field.value ?? ''}
                                    />
                                )}
                            />
                        </div>
                        <FormFieldWrapper
                            control={form.control}
                            label="Description"
                            name="description"
                            render={({ field }) => (
                                <TextEditor
                                    {...field}
                                    content={field.value}
                                    disabled={isDisabled(field.name)}
                                    placeholder="Description..."
                                    textEditorClassName="!max-w-none bg-popover"
                                />
                            )}
                        />
                        <div className="grid gap-4 sm:grid-cols-2">
                            <FormFieldWrapper
                                control={form.control}
                                label="Front ID Photo *"
                                name="front_media_id"
                                render={({ field }) => {
                                    const value = form.watch('front_media')

                                    return (
                                        <ImageField
                                            {...field}
                                            onChange={(newImage) => {
                                                if (newImage)
                                                    field.onChange(newImage.id)
                                                else field.onChange(undefined)

                                                form.setValue(
                                                    'front_media',
                                                    newImage
                                                )
                                            }}
                                            placeholder="Upload ID Front Photo"
                                            value={
                                                value
                                                    ? (value as IMedia)
                                                          .download_url
                                                    : value
                                            }
                                        />
                                    )
                                }}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="Back ID Photo *"
                                name="back_media_id"
                                render={({ field }) => {
                                    const value = form.watch('back_media')

                                    return (
                                        <ImageField
                                            {...field}
                                            onChange={(newImage) => {
                                                if (newImage)
                                                    field.onChange(newImage.id)
                                                else field.onChange(undefined)

                                                form.setValue(
                                                    'back_media',
                                                    newImage
                                                )
                                            }}
                                            placeholder="Upload ID Back Photo"
                                            value={
                                                value
                                                    ? (value as IMedia)
                                                          .download_url
                                                    : value
                                            }
                                        />
                                    )
                                }}
                            />
                        </div>
                    </fieldset>
                </fieldset>
                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty || isPending}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                    readOnly={formProps.readOnly}
                    submitText={benefitId ? 'Update' : 'Create'}
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
            className={cn('', className)}
            description={description}
            title={title}
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
