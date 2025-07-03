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
import { Separator } from '@/components/ui/separator'

import { cn } from '@/lib/utils'

import { loanPurposeSchema } from '@/validations/loan/loan-purpose-schema'

import {
    useCreateLoanPurpose,
    useUpdateLoanPurpose,
} from '@/hooks/api-hooks/loan/use-loan-purpose'

import {
    IClassProps,
    IForm,
    ILoanPurpose,
    ILoanPurposeRequest,
    TEntityId,
    TIcon,
} from '@/types'

type TFormValues = z.infer<typeof loanPurposeSchema>

export interface ILoanPurposeFormProps
    extends IClassProps,
        IForm<Partial<ILoanPurposeRequest>, ILoanPurpose, string> {
    loanPurposeId?: TEntityId
}

const LoanPurposeCreateUpdateForm = ({
    readOnly,
    className,
    loanPurposeId,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
}: ILoanPurposeFormProps) => {
    const form = useForm<TFormValues>({
        resolver: zodResolver(loanPurposeSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            icon: '',
            description: '',
            ...defaultValues,
        },
    })

    const createMutation = useCreateLoanPurpose({ onSuccess, onError })
    const updateMutation = useUpdateLoanPurpose({ onSuccess, onError })

    const onSubmit = form.handleSubmit((formData) => {
        if (loanPurposeId) {
            updateMutation.mutate({ id: loanPurposeId, data: formData })
        } else {
            createMutation.mutate(formData)
        }
    })

    const { error, isPending } = loanPurposeId ? updateMutation : createMutation

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
                            name="icon"
                            label="Icon"
                            render={({ field }) => (
                                <IconCombobox
                                    {...field}
                                    value={field.value as TIcon}
                                    placeholder="Select purpose icon"
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
                            ) : loanPurposeId ? (
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

export const LoanPurposeCreateUpdateFormModal = ({
    title = 'Create Loan Purpose',
    description = 'Fill out the form to add a new loan purpose.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<ILoanPurposeFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <LoanPurposeCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default LoanPurposeCreateUpdateForm
