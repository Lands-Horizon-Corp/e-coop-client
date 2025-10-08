import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import {
    GenderSchema,
    IMemberGender,
    IMemberGenderRequest,
    useCreate,
    useUpdateById,
} from '@/modules/member-gender'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

type TGenderFormValues = z.infer<typeof GenderSchema>

export interface IMemberGenderFormProps
    extends IClassProps,
        IForm<Partial<IMemberGenderRequest>, IMemberGender, Error> {
    genderId?: TEntityId
}

const MemberGenderCreateUpdateForm = ({
    genderId,
    className,
    ...formProps
}: IMemberGenderFormProps) => {
    const form = useForm<TGenderFormValues>({
        resolver: standardSchemaResolver(GenderSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            description: '',
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreate({
        options: { onSuccess: formProps.onSuccess, onError: formProps.onError },
    })
    const updateMutation = useUpdateById({
        options: { onSuccess: formProps.onSuccess, onError: formProps.onError },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TGenderFormValues>({
            form,
            ...formProps,
            autoSaveDelay: 2000,
        })

    const onSubmit = form.handleSubmit((formData) => {
        if (genderId) {
            updateMutation.mutate({ id: genderId, payload: formData })
        } else {
            createMutation.mutate(formData)
        }
    }, handleFocusError)

    const {
        error: rawError,
        isPending,
        reset,
    } = genderId ? updateMutation : createMutation

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
                            label="Name"
                            name="name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="gender-name"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Gender Name"
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
                                    autoComplete="gender-description"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Description"
                                />
                            )}
                        />
                    </fieldset>
                </fieldset>
                {!genderId && (
                    <FormFooterResetSubmit
                        disableSubmit={!form.formState.isDirty}
                        error={error}
                        isLoading={isPending}
                        onReset={() => {
                            form.reset()
                            reset()
                        }}
                        readOnly={formProps.readOnly}
                        submitText={genderId ? 'Update' : 'Create'}
                    />
                )}
            </form>
        </Form>
    )
}

export const MemberGenderCreateUpdateFormModal = ({
    title = 'Create Gender',
    description = 'Fill out the form to add a new gender.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IMemberGenderFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('', className)}
            description={description}
            title={title}
            {...props}
        >
            <MemberGenderCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    if (!formProps?.genderId) {
                        props.onOpenChange?.(false)
                    }
                }}
            />
        </Modal>
    )
}

export default MemberGenderCreateUpdateForm
