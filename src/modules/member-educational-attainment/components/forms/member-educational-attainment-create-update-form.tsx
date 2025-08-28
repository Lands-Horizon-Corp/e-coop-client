import { Path, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import TextEditor from '@/components/text-editor'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'

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
    readOnly,
    className,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
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
            ...defaultValues,
        },
    })

    const createMutation = useCreateEducationalAttainmentForMember({
        options: {
            onSuccess,
            onError,
        },
    })

    const updateMutation = useUpdateEducationalAttainmentForMember({
        options: {
            onSuccess,
            onError,
        },
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
    })

    const { error, isPending, reset } = educationalAttainmentId
        ? updateMutation
        : createMutation

    const isDisabled = (field: Path<TEducationalAttainmentFormValues>) =>
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
                            name="school_name"
                            label="School Name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="School Name"
                                    autoComplete="organization"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="school_year"
                            label="Year Graduated"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="number"
                                    step={1}
                                    min={1900}
                                    max={new Date().getFullYear()}
                                    placeholder="Year Graduated"
                                    autoComplete="year"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="educational_attainment"
                            label="Educational Attainment"
                            render={({ field }) => (
                                <EducationalAttainmentCombobox
                                    {...field}
                                    id={field.name}
                                    placeholder="Program / Course"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="program_course"
                            label="Program / Course *"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Program / Course"
                                    autoComplete="course"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="description"
                            label="Description"
                            render={({ field }) => (
                                <TextEditor
                                    {...field}
                                    content={field.value}
                                    placeholder="Description"
                                    textEditorClassName="!max-w-none bg-background"
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
                    submitText={educationalAttainmentId ? 'Update' : 'Create'}
                    className="sticky -bottom-5"
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
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
            title={title}
            description={description}
            className={cn('', className)}
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
