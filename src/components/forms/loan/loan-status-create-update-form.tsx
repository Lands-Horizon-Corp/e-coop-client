import z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { Path, useForm } from 'react-hook-form'

import IconCombobox from '@/components/comboboxes/icon-combobox'
import Modal, { IModalProps } from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import TextEditor from '@/components/text-editor'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

import { cn } from '@/lib/utils'

import { loanStatusSchema } from '@/validations/loan/loan-status-schema'

import {
    useCreateLoanStatus,
    useUpdateLoanStatus,
} from '@/hooks/api-hooks/loan/use-loan-status'

import {
    IClassProps,
    IForm,
    ILoanStatus,
    ILoanStatusRequest,
    TEntityId,
    TIcon,
} from '@/types'

type TFormValues = z.infer<typeof loanStatusSchema>

export interface ILoanStatusFormProps
    extends IClassProps,
        IForm<Partial<ILoanStatusRequest>, ILoanStatus, string> {
    loanStatusId?: TEntityId
}

const LoanStatusCreateUpdateForm = ({
    readOnly,
    className,
    loanStatusId,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
}: ILoanStatusFormProps) => {
    const form = useForm<TFormValues>({
        resolver: zodResolver(loanStatusSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            icon: '',
            color: '',
            description: '',
            ...defaultValues,
        },
    })

    const createMutation = useCreateLoanStatus({ onSuccess, onError })
    const updateMutation = useUpdateLoanStatus({ onSuccess, onError })

    const onSubmit = form.handleSubmit((formData) => {
        if (loanStatusId) {
            updateMutation.mutate({ id: loanStatusId, data: formData })
        } else {
            createMutation.mutate(formData)
        }
    })

    const { error, isPending } = loanStatusId ? updateMutation : createMutation

    const isDisabled = (field: Path<TFormValues>) =>
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
                            label="Name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Loan Status Name"
                                    autoComplete="loan-status-name"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <div className="grid gap-x-2 md:grid-cols-2">
                            <FormFieldWrapper
                                control={form.control}
                                name="icon"
                                label="Icon"
                                render={({ field }) => (
                                    <IconCombobox
                                        {...field}
                                        value={field.value as TIcon}
                                        placeholder="Select status icon"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="color"
                                label={'color'}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="color"
                                        id={field.name}
                                        placeholder="Color"
                                        autoComplete="loan-status-color"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                        </div>
                        <FormFieldWrapper
                            control={form.control}
                            name="description"
                            label="Description"
                            render={({ field }) => (
                                <TextEditor
                                    {...field}
                                    content={field.value}
                                    placeholder="Description"
                                    disabled={isDisabled(field.name)}
                                    textEditorClassName="bg-background"
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
                            onClick={() => form.reset()}
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
                            ) : loanStatusId ? (
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

export const LoanStatusCreateUpdateFormModal = ({
    title = 'Create Loan Status',
    description = 'Fill out the form to add a new loan status.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<ILoanStatusFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <LoanStatusCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default LoanStatusCreateUpdateForm
