import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'
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
    useCreateMemberProfileExpense,
    useUpdateMemberProfileExpense,
} from '../../member-expense.service'
import { IMemberExpense } from '../../member-expense.types'
import { MemberExpenseSchema } from '../../member-expense.validation'

type TMemberExpenseFormValues = z.infer<typeof MemberExpenseSchema>

export interface IMemberExpenseFormProps
    extends IClassProps,
        IForm<
            Partial<TMemberExpenseFormValues>,
            IMemberExpense,
            Error,
            TMemberExpenseFormValues
        > {
    memberProfileId: TEntityId
    expenseId?: TEntityId
}

const MemberExpenseCreateUpdateForm = ({
    memberProfileId,
    expenseId,
    className,
    ...formProps
}: IMemberExpenseFormProps) => {
    const form = useForm<TMemberExpenseFormValues>({
        resolver: standardSchemaResolver(MemberExpenseSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            amount: 0,
            description: '',
            member_profile_id: memberProfileId,
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateMemberProfileExpense({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Created',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })
    const updateMutation = useUpdateMemberProfileExpense({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Updated',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TMemberExpenseFormValues>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((formData) => {
        if (expenseId) {
            updateMutation.mutate({
                memberProfileId,
                expenseId,
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
    } = expenseId ? updateMutation : createMutation

    const error = serverRequestErrExtractor({ error: rawError })

    return (
        <Form {...form}>
            <form
                ref={formRef}
                onSubmit={onSubmit}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isPending || formProps.readOnly}
                    className="grid gap-x-6 gap-y-4 sm:gap-y-3"
                >
                    <fieldset className="space-y-3">
                        <FormFieldWrapper
                            control={form.control}
                            name="name"
                            label="Expense Name *"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Expense Name"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
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
                            name="description"
                            label="Description *"
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
                    </fieldset>
                </fieldset>
                <FormFooterResetSubmit
                    error={error}
                    readOnly={formProps.readOnly}
                    isLoading={isPending}
                    disableSubmit={!form.formState.isDirty}
                    submitText={expenseId ? 'Update' : 'Create'}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                />
            </form>
        </Form>
    )
}

export const MemberExpenseCreateUpdateFormModal = ({
    title = 'Create Expense',
    description = 'Fill out the form to add or update expense.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<IMemberExpenseFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <MemberExpenseCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default MemberExpenseCreateUpdateForm
