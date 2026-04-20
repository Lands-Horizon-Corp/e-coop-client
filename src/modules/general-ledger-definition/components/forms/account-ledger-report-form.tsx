import { UseFormReturn, useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { AccountMultiPickerModal } from '@/modules/account/components/picker/account-multi-picker'
import {
    IGeneratedReport,
    TWithReportConfigSchema,
    useCreateGeneratedReport,
} from '@/modules/generated-report'
import { PrintSettingsSection } from '@/modules/generated-report/components/forms/print-config-section'
import { getTemplateAt } from '@/modules/generated-report/generated-report-template-registry'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import InputDate from '@/components/ui/input-date'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useInternalState } from '@/hooks/use-internal-state'

import { IClassProps, IForm } from '@/types'

import {
    AccountLedgerReport,
    TAccountLedgerReportSchema,
} from '../../general-ledger-definition.validation'

export interface IAccountLedgerReportFormProps
    extends
        IClassProps,
        IForm<
            Partial<TAccountLedgerReportSchema>,
            IGeneratedReport,
            Error,
            TAccountLedgerReportSchema
        > {}

const AccountLedgerReportCreateForm = ({
    className,
    ...formProps
}: IAccountLedgerReportFormProps) => {
    const form = useForm<TAccountLedgerReportSchema>({
        resolver: standardSchemaResolver(AccountLedgerReport),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            account_ids: [],
            start_date: undefined,
            end_date: undefined,
            report_type: 'detailed',
            is_account_per_page: false,
            ...formProps.defaultValues,
            report_config: {
                // TODO: Jervx - add real template array list pick
                ...getTemplateAt(undefined, 0),
                ...formProps.defaultValues?.report_config,
                module: 'Account',
                name: `account_ledger_report_${toReadableDate(new Date(), 'MMddyy_mmss')}`,
            },
        },
    })

    const generateMutation = useCreateGeneratedReport({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TAccountLedgerReportSchema>({
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
            <form
                className={cn('flex flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="grid gap-y-4"
                    disabled={isPending || formProps.readOnly}
                >
                    <FormFieldWrapper
                        control={form.control}
                        label="Accounts *"
                        name="account_ids"
                        render={({ field }) => (
                            <div className="flex flex-col gap-y-2">
                                <AccountMultiPickerModal
                                    pickerProps={{
                                        defaultSelected:
                                            form.getValues('accounts'),
                                        onConfirm: (accounts) => {
                                            field.onChange(
                                                accounts.map(
                                                    (account) => account.id
                                                )
                                            )
                                            form.setValue('accounts', accounts)
                                        },
                                    }}
                                    trigger={
                                        <Button
                                            disabled={isDisabled(field.name)}
                                            type="button"
                                            variant="outline"
                                        >
                                            {field.value.length === 0
                                                ? 'Select account'
                                                : `${field.value.length} Accounts Selected`}
                                        </Button>
                                    }
                                />
                                {field.value?.length > 0 && (
                                    <span className="text-sm text-muted-foreground">
                                        {field.value.length} account(s) selected
                                    </span>
                                )}
                            </div>
                        )}
                    />

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

                    <FormFieldWrapper
                        control={form.control}
                        label="Report Type"
                        name="report_type"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-2 gap-3"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    {
                                        value: 'detailed',
                                        label: 'Detailed',
                                        desc: 'Provides a full breakdown of each item. Ideal for audits or in-depth review.',
                                    },
                                    {
                                        value: 'summary',
                                        label: 'Summary',
                                        desc: 'Gives a overview, perfect for management and quick decision-making.',
                                    },
                                ].map((opt) => {
                                    const isSelected = field.value === opt.value
                                    return (
                                        <label
                                            className={cn(
                                                'relative flex flex-col gap-1 rounded-lg border p-3 cursor-pointer transition-all',
                                                'hover:bg-accent/50',
                                                isSelected
                                                    ? 'bg-gradient-to-br from-popover to-primary/20 border-primary shadow-md ring-1 ring-primary/20'
                                                    : 'bg-background border-border'
                                            )}
                                            key={opt.value}
                                        >
                                            <div className="flex items-center justify-between">
                                                <p
                                                    className={cn(
                                                        'text-sm font-medium transition-colors',
                                                        isSelected
                                                            ? 'text-primary'
                                                            : 'text-foreground'
                                                    )}
                                                >
                                                    {opt.label}
                                                </p>
                                                <RadioGroupItem
                                                    className="mt-0.5"
                                                    value={opt.value}
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {opt.desc}
                                            </p>
                                        </label>
                                    )
                                })}
                            </RadioGroup>
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        name="is_account_per_page"
                        render={({ field }) => (
                            <fieldset>
                                <label
                                    className={cn(
                                        'group flex items-start gap-3 rounded-xl border p-4 cursor-pointer',
                                        'transition-all duration-700 ease-out',
                                        'bg-popover border-border',
                                        'hover:border-primary/40 hover:shadow-sm',
                                        field.value &&
                                            'bg-gradient-to-br from-popover to-primary/20 border-primary shadow-md'
                                    )}
                                >
                                    <Checkbox
                                        checked={field.value}
                                        className={cn(
                                            'mt-1 transition-all',
                                            field.value && 'border-primary'
                                        )}
                                        onCheckedChange={(val) =>
                                            field.onChange(!!val)
                                        }
                                    />

                                    <div className="flex flex-col">
                                        <span
                                            className={cn(
                                                'text-sm font-medium transition-colors',
                                                field.value
                                                    ? 'text-primary'
                                                    : 'text-foreground'
                                            )}
                                        >
                                            Print account per page
                                        </span>

                                        <span className="text-xs text-muted-foreground">
                                            Each account will be printed on a
                                            separate page for better
                                            readability.
                                        </span>
                                    </div>
                                </label>
                            </fieldset>
                        )}
                    />
                    <Separator />
                    <PrintSettingsSection
                        displayMode="dropdown"
                        form={
                            form as unknown as UseFormReturn<TWithReportConfigSchema>
                        }
                    />
                </fieldset>

                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty || isPending}
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

export default AccountLedgerReportCreateForm

export const AccountLedgerReportCreateFormModal = ({
    title = 'Create Account Ledger Report',
    description = 'Define Filters and Report configuration for account ledger',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IAccountLedgerReportFormProps, 'className' | 'onClose'>
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
            <AccountLedgerReportCreateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    onOpenChange(false)
                }}
            />
        </Modal>
    )
}
