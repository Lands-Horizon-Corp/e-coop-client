import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import TextEditor from '@/components/text-editor'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    useCreateEducationalAttainmentForMember,
    useUpdateEducationalAttainmentForMember,
} from '../../member-educational-attainment.service'
import { IMemberEducationalAttainment } from '../../member-educational-attainment.types'
import { MemberEducationalAttainmentSchema } from '../../member-educational-attainment.validation'
import EducationalAttainmentCombobox from '../educational-attainment-combobox'

type TEducationalAttainmentFormValues = z.infer<
    typeof MemberEducationalAttainmentSchema
>

export interface IMemberEducationalAttainmentFormProps
    extends IClassProps,
        IForm<
            Partial<IMemberEducationalAttainment>,
            IMemberEducationalAttainment,
            string,
            TEducationalAttainmentFormValues
        > {
    memberProfileId: TEntityId
    educationalAttainmentId?: TEntityId
}

const MemberEducationalAttainmentCreateUpdateForm = ({
    memberProfileId,
    educationalAttainmentId,
    className,
    ...formProps
}: IMemberEducationalAttainmentFormProps) => {
    const form = useForm<TEducationalAttainmentFormValues>({
        resolver: standardSchemaResolver(MemberEducationalAttainmentSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            description: '',
            school_name: '',
            program_course: '',
            school_year: new Date().getFullYear(),
            educational_attainment: 'college graduate',
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateEducationalAttainmentForMember({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const updateMutation = useUpdateEducationalAttainmentForMember({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TEducationalAttainmentFormValues>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((formData) => {
        if (educationalAttainmentId) {
            updateMutation.mutate({
                memberProfileId,
                educationalAttainmentId,
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
    } = educationalAttainmentId ? updateMutation : createMutation

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
                    <fieldset className="space-y-3">
                        <FormFieldWrapper
                            control={form.control}
                            label="School Name"
                            name="school_name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="organization"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="School Name"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Year Graduated"
                            name="school_year"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="year"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    max={new Date().getFullYear()}
                                    min={1900}
                                    placeholder="Year Graduated"
                                    step={1}
                                    type="number"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Educational Attainment"
                            name="educational_attainment"
                            render={({ field }) => (
                                <EducationalAttainmentCombobox
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Program / Course"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Program / Course *"
                            name="program_course"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="course"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Program / Course"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Description"
                            name="description"
                            render={({ field }) => (
                                <TextEditor
                                    {...field}
                                    content={field.value}
                                    disabled={isDisabled(field.name)}
                                    placeholder="Description"
                                    textEditorClassName="!max-w-none bg-background"
                                />
                            )}
                        />
                    </fieldset>
                </fieldset>
                <FormFooterResetSubmit
                    className="sticky -bottom-5"
                    disableSubmit={!form.formState.isDirty}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                    readOnly={formProps.readOnly}
                    submitText={educationalAttainmentId ? 'Update' : 'Create'}
                />
            </form>
        </Form>
    )
}

export const MemberEducationalAttainmentCreateUpdateFormModal = ({
    title = 'Create Educational Attainment',
    description = 'Fill out the form to add or update educational attainment.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<IMemberEducationalAttainmentFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('', className)}
            description={description}
            title={title}
            {...props}
        >
            <MemberEducationalAttainmentCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default MemberEducationalAttainmentCreateUpdateForm
