import { UseFormReturn, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import {
    IGeneratedReport,
    TWithReportConfigSchema,
} from '@/modules/generated-report'
import { PrintSettingsSection } from '@/modules/generated-report/components/forms/print-config-section'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import { useReprintJournalVoucherTransaction } from '../../journal-voucher.service'
import {
    JournalVoucherReprintSchema,
    TJournalVoucherReprintSchema,
} from '../../journal-voucher.validation'

export interface IJournalVoucherReprintFormProps
    extends
        IClassProps,
        IForm<
            Partial<TJournalVoucherReprintSchema>,
            IGeneratedReport,
            Error,
            TJournalVoucherReprintSchema
        > {
    journalVoucherId: TEntityId
}

const JournalVoucherReprintForm = ({
    journalVoucherId,
    className,
    ...formProps
}: IJournalVoucherReprintFormProps) => {
    const form = useForm<TJournalVoucherReprintSchema>({
        resolver: standardSchemaResolver(JournalVoucherReprintSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            ...formProps.defaultValues,
        },
    })

    const printMutation = useReprintJournalVoucherTransaction({
        options: {
            onSuccess: (generatedReport) => {
                formProps.onSuccess?.(generatedReport)
            },
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError } =
        useFormHelper<TJournalVoucherReprintSchema>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit(async ({ report_config, ...rest }) => {
        toast.promise(
            printMutation.mutateAsync({
                journalVoucherId,
                payload: {
                    ...rest,
                    report_config: {
                        ...report_config,
                        filters: {
                            journal_voucher_id: journalVoucherId,
                        },
                    },
                },
            }),
            {
                loading: 'Printing...',
                success: 'Journal Voucher Reprinted',
                error: (error) =>
                    `Something went wrong: ${serverRequestErrExtractor({ error })}`,
            }
        )
    }, handleFocusError)

    const { error: rawError, isPending, reset } = printMutation

    const error = serverRequestErrExtractor({ error: rawError })

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
                        <PrintSettingsSection
                            form={
                                form as unknown as UseFormReturn<TWithReportConfigSchema>
                            }
                            registryKey={'journal_voucher_print_template'}
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

export const JournalVoucherReprintFormModal = ({
    className,
    formProps,
    title = 'Journal Voucher Print',
    description = 'Print journal voucher',
    ...props
}: IModalProps & {
    formProps: Omit<IJournalVoucherReprintFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('!max-w-lg', className)}
            description={description}
            title={title}
            {...props}
        >
            <JournalVoucherReprintForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default JournalVoucherReprintForm
