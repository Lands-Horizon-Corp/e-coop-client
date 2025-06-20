import z from 'zod'
import { useForm, Path } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import ImageField from '../../../ui/image-field'
import { Separator } from '@/components/ui/separator'
import Modal, { IModalProps } from '@/components/modals/modal'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import LoadingSpinner from '@/components/spinners/loading-spinner'

import { cn } from '@/lib/utils'
import { entityIdSchema } from '@/validations/common'
import {
    useCreateMemberProfileIncome,
    useUpdateMemberProfileIncome,
} from '@/hooks/api-hooks/member/use-member-profile-settings'

import { IForm, TEntityId, IClassProps, IMemberIncome, IMedia } from '@/types'
import { toInputDateString } from '@/utils'

export const memberIncomeSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Name is required'),
    source: z.string().min(1, 'Income source is required'),
    amount: z.coerce.number(),
    release_date: z.coerce
        .string()
        .date()
        .transform((val) => new Date(val).toISOString()),
    media_id: entityIdSchema.optional(),
    media: z.any(),
})

type TMemberIncomeFormValues = z.infer<typeof memberIncomeSchema>

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
        resolver: zodResolver(memberIncomeSchema),
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
        onSuccess,
        onError,
        showMessage: true,
    })
    const updateMutation = useUpdateMemberProfileIncome({
        onSuccess,
        onError,
        showMessage: true,
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
                                render={({ field }) => (
                                    <Input
                                        type="date"
                                        {...field}
                                        placeholder="Release Date"
                                        className="block [&::-webkit-calendar-picker-indicator]:hidden"
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
                            ) : incomeId ? (
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
