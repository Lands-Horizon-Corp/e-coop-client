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
                            name="include_header"
                            render={({ field }) => {
                                const id = field.name
                                return (
                                    <div className="border-input has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-gradient-to-br from-popover to-primary/40 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
                                        <Checkbox
                                            id={id}
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="order-1 after:absolute after:inset-0"
                                            aria-describedby={`${id}-description`}
                                        />
                                        <div className="flex grow items-start gap-x-3">
                                            <HeadingIcon />
                                            <div className="grid gap-2">
                                                <label
                                                    htmlFor={id}
                                                    className="font-medium"
                                                >
                                                    Include Header?{' '}
                                                    <span className="text-muted-foreground text-xs leading-[inherit] font-normal">
                                                        (Optional)
                                                    </span>
                                                </label>
                                                <p
                                                    id={`${id}-description`}
                                                    className="text-muted-foreground text-xs"
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
                            name="line_number"
                            label="Line No."
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="number"
                                    min={0}
                                    step="1"
                                    placeholder="Enter line number"
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
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
                    submitText={'Go'}
                    onReset={() => {
                        form.reset()
                    }}
                    resetText="Cancel"
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
            title={title}
            description={description}
            className={cn('', className)}
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
