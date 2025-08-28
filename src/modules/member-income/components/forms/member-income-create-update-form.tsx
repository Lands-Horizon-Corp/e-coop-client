import { Path, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'
import { toInputDateString } from '@/helpers/date-utils'
import { IMedia } from '@/modules/media'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import ImageField from '@/components/ui/image-field'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    useCreateMemberProfileIncome,
    useUpdateMemberProfileIncome,
} from '../../member-income.service'
import { IMemberIncome } from '../../member-income.types'
import { MemberIncomeSchema } from '../../member-income.validation'

type TMemberIncomeFormValues = z.infer<typeof MemberIncomeSchema>

export interface IMemberIncomeFormProps
    extends IClassProps,
        IForm<
            Partial<TMemberIncomeFormValues>,
            IMemberIncome,
            string,
            TMemberIncomeFormValues
        > {
    memberProfileId: TEntityId
    incomeId?: TEntityId
}

const MemberIncomeCreateUpdateForm = ({
    memberProfileId,
    incomeId,
    readOnly,
    className,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
}: IMemberIncomeFormProps) => {
    const form = useForm<TMemberIncomeFormValues>({
        resolver: standardSchemaResolver(MemberIncomeSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            source: '',
            amount: 0,
            name: '',
            ...defaultValues,
            release_date: toInputDateString(
                defaultValues?.release_date ?? new Date()
            ),
        },
    })

    const createMutation = useCreateMemberProfileIncome({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Created',
                onSuccess,
                onError,
            }),
        },
    })

    const updateMutation = useUpdateMemberProfileIncome({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Updated',
                onSuccess,
                onError,
            }),
        },
    })

    const onSubmit = form.handleSubmit((formData) => {
        if (incomeId) {
            updateMutation.mutate({
                memberProfileId,
                incomeId,
                data: formData,
            })
        } else {
            createMutation.mutate({
                memberProfileId,
                data: formData,
            })
        }
    })

    const { error, isPending, reset } = incomeId
        ? updateMutation
        : createMutation

    const isDisabled = (field: Path<TMemberIncomeFormValues>) =>
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
                            name="source"
                            label="Income Source *"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Income Source"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <div className="grid grid-cols-2 gap-x-2">
                            <FormFieldWrapper
                                control={form.control}
                                name="amount"
                                label="Amount *"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id={field.name}
                                        type="number"
                                        placeholder="Amount"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="release_date"
                                label="Date Received *"
                                className="relative"
                                description="mm/dd/yyyy"
                                descriptionClassName="absolute top-0 right-0"
                                render={({ field }) => (
                                    <InputDate
                                        {...field}
                                        placeholder="Release Date"
                                        className="block"
                                        value={field.value ?? ''}
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                        </div>
                        <FormFieldWrapper
                            control={form.control}
                            name="media_id"
                            label="Photo"
                            render={({ field }) => {
                                const value = form.watch('media')

                                return (
                                    <ImageField
                                        {...field}
                                        placeholder="Upload Income Photo"
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
                <FormFooterResetSubmit
                    error={error}
                    readOnly={readOnly}
                    isLoading={isPending}
                    disableSubmit={!form.formState.isDirty}
                    submitText={incomeId ? 'Update' : 'Create'}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                />
            </form>
        </Form>
    )
}

export const MemberIncomeCreateUpdateFormModal = ({
    title = 'Create Income',
    description = 'Fill out the form to add or update income.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<IMemberIncomeFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <MemberIncomeCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default MemberIncomeCreateUpdateForm
