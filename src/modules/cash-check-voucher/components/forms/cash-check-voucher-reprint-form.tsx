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

import { useReprintCashCheckVoucherTransaction } from '../../cash-check-voucher.service'
import {
    CashCheckVoucherReprintSchema,
    TCashCheckVoucherReprintSchema,
} from '../../cash-check-voucher.validation'

export interface ICashCheckVoucherReprintFormProps
    extends
        IClassProps,
        IForm<
            Partial<TCashCheckVoucherReprintSchema>,
            IGeneratedReport,
            Error,
            TCashCheckVoucherReprintSchema
        > {
    cashCheckVoucherId: TEntityId
}

const CashCheckVoucherReprintForm = ({
    cashCheckVoucherId,
    className,
    ...formProps
}: ICashCheckVoucherReprintFormProps) => {
    const form = useForm<TCashCheckVoucherReprintSchema>({
        resolver: standardSchemaResolver(CashCheckVoucherReprintSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            ...formProps.defaultValues,
        },
    })

    const printMutation = useReprintCashCheckVoucherTransaction({
        options: {
            onSuccess: (generatedReport) => {
                formProps.onSuccess?.(generatedReport)
            },
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError } =
        useFormHelper<TCashCheckVoucherReprintSchema>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit(async ({ report_config, ...rest }) => {
        toast.promise(
            printMutation.mutateAsync({
                cashCheckVoucherId,
                payload: {
                    ...rest,
                    report_config: {
                        ...report_config,
                        filters: {
                            cash_check_voucher_id: cashCheckVoucherId,
                        },
                    },
                },
            }),
            {
                loading: 'Printing...',
                success: 'Cash Check Voucher Reprinted',
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
                            registryKey={'cash_check_print_voucher'}
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

export const CashCheckVoucherReprintFormModal = ({
    className,
    formProps,
    title = 'Loan Print',
    description = 'Print loan',
    ...props
}: IModalProps & {
    formProps: Omit<ICashCheckVoucherReprintFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('!max-w-lg', className)}
            description={description}
            title={title}
            {...props}
        >
            <CashCheckVoucherReprintForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default CashCheckVoucherReprintForm
