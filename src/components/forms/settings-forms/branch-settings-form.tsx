import z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { Path, useForm } from 'react-hook-form'

import {
    CalendarIcon,
    CheckIcon,
    CreditCardIcon,
    HandCoinsIcon,
    MoneyCheckIcon,
    ReceiptIcon,
} from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

import { cn } from '@/lib/utils'

import { branchSettingsSchema } from '@/validations/form-validation/settings/branch-settings-schema'

import { useUpdateCurrentBranchSettings } from '@/hooks/api-hooks/use-branch'
import { useFormHelper } from '@/hooks/use-form-helper'

import { IBranch, IBranchSettingsRequest, IClassProps, IForm } from '@/types'

export type TBranchSettingsFormValues = z.infer<typeof branchSettingsSchema>

export interface IBranchSettingsFormProps
    extends IClassProps,
        IForm<Partial<TBranchSettingsFormValues>, IBranch, string> {}

const BranchSettingsForm = ({
    readOnly,
    className,
    defaultValues,
    disabledFields,
    resetOnDefaultChange,
    onError,
    onSuccess,
}: IBranchSettingsFormProps) => {
    const form = useForm<TBranchSettingsFormValues>({
        resolver: zodResolver(branchSettingsSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            // Withdraw settings
            branch_setting_withdraw_allow_user_input: false,
            branch_setting_withdraw_prefix: '',
            branch_setting_withdraw_or_start: 0,
            branch_setting_withdraw_or_current: 0,
            branch_setting_withdraw_or_end: 0,
            branch_setting_withdraw_or_iteration: 0,
            branch_setting_withdraw_or_unique: false,
            branch_setting_withdraw_use_date_or: false,

            // Deposit settings
            branch_setting_deposit_allow_user_input: false,
            branch_setting_deposit_prefix: '',
            branch_setting_deposit_or_start: 0,
            branch_setting_deposit_or_current: 0,
            branch_setting_deposit_or_end: 0,
            branch_setting_deposit_or_iteration: 0,
            branch_setting_deposit_or_unique: false,
            branch_setting_deposit_use_date_or: false,

            // Loan settings
            branch_setting_loan_allow_user_input: false,
            branch_setting_loan_prefix: '',
            branch_setting_loan_or_start: 0,
            branch_setting_loan_or_current: 0,
            branch_setting_loan_or_end: 0,
            branch_setting_loan_or_iteration: 0,
            branch_setting_loan_or_unique: false,
            branch_setting_loan_use_date_or: false,

            // Check Voucher settings
            branch_setting_check_voucher_allow_user_input: false,
            branch_setting_check_voucher_prefix: '',
            branch_setting_check_voucher_or_start: 0,
            branch_setting_check_voucher_or_current: 0,
            branch_setting_check_voucher_or_end: 0,
            branch_setting_check_voucher_or_iteration: 0,
            branch_setting_check_voucher_or_unique: false,
            branch_setting_check_voucher_use_date_or: false,
            ...defaultValues,
        },
    })

    const updateMutation = useUpdateCurrentBranchSettings({
        onSuccess: (data) => {
            form.reset(data)
            onSuccess?.(data)
        },
        onError,
    })

    const onSubmit = form.handleSubmit(
        async (formData) => await updateMutation.mutateAsync(formData)
    )

    const { error, isPending } = updateMutation

    const isDisabled = (field: Path<TBranchSettingsFormValues>) =>
        readOnly || disabledFields?.includes(field) || false

    useFormHelper<IBranchSettingsRequest>({
        form,
        defaultValues,
        resetOnDefaultChange: resetOnDefaultChange,
    })

    return (
        <Form {...form}>
            <form
                onSubmit={onSubmit}
                className={cn('flex w-full flex-col gap-y-6', className)}
            >
                <fieldset
                    disabled={isPending || readOnly}
                    className="space-y-6"
                >
                    {/* Withdraw OR Settings */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="size-fit rounded-full bg-red-100 p-2 dark:bg-red-900/20">
                                <HandCoinsIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
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
                                name="branch_setting_withdraw_or_start"
                                label="Start OR"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="text"
                                        min="0"
                                        placeholder="Start OR"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                name="branch_setting_withdraw_or_current"
                                label="Current OR"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="text"
                                        min="0"
                                        placeholder="Current OR"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                name="branch_setting_withdraw_or_end"
                                label="End OR"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="text"
                                        min="0"
                                        placeholder="End OR"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                name="branch_setting_withdraw_or_iteration"
                                label="OR Iteration"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="text"
                                        min="0"
                                        placeholder="OR Iteration"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                        </div>

                        <FormFieldWrapper
                            control={form.control}
                            name="branch_setting_withdraw_prefix"
                            label="OR Prefix"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="text"
                                    placeholder="Enter prefix (optional)"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />

                        <div className="space-y-3">
                            <FormFieldWrapper
                                control={form.control}
                                name="branch_setting_withdraw_allow_user_input"
                                render={({ field }) => (
                                    <div className="shadow-xs relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
                                        <Switch
                                            id={field.name}
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="order-1 after:absolute after:inset-0"
                                            aria-describedby={`${field.name}-desc`}
                                            disabled={isDisabled(field.name)}
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
                                                    id={`${field.name}-desc`}
                                                    className="text-xs text-muted-foreground"
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
                                name="branch_setting_withdraw_or_unique"
                                render={({ field }) => (
                                    <div className="shadow-xs relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
                                        <Switch
                                            id={field.name}
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="order-1 after:absolute after:inset-0"
                                            aria-describedby={`${field.name}-desc`}
                                            disabled={isDisabled(field.name)}
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
                                                    id={`${field.name}-desc`}
                                                    className="text-xs text-muted-foreground"
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
                                name="branch_setting_withdraw_use_date_or"
                                render={({ field }) => (
                                    <div className="shadow-xs relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
                                        <Switch
                                            id={field.name}
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="order-1 after:absolute after:inset-0"
                                            aria-describedby={`${field.name}-desc`}
                                            disabled={isDisabled(field.name)}
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
                                                    id={`${field.name}-desc`}
                                                    className="text-xs text-muted-foreground"
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
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="size-fit rounded-full bg-green-100 p-2 dark:bg-green-900/20">
                                <MoneyCheckIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Deposit OR Settings
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Configure official receipt settings for
                                    deposits
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-x-4 gap-y-3 md:grid-cols-4">
                            <FormFieldWrapper
                                control={form.control}
                                name="branch_setting_deposit_or_start"
                                label="Start OR"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="text"
                                        min="0"
                                        placeholder="Start OR"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                name="branch_setting_deposit_or_current"
                                label="Current OR"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="text"
                                        min="0"
                                        placeholder="Current OR"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                name="branch_setting_deposit_or_end"
                                label="End OR"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="text"
                                        min="0"
                                        placeholder="End OR"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                name="branch_setting_deposit_or_iteration"
                                label="OR Iteration"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="text"
                                        min="0"
                                        placeholder="OR Iteration"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                        </div>

                        <FormFieldWrapper
                            control={form.control}
                            name="branch_setting_deposit_prefix"
                            label="OR Prefix"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="text"
                                    placeholder="Enter prefix (optional)"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />

                        <div className="space-y-3">
                            <FormFieldWrapper
                                control={form.control}
                                name="branch_setting_deposit_allow_user_input"
                                render={({ field }) => (
                                    <div className="shadow-xs relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
                                        <Switch
                                            id={field.name}
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="order-1 after:absolute after:inset-0"
                                            aria-describedby={`${field.name}-desc`}
                                            disabled={isDisabled(field.name)}
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
                                                    id={`${field.name}-desc`}
                                                    className="text-xs text-muted-foreground"
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
                                name="branch_setting_deposit_or_unique"
                                render={({ field }) => (
                                    <div className="shadow-xs relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
                                        <Switch
                                            id={field.name}
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="order-1 after:absolute after:inset-0"
                                            aria-describedby={`${field.name}-desc`}
                                            disabled={isDisabled(field.name)}
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
                                                    id={`${field.name}-desc`}
                                                    className="text-xs text-muted-foreground"
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
                                name="branch_setting_deposit_use_date_or"
                                render={({ field }) => (
                                    <div className="shadow-xs relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
                                        <Switch
                                            id={field.name}
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="order-1 after:absolute after:inset-0"
                                            aria-describedby={`${field.name}-desc`}
                                            disabled={isDisabled(field.name)}
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
                                                    id={`${field.name}-desc`}
                                                    className="text-xs text-muted-foreground"
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
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="size-fit rounded-full bg-blue-100 p-2 dark:bg-blue-900/20">
                                <CreditCardIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Loan OR Settings
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Configure official receipt settings for
                                    loans
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-x-4 gap-y-3 md:grid-cols-4">
                            <FormFieldWrapper
                                control={form.control}
                                name="branch_setting_loan_or_start"
                                label="Start OR"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="text"
                                        min="0"
                                        placeholder="Start OR"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                name="branch_setting_loan_or_current"
                                label="Current OR"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="text"
                                        min="0"
                                        placeholder="Current OR"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                name="branch_setting_loan_or_end"
                                label="End OR"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="text"
                                        min="0"
                                        placeholder="End OR"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                name="branch_setting_loan_or_iteration"
                                label="OR Iteration"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="text"
                                        min="0"
                                        placeholder="OR Iteration"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                name="branch_setting_loan_prefix"
                                label="OR Prefix"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="text"
                                        placeholder="Enter prefix (optional)"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                        </div>

                        <div className="space-y-3">
                            <FormFieldWrapper
                                control={form.control}
                                name="branch_setting_loan_allow_user_input"
                                render={({ field }) => (
                                    <div className="shadow-xs relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
                                        <Switch
                                            id={field.name}
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="order-1 after:absolute after:inset-0"
                                            aria-describedby={`${field.name}-desc`}
                                            disabled={isDisabled(field.name)}
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
                                                    id={`${field.name}-desc`}
                                                    className="text-xs text-muted-foreground"
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
                                name="branch_setting_loan_or_unique"
                                render={({ field }) => (
                                    <div className="shadow-xs relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
                                        <Switch
                                            id={field.name}
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="order-1 after:absolute after:inset-0"
                                            aria-describedby={`${field.name}-desc`}
                                            disabled={isDisabled(field.name)}
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
                                                    id={`${field.name}-desc`}
                                                    className="text-xs text-muted-foreground"
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
                                name="branch_setting_loan_use_date_or"
                                render={({ field }) => (
                                    <div className="shadow-xs relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
                                        <Switch
                                            id={field.name}
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="order-1 after:absolute after:inset-0"
                                            aria-describedby={`${field.name}-desc`}
                                            disabled={isDisabled(field.name)}
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
                                                    id={`${field.name}-desc`}
                                                    className="text-xs text-muted-foreground"
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

                    {/* Check Voucher OR Settings */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="size-fit rounded-full bg-purple-100 p-2 dark:bg-purple-900/20">
                                <ReceiptIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Check Voucher OR Settings
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Configure official receipt settings for
                                    check vouchers
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-x-4 gap-y-3 md:grid-cols-4">
                            <FormFieldWrapper
                                control={form.control}
                                name="branch_setting_check_voucher_or_start"
                                label="Start OR"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="text"
                                        min="0"
                                        placeholder="Start OR"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                name="branch_setting_check_voucher_or_current"
                                label="Current OR"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="text"
                                        min="0"
                                        placeholder="Current OR"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                name="branch_setting_check_voucher_or_end"
                                label="End OR"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="text"
                                        min="0"
                                        placeholder="End OR"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                name="branch_setting_check_voucher_or_iteration"
                                label="OR Iteration"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="text"
                                        min="0"
                                        placeholder="OR Iteration"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                        </div>

                        <FormFieldWrapper
                            control={form.control}
                            name="branch_setting_check_voucher_prefix"
                            label="OR Prefix"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="text"
                                    placeholder="Enter prefix (optional)"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />

                        <div className="space-y-3">
                            <FormFieldWrapper
                                control={form.control}
                                name="branch_setting_check_voucher_allow_user_input"
                                render={({ field }) => (
                                    <div className="shadow-xs relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
                                        <Switch
                                            id={field.name}
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="order-1 after:absolute after:inset-0"
                                            aria-describedby={`${field.name}-desc`}
                                            disabled={isDisabled(field.name)}
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
                                                    id={`${field.name}-desc`}
                                                    className="text-xs text-muted-foreground"
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
                                name="branch_setting_check_voucher_or_unique"
                                render={({ field }) => (
                                    <div className="shadow-xs relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
                                        <Switch
                                            id={field.name}
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="order-1 after:absolute after:inset-0"
                                            aria-describedby={`${field.name}-desc`}
                                            disabled={isDisabled(field.name)}
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
                                                    id={`${field.name}-desc`}
                                                    className="text-xs text-muted-foreground"
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
                                name="branch_setting_check_voucher_use_date_or"
                                render={({ field }) => (
                                    <div className="shadow-xs relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
                                        <Switch
                                            id={field.name}
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="order-1 after:absolute after:inset-0"
                                            aria-describedby={`${field.name}-desc`}
                                            disabled={isDisabled(field.name)}
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
                                                    id={`${field.name}-desc`}
                                                    className="text-xs text-muted-foreground"
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

                <FormErrorMessage errorMessage={error} />

                <fieldset disabled={readOnly || !form.formState.isDirty}>
                    <Separator className="my-2 sm:my-4" />
                    <div className="flex items-center justify-end gap-x-2">
                        <Button
                            size="sm"
                            type="button"
                            variant="ghost"
                            onClick={() => form.reset()}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            Reset
                        </Button>
                        <Button
                            size="sm"
                            type="submit"
                            disabled={isPending}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            {isPending ? (
                                <LoadingSpinner />
                            ) : (
                                'Update Branch Settings'
                            )}
                        </Button>
                    </div>
                </fieldset>
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
            title={title}
            description={description}
            className={cn('max-w-5xl', className)}
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
