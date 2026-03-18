import { useCallback, useEffect } from 'react'

import { UseFormReturn, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { toInputDateString } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { TPrintSettingsSchema } from '@/modules/generated-report'
import { PrintConfigSectionDialog } from '@/modules/generated-report/components/forms/print-config-section'
import { useHotkeys } from 'react-hotkeys-hook'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import { usePrintLoanTransaction } from '../../loan-transaction.service'
import {
    ILoanTransaction,
    TORLoanVoucherSettings,
} from '../../loan-transaction.types'
import {
    buildLoanVoucherOR,
    isAllowedInputLoanTransactionOR,
} from '../../loan-transaction.utils'
import {
    LoanTransactionPrintSchema,
    TLoanTransactionPrintSchema,
} from '../../loan-transaction.validation'

export interface ILoanTransactionPrintFormProps
    extends
        IClassProps,
        IForm<
            Partial<TLoanTransactionPrintSchema>,
            ILoanTransaction,
            Error,
            TLoanTransactionPrintSchema
        > {
    loanTransactionId: TEntityId
    orSettings?: TORLoanVoucherSettings
}

const LoanTransactionPrintForm = ({
    loanTransactionId,
    className,
    orSettings,
    ...formProps
}: ILoanTransactionPrintFormProps) => {
    const form = useForm<TLoanTransactionPrintSchema>({
        resolver: standardSchemaResolver(LoanTransactionPrintSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            voucher: '',
            check_number: '',
            ...formProps.defaultValues,
            module: formProps.defaultValues?.module ?? 'loan-transaction',
            check_date: toInputDateString(
                formProps.defaultValues?.check_date || new Date()
            ),
        },
    })

    const printMutation = usePrintLoanTransaction({
        options: {
            onSuccess: (loan) => {
                formProps.onSuccess?.(loan)
            },
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TLoanTransactionPrintSchema>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit(async (payload) => {
        toast.promise(
            printMutation.mutateAsync({ loanTransactionId, payload }),
            {
                loading: 'Printing...',
                success: 'Loan Printed',
                error: (error) =>
                    `Something went wrong: ${serverRequestErrExtractor({ error })}`,
            }
        )
    }, handleFocusError)

    const { error: rawError, isPending, reset } = printMutation

    const error = serverRequestErrExtractor({ error: rawError })

    const handleAutoGenerateOR = useCallback(
        (isAuto?: boolean) => {
            form.setValue('or_auto_generated', isAuto)

            if (!orSettings)
                return toast.warning(
                    'Failed to generate Cash Check OR, could not retrieve settings'
                )

            if (isAuto) {
                form.setValue('voucher', buildLoanVoucherOR(orSettings))
            }
        },
        [orSettings, form]
    )

    useHotkeys(
        'alt + E',
        (e) => {
            e.preventDefault()
            handleAutoGenerateOR(!form.getValues('or_auto_generated'))
        },
        { enableOnFormTags: true },
        [orSettings, form, handleAutoGenerateOR]
    )

    useEffect(() => {
        const shouldGenerate =
            !form.getValues('voucher') &&
            (!orSettings?.loan_voucher_allow_user_input ||
                orSettings?.loan_voucher_auto_increment)

        if (!shouldGenerate) return

        handleAutoGenerateOR(true)
    }, [orSettings, form, handleAutoGenerateOR])

    useEffect(() => {
        if (!formProps.defaultValues?.voucher) return
        const currentName = form.getValues('name')
        if (currentName) return

        form.setValue(
            'name',
            `loan_voucher_${form.getValues('voucher')}_release`
        )
    }, [form, formProps])

    return (
        <>
            <Form {...form}>
                <form
                    autoComplete="off"
                    className={cn('flex w-full flex-col gap-y-4', className)}
                    onSubmit={onSubmit}
                    ref={formRef}
                >
                    <fieldset
                        className="grid gap-x-6 gap-y-4 sm:gap-y-3"
                        disabled={isPending || formProps.readOnly}
                    >
                        <FormFieldWrapper
                            control={form.control}
                            label="Voucher *"
                            name="voucher"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="off"
                                    disabled={
                                        isDisabled(field.name) ||
                                        !isAllowedInputLoanTransactionOR(
                                            orSettings
                                        )
                                    }
                                    id={field.name}
                                    placeholder="Voucher Number"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            className=""
                            control={form.control}
                            labelClassName="text-xs font-medium text-muted-foreground"
                            name="or_auto_generated"
                            render={({ field }) => (
                                <div className="flex items-center">
                                    <Switch
                                        checked={field.value}
                                        className="mr-2 max-h-4 max-w-9"
                                        onCheckedChange={(value) => {
                                            handleAutoGenerateOR(value)
                                            field.onChange(value)
                                        }}
                                        thumbClassName="size-3"
                                    />
                                    <Label className="text-xs font-medium text-muted-foreground mr-1">
                                        OR Auto Generated
                                    </Label>
                                    <Label className="text-xs font-medium text-muted-foreground">
                                        Press Alt{' '}
                                        <KbdGroup>
                                            <Kbd>Alt</Kbd>
                                            <span>+</span>
                                            <Kbd>E</Kbd>
                                        </KbdGroup>
                                    </Label>
                                </div>
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Check Number"
                            name="check_number"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Check Number (optional)"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Check Date"
                            name="check_date"
                            render={({ field }) => (
                                <InputDate
                                    {...field}
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Check Date"
                                    type="date"
                                />
                            )}
                        />
                        <PrintConfigSectionDialog
                            printConfigProps={{
                                // whe're sure na the form instance have the print settings schema LMAO XD
                                form: form as unknown as UseFormReturn<TPrintSettingsSchema>,
                                registryKey: 'loan_transaction_print_voucher',
                            }}
                        />
                    </fieldset>
                    <FormFooterResetSubmit
                        disableSubmit={!form.formState.isDirty || isPending}
                        error={error}
                        isLoading={isPending}
                        onReset={() => {
                            form.reset()
                            reset?.()
                        }}
                        readOnly={formProps.readOnly}
                        submitText="Print"
                    />
                </form>
            </Form>
        </>
    )
}

export const LoanTransactionPrintFormModal = ({
    className,
    formProps,
    title = 'Loan Print',
    description = 'Print loan',
    ...props
}: IModalProps & {
    formProps: Omit<ILoanTransactionPrintFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('!max-w-lg', className)}
            description={description}
            title={title}
            {...props}
        >
            <LoanTransactionPrintForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default LoanTransactionPrintForm
