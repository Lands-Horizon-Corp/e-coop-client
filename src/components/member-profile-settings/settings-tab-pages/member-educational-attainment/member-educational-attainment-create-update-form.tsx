import z from 'zod'
import { useForm, Path } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import TextEditor from '@/components/text-editor'
import { Separator } from '@/components/ui/separator'
import Modal, { IModalProps } from '@/components/modals/modal'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import EducationalAttainmentCombobox from '@/components/comboboxes/educational-attainment-combobox'

import { cn } from '@/lib/utils'
import { entityIdSchema } from '@/validations/common'
import { EDUCATIONAL_ATTAINMENT } from '@/constants'
import {
    useCreateEducationalAttainmentForMember,
    useUpdateEducationalAttainmentForMember,
} from '@/hooks/api-hooks/member/use-member-profile-settings'

import {
    IForm,
    TEntityId,
    IClassProps,
    IMemberEducationalAttainment,
} from '@/types'

export const memberEducationalAttainmentSchema = z.object({
    id: z.string().optional(),
    branch_id: entityIdSchema.optional(),
    member_profile_id: entityIdSchema,
    name: z.string().min(1, 'Name is required'),
    school_name: z.string().min(1, 'School name is required').optional(),
    school_year: z.coerce
        .number({ invalid_type_error: 'Invalid Year' })
        .transform((val) => Math.trunc(val))
        .refine(
            (val) => {
                const year = Number(val)
                const currentYear = new Date().getFullYear()
                return year >= 1900 && year <= currentYear + 1
            },
            { message: 'Enter a valid school year' }
        )
        .optional(),
    program_course: z.string().min(1, 'Program/Course is required').optional(),
    educational_attainment: z.enum(EDUCATIONAL_ATTAINMENT, {
        required_error: 'Educational attainment is required',
    }),
    description: z.string().optional(),
})

type TEducationalAttainmentFormValues = z.infer<
    typeof memberEducationalAttainmentSchema
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
        resolver: zodResolver(memberEducationalAttainmentSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            description: '',
            program_course: '',
            school_year: new Date().getFullYear(),
            educational_attainment: 'college graduate',
            ...defaultValues,
        },
    })

    const createMutation = useCreateEducationalAttainmentForMember({
        onSuccess,
        onError,
        showMessage: true,
    })
    const updateMutation = useUpdateEducationalAttainmentForMember({
        onSuccess,
        onError,
        showMessage: true,
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
                            name="name"
                            label="Name *"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Name"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
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
                                    placeholder="Description"
                                    textEditorClassName="!max-w-none bg-background"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
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
                            ) : educationalAttainmentId ? (
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
