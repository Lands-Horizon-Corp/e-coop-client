import { UseFormReturn, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { buildFormDefaults } from '@/helpers/form/form-persist.helper'
import { cn } from '@/helpers/tw-utils'
import {
    IGeneratedReport,
    TWithReportConfigSchema,
    useCreateGeneratedReport,
} from '@/modules/generated-report'
import { PrintSettingsSection } from '@/modules/generated-report/components/forms/print-config-section'
import { getTemplateAt } from '@/modules/generated-report/generated-report-template-registry'
import { stringDateWithTransformSchema } from '@/validation'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { PersistFormHeadless } from '@/components/form-components/form-persist-headless'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { FormLabel } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import { Separator } from '@/components/ui/separator'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useInternalState } from '@/hooks/use-internal-state'

import { IClassProps, IForm } from '@/types'

import { WithGeneratedReportSchema } from '../../generated-report.validation'
import {
    AccountColumnEntrySchema,
    AccountColumnListFormSection,
    AccountListOrderModal,
    TAccountEntry,
    WithAccountColumnListSchema,
} from './account-column-list-form-section'

export const TellerMonitoringReportSchema = z
    .object({
        start_date: stringDateWithTransformSchema,
        end_date: stringDateWithTransformSchema,
        withdrawal_showable_account_column_list: z
            .array(AccountColumnEntrySchema)
            .min(
                1,
                'Must have minimum of 1 withdrawal account column to display'
            )
            .default([]),
        withdrawal_showable_account_column_list_showable_first: z.coerce
            .number()
            .min(1, 'Require to show at least 1 withdrawal account from list')
            .default(1),
    })
    .and(WithGeneratedReportSchema)
    .and(WithAccountColumnListSchema)
    .superRefine((data, ctx) => {
        if (
            data.start_date &&
            data.end_date &&
            data.start_date > data.end_date
        ) {
            ctx.addIssue({
                code: 'custom',
                message: 'Start Date must not be after End Date',
                path: ['start_date'],
            })
            ctx.addIssue({
                code: 'custom',
                message: 'End Date must not be before Start Date',
                path: ['end_date'],
            })
        }

        if (
            data.withdrawal_showable_account_column_list_showable_first >
            data.withdrawal_showable_account_column_list.length
        ) {
            ctx.addIssue({
                code: 'custom',
                message:
                    'Cannot show more withdrawal accounts than what is available in the list',
                path: [
                    'withdrawal_showable_account_column_list_showable_first',
                ],
            })
        }
    })

export type TTellerMonitoringReportSchema = z.infer<
    typeof TellerMonitoringReportSchema
>

export interface ITellerMonitoringReportFormProps
    extends
        IClassProps,
        IForm<
            Partial<TTellerMonitoringReportSchema>,
            IGeneratedReport,
            Error,
            TTellerMonitoringReportSchema
        > {}

const TellerMonitoringCreateReportForm = ({
    className,
    ...formProps
}: ITellerMonitoringReportFormProps) => {
    const form = useForm<TTellerMonitoringReportSchema>({
        resolver: standardSchemaResolver(TellerMonitoringReportSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: async () =>
            buildFormDefaults<TTellerMonitoringReportSchema>({
                persistKey: formProps.persistKey,
                baseDefaults: {
                    start_date: undefined,
                    end_date: undefined,

                    account_column_list: [],
                    account_column_list_showable_first: 10,
                    withdrawal_showable_account_column_list: [],
                    withdrawal_showable_account_column_list_showable_first: 10,

                    report_config: {
                        ...getTemplateAt(undefined, 0),
                        report_name: 'TellerMonitoringReport',
                        name: `teller_monitoring_${toReadableDate(
                            new Date(),
                            'MMddyy_mmss'
                        )}`,
                    },
                },
                overrideDefaults: formProps.defaultValues,
            }),
    })

    const generateMutation = useCreateGeneratedReport({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TTellerMonitoringReportSchema>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit(({ report_config, ...filters }) => {
        generateMutation.mutate({
            ...report_config,
            generated_report_type: 'pdf',
            filters,
        })
    }, handleFocusError)

    const { error: rawError, isPending, reset } = generateMutation
    const error = serverRequestErrExtractor({ error: rawError })

    return (
        <Form {...form}>
            <PersistFormHeadless
                form={form}
                persistKey={formProps.persistKey}
            />
            <form
                className={cn('flex flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="grid gap-y-4"
                    disabled={isPending || formProps.readOnly}
                >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormFieldWrapper
                            control={form.control}
                            label="Start Date *"
                            name="start_date"
                            render={({ field }) => (
                                <InputDate
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="End Date *"
                            name="end_date"
                            render={({ field }) => (
                                <InputDate
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                    </div>

                    <AccountColumnListFormSection form={form} />

                    <div className="bg-popover p-4 rounded-2xl space-y-2">
                        <div>
                            <FormLabel className="text-sm">
                                Withdrawal Report Detailed Column Account
                            </FormLabel>
                            <p className="text-xs text-muted-foreground">
                                Setup withdrawal column/accounts to be displayed
                                in the report table
                            </p>
                        </div>
                        <div className="flex gap-x-4">
                            <FormFieldWrapper
                                className="flex-1"
                                control={form.control}
                                description="Define what withdrawal accounts will be included in the report column"
                                label="Withdrawal Account Column List"
                                name="withdrawal_showable_account_column_list"
                                render={({ field }) => {
                                    const accounts =
                                        form.getValues(
                                            'withdrawal_showable_account_column_list'
                                        ) ?? []

                                    return (
                                        <div className="flex flex-col gap-y-2">
                                            <AccountListOrderModal
                                                account_column={
                                                    accounts as TAccountEntry[]
                                                }
                                                onApply={(items) => {
                                                    const ids = items.map(
                                                        (i) => i.account_id
                                                    )
                                                    const fullAccounts =
                                                        items.map((i) => i)

                                                    field.onChange(ids)
                                                    form.setValue(
                                                        'withdrawal_showable_account_column_list',
                                                        fullAccounts
                                                    )
                                                }}
                                                trigger={
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                    >
                                                        {(field.value ?? [])
                                                            .length === 0
                                                            ? 'Define Withdrawal Report Account Columns'
                                                            : `${(field.value ?? []).length} Withdrawal Column Defined`}
                                                    </Button>
                                                }
                                            />
                                        </div>
                                    )
                                }}
                            />
                            <FormFieldWrapper
                                className="w-fit"
                                control={form.control}
                                description="Will show first number of withdrawal account in the table"
                                label="Show First"
                                name="withdrawal_showable_account_column_list_showable_first"
                                render={({ field }) => <Input {...field} />}
                            />
                        </div>
                    </div>

                    <Separator />
                    <PrintSettingsSection
                        displayMode="dropdown"
                        form={
                            form as unknown as UseFormReturn<TWithReportConfigSchema>
                        }
                        registryKey="teller_monitoring_template"
                    />
                </fieldset>

                <FormFooterResetSubmit
                    disableSubmit={isPending}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset(formProps.defaultValues)
                        reset()
                    }}
                    readOnly={formProps.readOnly}
                    submitText="Generate"
                />
            </form>
        </Form>
    )
}

export default TellerMonitoringCreateReportForm

export const TellerMonitoringCreateReportFormModal = ({
    title = 'Create Teller Monitoring Report',
    description = 'Define date range and report configuration for teller monitoring',
    className,
    formProps,
    closeOnSuccess = true,
    ...props
}: IModalProps & {
    closeOnSuccess?: boolean
    formProps?: Omit<ITellerMonitoringReportFormProps, 'className' | 'onClose'>
}) => {
    const [open, onOpenChange] = useInternalState(
        false,
        props.open,
        props.onOpenChange
    )

    return (
        <Modal
            className={cn('sm:max-w-xl', className)}
            description={description}
            title={title}
            {...props}
            onOpenChange={onOpenChange}
            open={open}
        >
            <TellerMonitoringCreateReportForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    if (closeOnSuccess) onOpenChange(false)
                }}
            />
        </Modal>
    )
}
