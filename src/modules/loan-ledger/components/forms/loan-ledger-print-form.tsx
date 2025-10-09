import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { HeadingIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Checkbox } from '@/components/ui/checkbox'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

export const LoanLedgerPrintSchema = z.object({
    include_header: z.boolean().default(false),
    line_number: z.coerce.number().min(0).default(0),
})

export type TLoanLedgerPrintSchema = z.infer<typeof LoanLedgerPrintSchema>

export interface ILoanLedgerPrintFormProps
    extends IClassProps,
        IForm<
            Partial<TLoanLedgerPrintSchema>,
            any,
            Error,
            TLoanLedgerPrintSchema
        > {
    loanLedgerId?: TEntityId
}

const LoanLedgerPrintForm = ({
    className,
    ...formProps
}: ILoanLedgerPrintFormProps) => {
    const form = useForm<TLoanLedgerPrintSchema>({
        resolver: standardSchemaResolver(LoanLedgerPrintSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            include_header: false,
            line_number: 0,
            ...formProps.defaultValues,
        },
    })

    //TODO: ADD const printMutation = usePrintLoanLedger()

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TLoanLedgerPrintSchema>({
            form,
            autoSave: formProps.autoSave,
            readOnly: formProps.readOnly,
            hiddenFields: formProps.hiddenFields,
            disabledFields: formProps.disabledFields,
            defaultValues: formProps.defaultValues,
        })

    const onSubmit = form.handleSubmit(async (formData) => {
        if (!formProps.loanLedgerId)
            return toast.warning('Missing loan ledger ID')

        // TODO: REPLACE WITH printMutation
        toast.promise(
            new Promise((resolve) => setTimeout(() => resolve(formData), 1000)),
            {
                loading: 'Printing ledger...',
                success: 'Ledger sent to printer',
                error: 'Error printing ledger',
            }
        )
        formProps.onSuccess?.(formData)
    }, handleFocusError)

    // Dummy error/loader
    const error = undefined
    const isPending = false

    return (
        <Form {...form}>
            <form
                className={cn('flex w-full flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="grid gap-x-6 gap-y-4 sm:gap-y-3"
                    disabled={isPending || formProps.readOnly}
                >
                    <fieldset className="space-y-3">
                        <FormFieldWrapper
                            control={form.control}
                            name="include_header"
                            render={({ field }) => {
                                const id = field.name
                                return (
                                    <div className="border-input has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-gradient-to-br from-popover to-primary/40 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
                                        <Checkbox
                                            aria-describedby={`${id}-description`}
                                            checked={field.value}
                                            className="order-1 after:absolute after:inset-0"
                                            id={id}
                                            onCheckedChange={field.onChange}
                                        />
                                        <div className="flex grow items-start gap-x-3">
                                            <HeadingIcon />
                                            <div className="grid gap-2">
                                                <label
                                                    className="font-medium"
                                                    htmlFor={id}
                                                >
                                                    Include Header?{' '}
                                                    <span className="text-muted-foreground text-xs leading-[inherit] font-normal">
                                                        (Optional)
                                                    </span>
                                                </label>
                                                <p
                                                    className="text-muted-foreground text-xs"
                                                    id={`${id}-description`}
                                                >
                                                    Include the header in the
                                                    printed ledger.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Line No."
                            name="line_number"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    min={0}
                                    placeholder="Enter line number"
                                    step="1"
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
                    submitText={'Go'}
                />
            </form>
        </Form>
    )
}

export const LoanLedgerPrintFormModal = ({
    title = 'Print Ledger',
    description = 'Print the ledger entry with your chosen options.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<ILoanLedgerPrintFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('', className)}
            description={description}
            title={title}
            {...props}
        >
            <LoanLedgerPrintForm
                {...formProps}
                onSuccess={(result) => {
                    formProps?.onSuccess?.(result)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default LoanLedgerPrintForm
