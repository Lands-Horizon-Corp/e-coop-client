import z from 'zod'
import { useForm, Path } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Modal, { IModalProps } from '@/components/modals/modal'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import LoadingSpinner from '@/components/spinners/loading-spinner'

import { cn } from '@/lib/utils'
import { entityIdSchema } from '@/validations/common'
import {
    useCreateMemberProfileExpense,
    useUpdateMemberProfileExpense,
} from '@/hooks/api-hooks/member/use-member-profile-settings'

import { IForm, TEntityId, IClassProps, IMemberExpense } from '@/types'
import TextEditor from '@/components/text-editor'

export const memberExpenseSchema = z.object({
    id: entityIdSchema.optional(),
    member_profile_id: entityIdSchema.optional(),
    branch_id: entityIdSchema.optional(),
    name: z.string().min(1, 'Expense name is required'),
    amount: z.coerce.number(),
    date: z.string().min(1, 'Date is required'),
    description: z.string().min(1, 'Description is required'),
})

type TMemberExpenseFormValues = z.infer<typeof memberExpenseSchema>

export interface IMemberExpenseFormProps
    extends IClassProps,
        IForm<
            Partial<IMemberExpense>,
            IMemberExpense,
            string,
            TMemberExpenseFormValues
        > {
    memberProfileId: TEntityId
    expenseId?: TEntityId
}

const MemberExpenseCreateUpdateForm = ({
    memberProfileId,
    expenseId,
    readOnly,
    className,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
}: IMemberExpenseFormProps) => {
    const form = useForm<TMemberExpenseFormValues>({
        resolver: zodResolver(memberExpenseSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            amount: 0,
            date: '',
            description: '',
            member_profile_id: memberProfileId,
            ...defaultValues,
        },
    })

    const createMutation = useCreateMemberProfileExpense({
        onSuccess,
        onError,
        showMessage: true,
    })
    const updateMutation = useUpdateMemberProfileExpense({
        onSuccess,
        onError,
        showMessage: true,
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
    })

    const { error, isPending, reset } = expenseId
        ? updateMutation
        : createMutation

    const isDisabled = (field: Path<TMemberExpenseFormValues>) =>
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
                                name="date"
                                label="Date *"
                                render={({ field }) => (
                                    <Input
                                        type="date"
                                        {...field}
                                        placeholder="Date"
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
                            ) : expenseId ? (
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
