import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'

import { IClassProps, IForm, TEntityId } from '@/types'

export const LoanAddInterestSchema = z.object({
    interest: z.coerce.number().min(0).default(0),
    interest_amortization: z.coerce.number().min(0).default(0),
})

export type TLoanAddInterestSchema = z.infer<typeof LoanAddInterestSchema>

export interface ILoanAddInterestFormProps
    extends IClassProps,
        IForm<
            Partial<TLoanAddInterestSchema>,
            any,
            Error,
            TLoanAddInterestSchema
        > {
    loanTransactionId?: TEntityId
}

const LoanAddInterestForm = ({
    className,
    ...formProps
}: ILoanAddInterestFormProps) => {
    const form = useForm<TLoanAddInterestSchema>({
        resolver: standardSchemaResolver(LoanAddInterestSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            interest: 0,
            interest_amortization: 0,
            ...formProps.defaultValues,
        },
    })

    // TODO: ADD const addInterestMutation = useAddLoanInterest()

    const onSubmit = form.handleSubmit(async (formData) => {
        if (!formProps.loanTransactionId)
            return toast.warning('Loan Transaction ID is required')

        // TODO: REPLACE WITH addInterestMutation
        formProps.onSuccess?.(formData)

        toast.promise(
            new Promise((resolve) => setTimeout(() => resolve(formData), 1000)),
            {
                loading: 'Adding interest...',
                success: 'Interest added successfully',
                error: 'Error',
            }
        )
    })

    const error = undefined
    const isPending = false

    return (
        <Form {...form}>
            <form
                className={cn('flex w-full flex-col gap-y-4', className)}
                onSubmit={onSubmit}
            >
                <fieldset
                    className="grid gap-x-6 gap-y-4 sm:gap-y-3"
                    disabled={isPending || formProps.readOnly}
                >
                    <fieldset className="space-y-3">
                        <FormFieldWrapper
                            control={form.control}
                            label="Interest"
                            name="interest"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="off"
                                    id={field.name}
                                    min={0}
                                    placeholder="Enter interest"
                                    step="0.01"
                                    type="number"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Int. Amort."
                            name="interest_amortization"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="off"
                                    id={field.name}
                                    min={0}
                                    placeholder="Enter interest amortization"
                                    step="0.01"
                                    type="number"
                                />
                            )}
                        />
                    </fieldset>
                </fieldset>
                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                    }}
                    readOnly={formProps.readOnly}
                    resetText="Cancel"
                    submitText={'Accept'}
                />
            </form>
        </Form>
    )
}

export const LoanAddInterestFormModal = ({
    title = 'Add Interest Amount',
    description = '',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<ILoanAddInterestFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('', className)}
            description={description}
            title={title}
            {...props}
        >
            <LoanAddInterestForm
                {...formProps}
                onSuccess={(result) => {
                    formProps?.onSuccess?.(result)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default LoanAddInterestForm
