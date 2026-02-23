import { useCallback, useEffect } from 'react'

import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import {
    IJournalVoucher,
    JournalVoucherPrintSchema,
    TJournalVoucherPrintSchema,
    TORJournalVoucherSettings,
    usePrintJournalVoucherTransaction,
} from '@/modules/journal-voucher'
import { useHotkeys } from 'react-hotkeys-hook'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    buildJournalVoucherOR,
    isAllowedInputJournalVoucherOR,
} from '../../journal-voucher.utils'

export interface IJournalVoucherPrintFormProps
    extends
        IClassProps,
        IForm<
            Partial<TJournalVoucherPrintSchema>,
            IJournalVoucher,
            Error,
            TJournalVoucherPrintSchema
        > {
    journalVoucherId: TEntityId
    orSettings?: TORJournalVoucherSettings
}

const JournalVoucherPrintForm = ({
    journalVoucherId,
    className,
    orSettings,
    ...formProps
}: IJournalVoucherPrintFormProps) => {
    const form = useForm<TJournalVoucherPrintSchema>({
        resolver: standardSchemaResolver(JournalVoucherPrintSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            cash_voucher_number: '',
            ...formProps.defaultValues,
        },
    })

    const printMutation = usePrintJournalVoucherTransaction({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TJournalVoucherPrintSchema>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit(async (payload) => {
        toast.promise(
            printMutation.mutateAsync({
                journalVoucherId,
                payload,
            }),
            {
                loading: 'Printing Journal Voucher...',
                success: 'Journal Voucher Printed',
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
                    'Failed to generate Journal Voucher OR, could not retrieve settings'
                )

            if (isAuto) {
                form.setValue(
                    'cash_voucher_number',
                    buildJournalVoucherOR(orSettings)
                )
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
            !form.getValues('cash_voucher_number') &&
            (!orSettings?.journal_voucher_allow_user_input ||
                orSettings?.journal_voucher_auto_increment)

        if (!shouldGenerate) return

        handleAutoGenerateOR(true)
    }, [orSettings, form, handleAutoGenerateOR])

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
                    <FormFieldWrapper
                        control={form.control}
                        label="Voucher *"
                        name="cash_voucher_number"
                        render={({ field }) => (
                            <Input
                                {...field}
                                autoComplete="off"
                                disabled={
                                    isDisabled(field.name) ||
                                    !isAllowedInputJournalVoucherOR(orSettings)
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
    )
}

export const JournalVoucherPrintFormModal = ({
    className,
    formProps,
    title = 'Journal Voucher Print',
    description = 'Input required details to print the Journal Voucher.',
    ...props
}: IModalProps & {
    formProps: Omit<IJournalVoucherPrintFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('max-w-lg!', className)}
            description={description}
            title={title}
            {...props}
        >
            <JournalVoucherPrintForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default JournalVoucherPrintFormModal
