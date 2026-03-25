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

import { useReprintOtherFund } from '../..'
import {
    OtherFundReprintSchema,
    TOtherFundReprintSchema,
} from '../../other-fund.validation'

export interface IOtherFundReprintFormProps
    extends
        IClassProps,
        IForm<
            Partial<TOtherFundReprintSchema>,
            IGeneratedReport,
            Error,
            TOtherFundReprintSchema
        > {
    otherFundId: TEntityId
}

const OtherFundReprintForm = ({
    otherFundId,
    className,
    ...formProps
}: IOtherFundReprintFormProps) => {
    const form = useForm<TOtherFundReprintSchema>({
        resolver: standardSchemaResolver(OtherFundReprintSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            ...formProps.defaultValues,
        },
    })

    const printMutation = useReprintOtherFund({
        options: {
            onSuccess: (generatedReport) => {
                formProps.onSuccess?.(generatedReport)
            },
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError } =
        useFormHelper<TOtherFundReprintSchema>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit(async ({ report_config, ...rest }) => {
        toast.promise(
            printMutation.mutateAsync({
                otherFundId,
                payload: {
                    ...rest,
                    report_config: {
                        ...report_config,
                        filters: {
                            other_fund_id: otherFundId,
                        },
                    },
                },
            }),
            {
                loading: 'Printing...',
                success: 'Other Fund Reprinted',
                error: (error) =>
                    `Something went wrong: ${serverRequestErrExtractor({ error })}`,
            }
        )
    }, handleFocusError)

    const { error: rawError, isPending, reset } = printMutation

    const error = serverRequestErrExtractor({ error: rawError })

    return (
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
                        registryKey={'other_fund_print_template'}
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

export const OtherFundReprintFormModal = ({
    className,
    formProps,
    title = 'Other Fund Print',
    description = 'Print other fund transaction',
    ...props
}: IModalProps & {
    formProps: Omit<IOtherFundReprintFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('!max-w-lg', className)}
            description={description}
            title={title}
            {...props}
        >
            <OtherFundReprintForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default OtherFundReprintForm
