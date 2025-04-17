import Modal, { IModalProps } from '@/components/modals/modal'
import { cn } from '@/lib'
import { IForm } from '@/types/components'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { Separator } from '@/components/ui/separator'
import { IClassProps } from '@/types'
import { AccountsComputationTypeRequestSchema } from '@/validations/accounting/computation-type-schema'
import { IAccountsComputationTypeRequest } from '@/server/types/accounts/computation-type'
import {
    useCreateComputationType,
    useUpdateComputationType,
} from '@/hooks/api-hooks/accounting/use-computation-type'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import FormErrorMessage from '@/components/ui/form-error-message'
import { TEntityId } from '@/server'

type TComputationTypeCreateForm = z.infer<
    typeof AccountsComputationTypeRequestSchema
>

interface IComputationTypeCreateFormProps
    extends IClassProps,
        IForm<Partial<IAccountsComputationTypeRequest>, unknown, string> {
    computationTypeId?: TEntityId
}

const ComputationTypeCreateForm = ({
    readOnly,
    className,
    onSuccess,
    onError,
    computationTypeId,
}: IComputationTypeCreateFormProps) => {
    const isUpdateMode = Boolean(computationTypeId)

    const form = useForm<TComputationTypeCreateForm>({
        resolver: zodResolver(AccountsComputationTypeRequestSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            id: '',
            companyId: '',
            name: '',
            description: '',
        },
    })

    const {
        error: createError,
        isPending: isCreating,
        mutate: createComputationType,
    } = useCreateComputationType({
        onSuccess,
        onError: (err) => {
            onError?.(err as string)
        },
    })

    const {
        error: updateError,
        isPending: isUpdating,
        mutate: updateComputationType,
    } = useUpdateComputationType({
        onSuccess,
        onError: (err) => {
            onError?.(err as string)
        },
    })

    const onSubmit = (formData: TComputationTypeCreateForm) => {
        if (isUpdateMode && computationTypeId) {
            updateComputationType({ id: computationTypeId, data: formData })
        } else {
            createComputationType(formData)
        }
    }

    return (
        <Form {...form}>
            <Separator />
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn('flex max-w-3xl flex-col gap-y-6', className)}
            >
                <fieldset
                    disabled={readOnly}
                    className="grid grid-cols-1 gap-x-6 gap-y-6"
                >
                    <FormField
                        name="name"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Enter Name"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="description"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Enter Description"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </fieldset>
                <FormErrorMessage errorMessage={createError || updateError} />
                <div className="flex items-center justify-end gap-x-2">
                    <Button
                        type="button"
                        variant="ghost"
                        disabled={isCreating || isUpdating || readOnly}
                        onClick={() => form.reset()}
                        className="w-full self-end px-8 sm:w-fit"
                    >
                        Reset
                    </Button>
                    <Button
                        type="submit"
                        disabled={isCreating || isUpdating || readOnly}
                        className="w-full self-end px-8 sm:w-fit"
                    >
                        {isCreating ? <LoadingSpinner /> : 'Create'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export const ComputationTypeCreateFormModal = ({
    title = 'Create Computation Type',
    description = 'Fill out the form to add a new computation type.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IComputationTypeCreateFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('sm:max-w-full lg:max-w-3xl', className)}
            {...props}
        >
            <ComputationTypeCreateForm {...formProps} />
        </Modal>
    )
}

export default ComputationTypeCreateForm
