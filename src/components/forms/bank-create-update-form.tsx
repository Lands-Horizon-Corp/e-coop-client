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
import { useCreateBank, useUpdateBank } from '@/hooks/api-hooks/use-bank'

import {
    IForm,
    IClassProps,
    IBankRequest,
    IBank,
    TEntityId,
    IMedia,
} from '@/types'
import ImageField from '../ui/image-field'
import { Textarea } from '../ui/textarea'

const bankSchema = z.object({
    name: z.string().min(1, 'Bank name is required'),
    media_id: entityIdSchema.optional(),
    media: z.any(),
    description: z.string(),
})

type TBankFormValues = z.infer<typeof bankSchema>

export interface IBankFormProps
    extends IClassProps,
        IForm<Partial<IBankRequest>, IBank, string, TBankFormValues> {
    bankId?: TEntityId
}

const BankCreateUpdateForm = ({
    bankId,
    readOnly,
    className,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
}: IBankFormProps) => {
    const form = useForm<TBankFormValues>({
        resolver: zodResolver(bankSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            description: '',
            ...defaultValues,
        },
    })

    const createMutation = useCreateBank({ onSuccess, onError })
    const updateMutation = useUpdateBank({ onSuccess, onError })

    const onSubmit = form.handleSubmit((formData) => {
        if (bankId) {
            updateMutation.mutate({ bankId, data: formData })
        } else {
            createMutation.mutate(formData)
        }
    })

    const { error, isPending, reset } = bankId ? updateMutation : createMutation

    const isDisabled = (field: Path<TBankFormValues>) =>
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
                            label="Bank Name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Bank Name"
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="media_id"
                            label="Bank Photo"
                            render={({ field }) => {
                                const value = form.watch('media')

                                return (
                                    <ImageField
                                        {...field}
                                        placeholder="Upload Bank Photo"
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
                        <FormFieldWrapper
                            control={form.control}
                            name="description"
                            label="Description"
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    id={field.name}
                                    autoComplete="off"
                                    placeholder="Description"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                    </fieldset>
                </fieldset>
                <Separator />
                <div className="space-y-2">
                    <FormErrorMessage errorMessage={error} />
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
                            size="sm"
                            type="submit"
                            disabled={isPending}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            {isPending ? (
                                <LoadingSpinner />
                            ) : bankId ? (
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

export const BankCreateUpdateFormModal = ({
    title = 'Create Bank',
    description = 'Fill out the form to add a new bank.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IBankFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <BankCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default BankCreateUpdateForm
