import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import MemberTypeCombobox from '@/modules/member-type/components/member-type-combobox'
import { DivideIcon } from 'lucide-react'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import {
    BookOpenIcon,
    CreditCardIcon,
    DollarIcon,
    HandCoinsIcon,
    InfoIcon,
    MoneyCheckIcon,
    PercentIcon,
    ReceiptIcon,
    UserIcon,
    WrenchIcon,
} from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import SwitchFormField from '@/components/switch-form-field'
import InfoTooltip from '@/components/tooltips/info-tooltip'
import { Checkbox } from '@/components/ui/checkbox'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
} from '@/components/ui/input-group'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm } from '@/types'

import { useUpdateCurrentBranchSettings } from '../../branch-settings.service'
import { IBranchSettings } from '../../branch-settings.types'
import {
    BranchSettingRequestSchema,
    TBranchSettingsRequestSchema,
} from '../../branch-settings.validation'

export type TBranchSettingsFormValues = TBranchSettingsRequestSchema

export interface IBranchSettingsFormProps
    extends
        IClassProps,
        IForm<Partial<TBranchSettingsFormValues>, IBranchSettings, Error> {}

const BranchSettingsForm = ({
    className,
    ...formProps
}: IBranchSettingsFormProps) => {
    const form = useForm<TBranchSettingsFormValues>({
        resolver: standardSchemaResolver(BranchSettingRequestSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            // Withdraw
            withdraw_allow_user_input: false,
            withdraw_prefix: '',
            withdraw_or_start: 0,
            withdraw_or_current: 0,
            withdraw_or_end: 0,
            withdraw_or_iteration: 0,
            withdraw_use_date_or: false,
            withdraw_padding: 0,
            withdraw_common_or: '',

            // Deposit
            deposit_or_start: 0,
            deposit_or_current: 0,
            deposit_or_end: 0,
            deposit_or_iteration: 0,
            deposit_use_date_or: false,
            deposit_padding: 0,
            deposit_common_or: '',

            // Cash Check Voucher
            cash_check_voucher_allow_user_input: false,
            cash_check_voucher_or_unique: false,
            cash_check_voucher_prefix: '',
            cash_check_voucher_or_start: 0,
            cash_check_voucher_or_current: 0,
            cash_check_voucher_padding: 0,

            // Journal Voucher
            journal_voucher_allow_user_input: false,
            journal_voucher_or_unique: false,
            journal_voucher_prefix: '',
            journal_voucher_or_start: 0,
            journal_voucher_or_current: 0,
            journal_voucher_padding: 0,

            // Adjustment Voucher
            adjustment_voucher_allow_user_input: false,
            adjustment_voucher_or_unique: false,
            adjustment_voucher_prefix: '',
            adjustment_voucher_or_start: 0,
            adjustment_voucher_or_current: 0,
            adjustment_voucher_padding: 0,

            // Loan Voucher
            loan_voucher_allow_user_input: false,
            loan_voucher_or_unique: false,
            loan_voucher_prefix: '',
            loan_voucher_or_start: 0,
            loan_voucher_or_current: 0,
            loan_voucher_padding: 0,

            // Check Voucher (General)
            check_voucher_general: false,
            check_voucher_general_allow_user_input: false,
            check_voucher_general_or_unique: false,
            check_voucher_general_prefix: '',
            check_voucher_general_or_start: 0,
            check_voucher_general_or_current: 0,
            check_voucher_general_padding: 0,

            // Others
            loan_applied_equal_to_balance: true,
            annual_divisor: 0,
            tax_interest: 0,

            ...formProps.defaultValues,
        },
    })

    const updateMutation = useUpdateCurrentBranchSettings({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Branch settings saved.',
                textError: 'Failed to save branch settings.',
                onSuccess: (data) => {
                    form.reset(data)
                    formProps.onSuccess?.(data)
                },
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TBranchSettingsFormValues>({
            form,
            ...formProps,
            autoSave: false,
        })
    console.log(form.formState.errors)
    const onSubmit = form.handleSubmit(
        async (formData) => await updateMutation.mutateAsync(formData),
        handleFocusError
    )

    const { error: rawError, isPending, reset } = updateMutation

    const error = serverRequestErrExtractor({ error: rawError })

    return (
        <Form {...form}>
            <form
                className={cn('flex w-full flex-col gap-y-6', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="space-y-6"
                    disabled={isPending || formProps.readOnly}
                >
                    {/* Default Member Creation Settings */}
                    <div className="space-y-4 p-4 bg-secondary/60 dark:bg-popover rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="size-fit rounded-full bg-yellow-100 p-2 dark:bg-yellow-900/20">
                                <UserIcon className="size-5 " />
                            </div>
                            <div>
                                <h3 className="font-semibold">
                                    Default Member Creation Settings
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    Configure default settings for member
                                    creation, such as the default member type.
                                </p>
                            </div>
                        </div>

                        <FormFieldWrapper
                            control={form.control}
                            label={
                                <span>
                                    Default Member Type{' '}
                                    <InfoTooltip
                                        content={
                                            <div className="flex gap-2 text-muted-foreground max-w-[400px]">
                                                <InfoIcon
                                                    aria-hidden="true"
                                                    className="size-6 shrink-0 opacity-60"
                                                    size={16}
                                                />
                                                <div className="space-y-1">
                                                    <p className="text-[13px] font-medium">
                                                        Default member type
                                                    </p>
                                                    <p className="text-xs">
                                                        Select a default member
                                                        type, so new member
                                                        quick create form will
                                                        default to the preferred
                                                        default member type.
                                                    </p>
                                                </div>
                                            </div>
                                        }
                                    />
                                </span>
                            }
                            name="default_member_type_id"
                            render={({ field }) => (
                                <MemberTypeCombobox
                                    disabled={isDisabled(field.name)}
                                    onChange={(selectedType) => {
                                        field.onChange(selectedType?.id)
                                        form.setValue(
                                            'default_member_type',
                                            selectedType
                                        )
                                    }}
                                    placeholder="Select default member type"
                                    value={field.value}
                                />
                            )}
                        />
                    </div>
                    <Separator />

                    <div className="space-y-4 p-4 bg-secondary/60 dark:bg-popover rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="size-fit rounded-full bg-blue-100 p-2 dark:bg-blue-900/20">
                                <PercentIcon className="size-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Tax Interest</h3>
                                <p className="text-xs text-muted-foreground">
                                    Configure tax interest
                                </p>
                            </div>
                        </div>

                        <FormFieldWrapper
                            control={form.control}
                            name="tax_interest"
                            render={({ field }) => (
                                <InputGroup>
                                    <InputGroupInput {...field} />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupText>%</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            )}
                        />
                    </div>

                    <Separator />

                    {/* Anual Divisor */}
                    <div className="space-y-4 p-4 bg-secondary/60 dark:bg-popover rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="size-fit rounded-full bg-yellow-100 p-2 dark:bg-yellow-900/20">
                                <DivideIcon className="size-5 " />
                            </div>
                            <div>
                                <h3 className="font-semibold">
                                    Annual Divisor
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    An annual divisor is a number used to
                                    convert a yearly amount into a smaller
                                    time-based amount such as monthly, weekly,
                                    or daily by dividing it across the desired
                                    period.
                                </p>
                            </div>
                        </div>

                        <FormFieldWrapper
                            control={form.control}
                            name="annual_divisor"
                            render={({ field }) => (
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        placeholder="360"
                                        type="text"
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupText>Days</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            )}
                        />
                    </div>
                    <Separator />

                    {/* Withdraw OR Settings */}
                    <div className="space-y-4 p-4 bg-secondary/60 dark:bg-popover rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="size-fit rounded-full bg-destructive/40 p-2 dark:bg-destructive/40/20">
                                <HandCoinsIcon className="h-5 w-5 text-destructive dark:text-destructive" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Withdraw OR Settings
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Configure official receipt settings for
                                    withdrawals
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-x-4 gap-y-3 md:grid-cols-4">
                            <FormFieldWrapper
                                control={form.control}
                                label="Start OR"
                                name="withdraw_or_start"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        min="0"
                                        placeholder="Start OR"
                                        type="text"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="Current OR"
                                name="withdraw_or_current"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        min="0"
                                        placeholder="Current OR"
                                        type="text"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="End OR"
                                name="withdraw_or_end"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        min="0"
                                        placeholder="End OR"
                                        type="text"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="OR padding"
                                name="withdraw_padding"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        placeholder="Enter prefix (optional)"
                                        type="text"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="Common OR"
                                name="withdraw_common_or"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        placeholder="Enter common OR"
                                        type="text"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="OR Iteration"
                                name="withdraw_or_iteration"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        min="0"
                                        placeholder="OR Iteration"
                                        type="text"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="OR Prefix"
                                name="withdraw_prefix"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        placeholder="Enter prefix (optional)"
                                        type="text"
                                    />
                                )}
                            />
                        </div>

                        <div className="space-y-3">
                            <SwitchFormField
                                description="Allow users to manually input OR numbers form withdrawals"
                                form={form}
                                isDisabled={isDisabled}
                                label="Allow user Input"
                                name="withdraw_allow_user_input"
                            />
                            <SwitchFormField
                                description="Allow users to use the date as additional tol OR"
                                form={form}
                                isDisabled={isDisabled}
                                label="Allow use date to OR"
                                name="withdraw_use_date_or"
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* Deposit OR Settings */}
                    <div className="space-y-4 p-4 bg-secondary/60 dark:bg-popover rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="size-fit rounded-full bg-primary/10 p-2 dark:bg-primary/10/20">
                                <MoneyCheckIcon className="h-5 w-5 text-primary dark:text-primary" />
                            </div>
                            <div>
                                <h3 className="text font-semibold">
                                    Deposit OR Settings
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    Configure official receipt settings for
                                    deposits
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-x-4 gap-y-3 md:grid-cols-4">
                            <FormFieldWrapper
                                control={form.control}
                                label="Start OR"
                                name="deposit_or_start"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        min="0"
                                        placeholder="Start OR"
                                        type="text"
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                label="Current OR"
                                name="deposit_or_current"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        min="0"
                                        placeholder="Current OR"
                                        type="text"
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                label="End OR"
                                name="deposit_or_end"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        min="0"
                                        placeholder="End OR"
                                        type="text"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="OR Iteration"
                                name="deposit_or_iteration"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        min="0"
                                        placeholder="OR Iteration"
                                        type="text"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                className="col-span-2"
                                control={form.control}
                                label="OR padding"
                                name="deposit_padding"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        placeholder="Enter OR padding"
                                        type="text"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                className="col-span-2"
                                control={form.control}
                                label="Common OR"
                                name="withdraw_common_or"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        placeholder="Enter common OR"
                                        type="text"
                                    />
                                )}
                            />
                        </div>
                        <div className="space-y-3">
                            <SwitchFormField
                                description="Include date formatting in deposit OR numbers"
                                form={form}
                                isDisabled={isDisabled}
                                label="Use Date in OR"
                                name="deposit_use_date_or"
                            />
                        </div>
                    </div>

                    <Separator />
                    <div className="space-y-4 p-4 bg-secondary/60 dark:bg-popover rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="size-fit rounded-full bg-purple-100 p-2 dark:bg-purple-900/20">
                                <ReceiptIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold">
                                    Check Voucher OR Settings
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    Configure official receipt settings for
                                    check vouchers
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-x-4 gap-y-3 md:grid-cols-4">
                            <FormFieldWrapper
                                control={form.control}
                                label="Start OR"
                                name="cash_check_voucher_or_start"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        min="0"
                                        placeholder="Start OR"
                                        type="text"
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                label="Current OR"
                                name="cash_check_voucher_or_current"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        min="0"
                                        placeholder="Current OR"
                                        type="text"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="OR Padding"
                                name="cash_check_voucher_padding"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        min="0"
                                        placeholder="OR Iteration"
                                        type="text"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                className="col-span-full"
                                control={form.control}
                                label="OR Prefix"
                                name="cash_check_voucher_prefix"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        placeholder="Enter prefix (optional)"
                                        type="text"
                                    />
                                )}
                            />
                        </div>
                        <SwitchFormField
                            description="Allow the users to input OR"
                            form={form}
                            isDisabled={isDisabled}
                            label="Allow user to input"
                            name="cash_check_voucher_allow_user_input"
                        />
                        <SwitchFormField
                            description="Allow the users to enable unique"
                            form={form}
                            isDisabled={isDisabled}
                            label="Allow to use unique in OR"
                            name="cash_check_voucher_or_unique"
                        />
                    </div>

                    <Separator />

                    <div className="space-y-4 p-4 bg-secondary/60 dark:bg-popover rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="size-fit rounded-full bg-purple-400/40 p-2 dark:bg-purple-400/20">
                                <BookOpenIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Journal Voucher Settings
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Configure official receipt settings for
                                    journal vouchers
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-x-4 gap-y-3 md:grid-cols-4">
                            <FormFieldWrapper
                                control={form.control}
                                label="Start OR"
                                name="journal_voucher_or_start"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        min="0"
                                        placeholder="Start OR"
                                        type="text"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="Current OR"
                                name="journal_voucher_or_current"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        min="0"
                                        placeholder="Current OR"
                                        type="text"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="OR padding"
                                name="journal_voucher_padding"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        placeholder="Enter padding (optional)"
                                        type="text"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="OR Prefix"
                                name="journal_voucher_prefix"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        placeholder="Enter prefix (optional)"
                                        type="text"
                                    />
                                )}
                            />
                        </div>

                        <div className="space-y-3">
                            <SwitchFormField
                                description="Allow users to manually input OR numbers"
                                form={form}
                                isDisabled={isDisabled}
                                label="Allow user Input"
                                name="journal_voucher_allow_user_input"
                            />
                            <SwitchFormField
                                description="Allow users to enable unique OR"
                                form={form}
                                isDisabled={isDisabled}
                                label="Allow unique OR"
                                name="journal_voucher_or_unique"
                            />
                        </div>
                    </div>

                    {/* Adjustment Voucher Settings */}
                    <div className="space-y-4 p-4 bg-secondary/60 dark:bg-popover rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="size-fit rounded-full bg-orange-400/40 p-2 dark:bg-orange-400/20">
                                <WrenchIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Adjustment Voucher Settings
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Configure official receipt settings for
                                    adjustment vouchers
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-x-4 gap-y-3 md:grid-cols-4">
                            <FormFieldWrapper
                                control={form.control}
                                label="Start OR"
                                name="adjustment_voucher_or_start"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        min="0"
                                        placeholder="Start OR"
                                        type="text"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="Current OR"
                                name="adjustment_voucher_or_current"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        min="0"
                                        placeholder="Current OR"
                                        type="text"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="OR padding"
                                name="adjustment_voucher_padding"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        placeholder="Enter padding (optional)"
                                        type="text"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="OR Prefix"
                                name="adjustment_voucher_prefix"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        placeholder="Enter prefix (optional)"
                                        type="text"
                                    />
                                )}
                            />
                        </div>

                        <div className="space-y-3">
                            <SwitchFormField
                                description="Allow users to manually input OR numbers"
                                form={form}
                                isDisabled={isDisabled}
                                label="Allow user Input"
                                name="adjustment_voucher_allow_user_input"
                            />
                            <SwitchFormField
                                description="Allow users to enable unique OR"
                                form={form}
                                isDisabled={isDisabled}
                                label="Allow unique OR"
                                name="adjustment_voucher_or_unique"
                            />
                        </div>
                    </div>

                    {/* Loan Voucher Settings */}
                    <div className="space-y-4 p-4 bg-secondary/60 dark:bg-popover rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="size-fit rounded-full bg-green-400/40 p-2 dark:bg-green-400/20">
                                <DollarIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Loan Voucher Settings
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Configure official receipt settings for loan
                                    vouchers
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-x-4 gap-y-3 md:grid-cols-4">
                            <FormFieldWrapper
                                control={form.control}
                                label="Start OR"
                                name="loan_voucher_or_start"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        min="0"
                                        placeholder="Start OR"
                                        type="text"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="Current OR"
                                name="loan_voucher_or_current"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        min="0"
                                        placeholder="Current OR"
                                        type="text"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="OR padding"
                                name="loan_voucher_padding"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        placeholder="Enter padding (optional)"
                                        type="text"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="OR Prefix"
                                name="loan_voucher_prefix"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        placeholder="Enter prefix (optional)"
                                        type="text"
                                    />
                                )}
                            />
                        </div>

                        <div className="space-y-3">
                            <SwitchFormField
                                description="Allow users to manually input OR numbers"
                                form={form}
                                isDisabled={isDisabled}
                                label="Allow user Input"
                                name="loan_voucher_allow_user_input"
                            />
                            <SwitchFormField
                                description="Allow users to enable unique OR"
                                form={form}
                                isDisabled={isDisabled}
                                label="Allow unique OR"
                                name="loan_voucher_or_unique"
                            />
                        </div>
                    </div>

                    {/* Check Voucher General Settings */}
                    <div className="space-y-4 p-4 bg-secondary/60 dark:bg-popover rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="size-fit rounded-full bg-indigo-400/40 p-2 dark:bg-indigo-400/20">
                                <CreditCardIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Check Voucher General Settings
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Configure official receipt settings for
                                    general check vouchers
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-4">
                            <SwitchFormField
                                description="Enable check voucher general feature"
                                form={form}
                                isDisabled={isDisabled}
                                label="Enable Check Voucher General"
                                name="check_voucher_general"
                            />
                        </div>

                        <div className="grid gap-x-4 gap-y-3 md:grid-cols-4">
                            <FormFieldWrapper
                                control={form.control}
                                label="Start OR"
                                name="check_voucher_general_or_start"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        min="0"
                                        placeholder="Start OR"
                                        type="text"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="Current OR"
                                name="check_voucher_general_or_current"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        min="0"
                                        placeholder="Current OR"
                                        type="text"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="OR padding"
                                name="check_voucher_general_padding"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        placeholder="Enter padding (optional)"
                                        type="text"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="OR Prefix"
                                name="check_voucher_general_prefix"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        placeholder="Enter prefix (optional)"
                                        type="text"
                                    />
                                )}
                            />
                        </div>

                        <div className="space-y-3">
                            <SwitchFormField
                                description="Allow users to manually input OR numbers"
                                form={form}
                                isDisabled={isDisabled}
                                label="Allow user Input"
                                name="check_voucher_general_allow_user_input"
                            />
                            <SwitchFormField
                                description="Allow users to enable unique OR"
                                form={form}
                                isDisabled={isDisabled}
                                label="Allow unique OR"
                                name="check_voucher_general_or_unique"
                            />
                        </div>
                    </div>

                    {/* Additional OR Settings */}
                    <div className="space-y-4 p-4 bg-secondary/60 dark:bg-popover rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="size-fit rounded-full bg-blue-100 p-2 dark:bg-blue-900/20">
                                <CreditCardIcon className="size-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Loan Setting</h3>
                                <p className="text-xs text-muted-foreground">
                                    Configure additional loan settings
                                </p>
                            </div>
                        </div>

                        <FormFieldWrapper
                            control={form.control}
                            name="loan_applied_equal_to_balance"
                            render={({ field }) => (
                                <Label
                                    className="hover:bg-accent/40 ease-in-out duration-150 cursor-pointer flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-primary has-[[aria-checked=true]]:bg-primary/20"
                                    htmlFor={field.name}
                                >
                                    <Checkbox
                                        checked={field.value}
                                        id={field.name}
                                        onCheckedChange={(checkState) =>
                                            field.onChange(checkState)
                                        }
                                    />
                                    <div className="grid gap-1.5 font-normal">
                                        <p className="text-sm leading-none font-medium">
                                            Enable Loan Applied = Deposit
                                            Balance
                                        </p>
                                        <p className="text-muted-foreground text-sm">
                                            When comaker is set to deposit, the
                                            selected deposit balance will be use
                                            as the applied amount
                                        </p>
                                    </div>
                                </Label>
                            )}
                        />
                    </div>

                    <Separator />

                    {/* Check Voucher OR Settings */}
                </fieldset>

                <FormFooterResetSubmit
                    className="sticky bottom-0 bg-popover p-4 rounded-xl"
                    disableSubmit={!form.formState.isDirty || isPending}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                        reset?.()
                    }}
                    readOnly={formProps.readOnly}
                    submitText="Update Branch Settings"
                />
            </form>
        </Form>
    )
}

export const BranchSettingsFormModal = ({
    title = 'Branch Settings',
    description = 'Update branch official receipt settings.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IBranchSettingsFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('max-w-5xl', className)}
            description={description}
            title={title}
            {...props}
        >
            <BranchSettingsForm
                {...formProps}
                onSuccess={(updatedData) => {
                    formProps?.onSuccess?.(updatedData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default BranchSettingsForm
