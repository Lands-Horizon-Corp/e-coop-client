import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import MemberTypeCombobox from '@/modules/member-type/components/member-type-combobox'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import {
    CalendarIcon,
    CheckIcon,
    CreditCardIcon,
    HandCoinsIcon,
    InfoIcon,
    MoneyCheckIcon,
    ReceiptIcon,
    UserIcon,
} from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import InfoTooltip from '@/components/tooltips/info-tooltip'
import { Checkbox } from '@/components/ui/checkbox'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm } from '@/types'

import { useUpdateCurrentBranchSettings } from '../../branch-settings.service'
import { IBranchSettings } from '../../branch-settings.types'
import {
    BranchSettingsSchema,
    TBranchSettingsSchema,
} from '../../branch-settings.validation'

export type TBranchSettingsFormValues = TBranchSettingsSchema

export interface IBranchSettingsFormProps
    extends IClassProps,
        IForm<Partial<TBranchSettingsFormValues>, IBranchSettings, Error> {}

const BranchSettingsForm = ({
    className,
    ...formProps
}: IBranchSettingsFormProps) => {
    const form = useForm<TBranchSettingsFormValues>({
        resolver: standardSchemaResolver(BranchSettingsSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            // Withdraw settings
            withdraw_allow_user_input: false,
            withdraw_prefix: '',
            withdraw_or_start: 0,
            withdraw_or_current: 0,
            withdraw_or_end: 0,
            withdraw_or_iteration: 0,
            withdraw_or_unique: false,
            withdraw_use_date_or: false,

            // Deposit settings
            deposit_allow_user_input: false,
            deposit_prefix: '',
            deposit_or_start: 0,
            deposit_or_current: 0,
            deposit_or_end: 0,
            deposit_or_iteration: 0,
            deposit_or_unique: false,
            deposit_use_date_or: false,

            // Loan settings
            loan_allow_user_input: false,
            loan_prefix: '',
            loan_or_start: 0,
            loan_or_current: 0,
            loan_or_end: 0,
            loan_or_iteration: 0,
            loan_or_unique: false,
            loan_use_date_or: false,

            // Check Voucher settings
            check_voucher_allow_user_input: false,
            check_voucher_prefix: '',
            check_voucher_or_start: 0,
            check_voucher_or_current: 0,
            check_voucher_or_end: 0,
            check_voucher_or_iteration: 0,
            check_voucher_or_unique: false,
            check_voucher_use_date_or: false,

            loan_applied_equal_to_balance: true,

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
                                    }}
                                    placeholder="Select default member type"
                                    value={field.value}
                                />
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
                        </div>

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

                        <div className="space-y-3">
                            <FormFieldWrapper
                                control={form.control}
                                name="withdraw_allow_user_input"
                                render={({ field }) => (
                                    <div className="shadow-xs bg-background/50 relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
                                        <Switch
                                            aria-describedby={`${field.name}-desc`}
                                            checked={field.value}
                                            className="order-1 after:absolute after:inset-0"
                                            disabled={isDisabled(field.name)}
                                            id={field.name}
                                            onCheckedChange={field.onChange}
                                        />
                                        <div className="flex grow items-center gap-3">
                                            <div className="size-fit rounded-full bg-secondary p-2">
                                                <CheckIcon className="h-4 w-4" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor={field.name}>
                                                    Allow User Input
                                                </Label>
                                                <p
                                                    className="text-xs text-muted-foreground"
                                                    id={`${field.name}-desc`}
                                                >
                                                    Allow users to manually
                                                    input OR numbers for
                                                    withdrawals
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                name="withdraw_or_unique"
                                render={({ field }) => (
                                    <div className="shadow-xs bg-background/50 relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
                                        <Switch
                                            aria-describedby={`${field.name}-desc`}
                                            checked={field.value}
                                            className="order-1 after:absolute after:inset-0"
                                            disabled={isDisabled(field.name)}
                                            id={field.name}
                                            onCheckedChange={field.onChange}
                                        />
                                        <div className="flex grow items-center gap-3">
                                            <div className="size-fit rounded-full bg-secondary p-2">
                                                <CheckIcon className="h-4 w-4" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor={field.name}>
                                                    Unique OR Numbers
                                                </Label>
                                                <p
                                                    className="text-xs text-muted-foreground"
                                                    id={`${field.name}-desc`}
                                                >
                                                    Ensure each withdrawal OR
                                                    number is unique
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                name="withdraw_use_date_or"
                                render={({ field }) => (
                                    <div className="shadow-xs bg-background/50 relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
                                        <Switch
                                            aria-describedby={`${field.name}-desc`}
                                            checked={field.value}
                                            className="order-1 after:absolute after:inset-0"
                                            disabled={isDisabled(field.name)}
                                            id={field.name}
                                            onCheckedChange={field.onChange}
                                        />
                                        <div className="flex grow items-center gap-3">
                                            <div className="size-fit rounded-full bg-secondary p-2">
                                                <CalendarIcon className="h-4 w-4" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor={field.name}>
                                                    Use Date in OR
                                                </Label>
                                                <p
                                                    className="text-xs text-muted-foreground"
                                                    id={`${field.name}-desc`}
                                                >
                                                    Include date formatting in
                                                    withdrawal OR numbers
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
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
                        </div>

                        <FormFieldWrapper
                            control={form.control}
                            label="OR Prefix"
                            name="deposit_prefix"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    placeholder="Enter prefix (optional)"
                                    type="text"
                                />
                            )}
                        />

                        <div className="space-y-3">
                            <FormFieldWrapper
                                control={form.control}
                                name="deposit_allow_user_input"
                                render={({ field }) => (
                                    <div className="shadow-xs bg-background/50 relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
                                        <Switch
                                            aria-describedby={`${field.name}-desc`}
                                            checked={field.value}
                                            className="order-1 after:absolute after:inset-0"
                                            disabled={isDisabled(field.name)}
                                            id={field.name}
                                            onCheckedChange={field.onChange}
                                        />
                                        <div className="flex grow items-center gap-3">
                                            <div className="size-fit rounded-full bg-secondary p-2">
                                                <CheckIcon className="h-4 w-4" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor={field.name}>
                                                    Allow User Input
                                                </Label>
                                                <p
                                                    className="text-xs text-muted-foreground"
                                                    id={`${field.name}-desc`}
                                                >
                                                    Allow users to manually
                                                    input OR numbers for
                                                    deposits
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                name="deposit_or_unique"
                                render={({ field }) => (
                                    <div className="shadow-xs bg-background/50 relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
                                        <Switch
                                            aria-describedby={`${field.name}-desc`}
                                            checked={field.value}
                                            className="order-1 after:absolute after:inset-0"
                                            disabled={isDisabled(field.name)}
                                            id={field.name}
                                            onCheckedChange={field.onChange}
                                        />
                                        <div className="flex grow items-center gap-3">
                                            <div className="size-fit rounded-full bg-secondary p-2">
                                                <CheckIcon className="h-4 w-4" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor={field.name}>
                                                    Unique OR Numbers
                                                </Label>
                                                <p
                                                    className="text-xs text-muted-foreground"
                                                    id={`${field.name}-desc`}
                                                >
                                                    Ensure each deposit OR
                                                    number is unique
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                name="deposit_use_date_or"
                                render={({ field }) => (
                                    <div className="shadow-xs bg-background/50 relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
                                        <Switch
                                            aria-describedby={`${field.name}-desc`}
                                            checked={field.value}
                                            className="order-1 after:absolute after:inset-0"
                                            disabled={isDisabled(field.name)}
                                            id={field.name}
                                            onCheckedChange={field.onChange}
                                        />
                                        <div className="flex grow items-center gap-3">
                                            <div className="size-fit rounded-full bg-secondary p-2">
                                                <CalendarIcon className="h-4 w-4" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor={field.name}>
                                                    Use Date in OR
                                                </Label>
                                                <p
                                                    className="text-xs text-muted-foreground"
                                                    id={`${field.name}-desc`}
                                                >
                                                    Include date formatting in
                                                    deposit OR numbers
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* Loan OR Settings */}
                    <div className="space-y-4 p-4 bg-secondary/60 dark:bg-popover rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="size-fit rounded-full bg-blue-100 p-2 dark:bg-blue-900/20">
                                <CreditCardIcon className="size-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold">
                                    Loan OR Settings
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    Configure official receipt settings for
                                    loans
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-x-4 gap-y-3 md:grid-cols-4">
                            <FormFieldWrapper
                                control={form.control}
                                label="Start OR"
                                name="loan_or_start"
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
                                name="loan_or_current"
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
                                name="loan_or_end"
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
                                name="loan_or_iteration"
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
                                name="loan_prefix"
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
                            <FormFieldWrapper
                                control={form.control}
                                name="loan_allow_user_input"
                                render={({ field }) => (
                                    <div className="shadow-xs bg-background/50 relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
                                        <Switch
                                            aria-describedby={`${field.name}-desc`}
                                            checked={field.value}
                                            className="order-1 after:absolute after:inset-0"
                                            disabled={isDisabled(field.name)}
                                            id={field.name}
                                            onCheckedChange={field.onChange}
                                        />
                                        <div className="flex grow items-center gap-3">
                                            <div className="size-fit rounded-full bg-secondary p-2">
                                                <CheckIcon className="h-4 w-4" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor={field.name}>
                                                    Allow User Input
                                                </Label>
                                                <p
                                                    className="text-xs text-muted-foreground"
                                                    id={`${field.name}-desc`}
                                                >
                                                    Allow users to manually
                                                    input OR numbers for loans
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="loan_or_unique"
                                render={({ field }) => (
                                    <div className="shadow-xs bg-background/50 relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
                                        <Switch
                                            aria-describedby={`${field.name}-desc`}
                                            checked={field.value}
                                            className="order-1 after:absolute after:inset-0"
                                            disabled={isDisabled(field.name)}
                                            id={field.name}
                                            onCheckedChange={field.onChange}
                                        />
                                        <div className="flex grow items-center gap-3">
                                            <div className="size-fit rounded-full bg-secondary p-2">
                                                <CheckIcon className="h-4 w-4" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor={field.name}>
                                                    Unique OR Numbers
                                                </Label>
                                                <p
                                                    className="text-xs text-muted-foreground"
                                                    id={`${field.name}-desc`}
                                                >
                                                    Ensure each loan OR number
                                                    is unique
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                name="loan_use_date_or"
                                render={({ field }) => (
                                    <div className="shadow-xs bg-background/50 relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
                                        <Switch
                                            aria-describedby={`${field.name}-desc`}
                                            checked={field.value}
                                            className="order-1 after:absolute after:inset-0"
                                            disabled={isDisabled(field.name)}
                                            id={field.name}
                                            onCheckedChange={field.onChange}
                                        />
                                        <div className="flex grow items-center gap-3">
                                            <div className="size-fit rounded-full bg-secondary p-2">
                                                <CalendarIcon className="h-4 w-4" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor={field.name}>
                                                    Use Date in OR
                                                </Label>
                                                <p
                                                    className="text-xs text-muted-foreground"
                                                    id={`${field.name}-desc`}
                                                >
                                                    Include date formatting in
                                                    loan OR numbers
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            />
                        </div>
                    </div>

                    <Separator />

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
                                    className="hover:bg-accent/40 ease-in-out duration-150 cursor-pointer flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-primary has-[[aria-checked=true]]:bg-primary/80"
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
                                name="check_voucher_or_start"
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
                                name="check_voucher_or_current"
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
                                name="check_voucher_or_end"
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
                                name="check_voucher_or_iteration"
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
                        </div>

                        <FormFieldWrapper
                            control={form.control}
                            label="OR Prefix"
                            name="check_voucher_prefix"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    placeholder="Enter prefix (optional)"
                                    type="text"
                                />
                            )}
                        />

                        <div className="space-y-3">
                            <FormFieldWrapper
                                control={form.control}
                                name="check_voucher_allow_user_input"
                                render={({ field }) => (
                                    <div className="shadow-xs bg-background/50 relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
                                        <Switch
                                            aria-describedby={`${field.name}-desc`}
                                            checked={field.value}
                                            className="order-1 after:absolute after:inset-0"
                                            disabled={isDisabled(field.name)}
                                            id={field.name}
                                            onCheckedChange={field.onChange}
                                        />
                                        <div className="flex grow items-center gap-3">
                                            <div className="size-fit rounded-full bg-secondary p-2">
                                                <CheckIcon className="h-4 w-4" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor={field.name}>
                                                    Allow User Input
                                                </Label>
                                                <p
                                                    className="text-xs text-muted-foreground"
                                                    id={`${field.name}-desc`}
                                                >
                                                    Allow users to manually
                                                    input OR numbers for check
                                                    vouchers
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                name="check_voucher_or_unique"
                                render={({ field }) => (
                                    <div className="shadow-xs bg-background/50 relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
                                        <Switch
                                            aria-describedby={`${field.name}-desc`}
                                            checked={field.value}
                                            className="order-1 after:absolute after:inset-0"
                                            disabled={isDisabled(field.name)}
                                            id={field.name}
                                            onCheckedChange={field.onChange}
                                        />
                                        <div className="flex grow items-center gap-3">
                                            <div className="size-fit rounded-full bg-secondary p-2">
                                                <CheckIcon className="h-4 w-4" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor={field.name}>
                                                    Unique OR Numbers
                                                </Label>
                                                <p
                                                    className="text-xs text-muted-foreground"
                                                    id={`${field.name}-desc`}
                                                >
                                                    Ensure each check voucher OR
                                                    number is unique
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                name="check_voucher_use_date_or"
                                render={({ field }) => (
                                    <div className="shadow-xs bg-background/50 relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
                                        <Switch
                                            aria-describedby={`${field.name}-desc`}
                                            checked={field.value}
                                            className="order-1 after:absolute after:inset-0"
                                            disabled={isDisabled(field.name)}
                                            id={field.name}
                                            onCheckedChange={field.onChange}
                                        />
                                        <div className="flex grow items-center gap-3">
                                            <div className="size-fit rounded-full bg-secondary p-2">
                                                <CalendarIcon className="h-4 w-4" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor={field.name}>
                                                    Use Date in OR
                                                </Label>
                                                <p
                                                    className="text-xs text-muted-foreground"
                                                    id={`${field.name}-desc`}
                                                >
                                                    Include date formatting in
                                                    check voucher OR numbers
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                </fieldset>

                <FormFooterResetSubmit
                    className="sticky bottom-0 bg-popover p-4 rounded-xl"
                    disableSubmit={!form.formState.isDirty}
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
