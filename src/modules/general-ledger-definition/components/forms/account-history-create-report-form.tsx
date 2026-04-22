import { UseFormReturn, useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { AccountMultiPickerModal } from '@/modules/account/components/picker/account-multi-picker'
import GeneralLedgerSourceCombobox from '@/modules/general-ledger/components/pickers/general-ledger-source-combobox'
import {
    IGeneratedReport,
    TWithReportConfigSchema,
    useCreateGeneratedReport,
} from '@/modules/generated-report'
import { PrintSettingsSection } from '@/modules/generated-report/components/forms/print-config-section'
import { getTemplateAt } from '@/modules/generated-report/generated-report-template-registry'
import MemberPicker from '@/modules/member-profile/components/member-picker'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useInternalState } from '@/hooks/use-internal-state'

import { IClassProps, IForm } from '@/types'

import {
    AccountHistoryReportSchema,
    TAccountHistoryReportSchema,
} from '../../general-ledger-definition.validation'

export interface IAccountHistoryReportFormProps
    extends
        IClassProps,
        IForm<
            Partial<TAccountHistoryReportSchema>,
            IGeneratedReport,
            Error,
            TAccountHistoryReportSchema
        > {}

export const AccountHistoryReportCreateForm = ({
    className,
    ...formProps
}: IAccountHistoryReportFormProps) => {
    const form = useForm<TAccountHistoryReportSchema>({
        resolver: standardSchemaResolver(AccountHistoryReportSchema),
        mode: 'onSubmit',
        defaultValues: {
            account_ids: [],
            sort_by: 'by_date',
            member_id: undefined,
            source: 'payment',
            ...formProps.defaultValues,
            report_config: {
                ...getTemplateAt(undefined, 0),
                report_name: 'FSAccountHistory',
                name: `account_history_report_${toReadableDate(
                    new Date(),
                    'MMddyy_mmss'
                )}`,
                ...formProps.defaultValues?.report_config,
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
        useFormHelper<TAccountHistoryReportSchema>({
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

                    <FormFieldWrapper
                        control={form.control}
                        label="Member"
                        name="member_id"
                        render={({ field }) => (
                            <MemberPicker
                                allowClear
                                allowShortcutHotKey
                                disabled={isDisabled(field.name)}
                                onSelect={(selectedMember) => {
                                    field.onChange(selectedMember?.id)
                                    form.setValue('member', selectedMember)
                                }}
                                placeholder="All Member (Default)"
                                value={form.watch('member')}
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Source *"
                        name="source"
                        render={({ field }) => (
                            <GeneralLedgerSourceCombobox
                                disabled={isDisabled(field.name)}
                                onChange={field.onChange}
                                value={field.value}
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Sort By"
                        name="sort_by"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-3 gap-3"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    { value: 'by_date', label: 'By Date' },
                                    { value: 'by_cv_no', label: 'By CV No' },
                                    { value: 'none', label: 'None' },
                                ].map((opt) => {
                                    const isSelected = field.value === opt.value
                                    return (
                                        <label
                                            className={cn(
                                                'flex items-center gap-2 rounded-lg border p-3 cursor-pointer transition-all',
                                                'hover:bg-accent/50',
                                                isSelected
                                                    ? 'bg-gradient-to-br from-popover to-primary/20 border-primary shadow-md'
                                                    : 'bg-background border-border'
                                            )}
                                            key={opt.value}
                                        >
                                            <RadioGroupItem value={opt.value} />
                                            <span
                                                className={cn(
                                                    'text-sm',
                                                    isSelected
                                                        ? 'text-primary'
                                                        : 'text-foreground'
                                                )}
                                            >
                                                {opt.label}
                                            </span>
                                        </label>
                                    )
                                })}
                            </RadioGroup>
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

export const AccountHistoryReportCreateFormModal = ({
    title = 'Create Account History Report',
    description = 'Define Filters and Report configuration for account history',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IAccountHistoryReportFormProps, 'className' | 'onClose'>
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
            <AccountHistoryReportCreateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    onOpenChange(false)
                }}
            />
        </Modal>
    )
}
