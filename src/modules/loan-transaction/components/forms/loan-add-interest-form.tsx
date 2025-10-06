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
                            name="interest"
                            label="Interest"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    placeholder="Enter interest"
                                    autoComplete="off"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="interest_amortization"
                            label="Int. Amort."
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    placeholder="Enter interest amortization"
                                    autoComplete="off"
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
                    submitText={'Accept'}
                    onReset={() => {
                        form.reset()
                    }}
                    resetText="Cancel"
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
            title={title}
            description={description}
            className={cn('', className)}
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
