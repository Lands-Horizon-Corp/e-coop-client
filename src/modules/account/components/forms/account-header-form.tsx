import { Path, UseFormReturn } from 'react-hook-form'

import { AccountCategoryComboBox } from '@/modules/account-category'
import { AccountClassificationComboBox } from '@/modules/account-classification'
import { CurrencyCombobox } from '@/modules/currency'
import MemberTypeCombobox from '@/modules/member-type/components/member-type-combobox'
import { EyeIcon } from 'lucide-react'

import IconCombobox from '@/components/comboboxes/icon-combobox'
import { GradientBackground } from '@/components/gradient-background/gradient-background'
import {
    ExcludeIcon,
    FaCalendarCheckIcon,
    HandCoinsIcon,
    InternalIcon,
    MoneyBagIcon,
    MoneyIcon,
    TIcon,
} from '@/components/icons'
import TextEditor from '@/components/text-editor'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FormControl } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select'

import { useModalState } from '@/hooks/use-modal-state'

import { GeneralLedgerTypeEnum } from '../../account.types'
import { TAccountFormValues } from '../../account.validation'

type AccountHeaderProps = {
    form: UseFormReturn<TAccountFormValues>
    isReadOnly?: boolean
    isDisabled: (fieldName: Path<TAccountFormValues>) => boolean
    isLoading?: boolean
}

const AccountHeaderForm = ({
    form,
    isReadOnly,
    isDisabled,
}: AccountHeaderProps) => {
    return (
        <div>
            <div className="flex space-x-2">
                <FormFieldWrapper
                    className="flex-1"
                    control={form.control}
                    disabled={isReadOnly}
                    label="Currency *"
                    name="currency_id"
                    render={({ field }) => (
                        <CurrencyCombobox
                            disabled={isDisabled(field.name)}
                            onChange={(selected) => field.onChange(selected.id)}
                            placeholder="Select Currency"
                            value={field.value}
                        />
                    )}
                />
                <FormFieldWrapper
                    className="flex-1"
                    control={form.control}
                    disabled={isReadOnly}
                    label="Icon"
                    name="icon"
                    render={({ field }) => (
                        <IconCombobox
                            {...field}
                            disabled={isDisabled(field.name)}
                            placeholder="Select Icon"
                            value={field.value as TIcon}
                        />
                    )}
                />
                <FormFieldWrapper
                    className="flex-3"
                    control={form.control}
                    disabled={isReadOnly}
                    label="Account Name *"
                    name="name"
                    render={({ field }) => (
                        <Input
                            {...field}
                            autoComplete="off"
                            disabled={isDisabled(field.name)}
                            id={field.name}
                            placeholder="Account Name"
                            value={field.value ?? ''}
                        />
                    )}
                />
                <FormFieldWrapper
                    className="flex-1"
                    control={form.control}
                    label="General Ledger Type *"
                    name="general_ledger_type"
                    render={({ field }) => (
                        <FormControl>
                            <Select
                                defaultValue={field.value}
                                disabled={isDisabled(field.name)}
                                onValueChange={(selectedValue) => {
                                    field.onChange(selectedValue)
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    {field.value ||
                                        'select General Ledger Type'}
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(GeneralLedgerTypeEnum).map(
                                        (account) => {
                                            return (
                                                <SelectItem
                                                    key={account}
                                                    value={account}
                                                >
                                                    {account}
                                                </SelectItem>
                                            )
                                        }
                                    )}
                                </SelectContent>
                            </Select>
                        </FormControl>
                    )}
                />
            </div>
            <div className="grid flex-2 w-full gap-x-2 grid-cols-4">
                <FormFieldWrapper
                    control={form.control}
                    label="Alternative Code"
                    name="alternative_code"
                    render={({ field }) => (
                        <Input
                            {...field}
                            autoComplete="off"
                            disabled={isDisabled(field.name)}
                            id={field.name}
                            placeholder="Account Name"
                        />
                    )}
                />
                <FormFieldWrapper
                    className="col-span-1"
                    control={form.control}
                    label="Member Type"
                    name="member_type_id"
                    render={({ field }) => (
                        <MemberTypeCombobox
                            {...field}
                            disabled={isDisabled(field.name)}
                            onChange={(selected) => field.onChange(selected.id)}
                            placeholder="Select Member Type"
                        />
                    )}
                />
                <FormFieldWrapper
                    control={form.control}
                    label="Account Classification"
                    name="account_classification_id"
                    render={({ field }) => (
                        <AccountClassificationComboBox
                            disabled={isDisabled(field.name)}
                            onChange={(selected) => field.onChange(selected.id)}
                            placeholder="Select Account Classification"
                            value={field.value}
                        />
                    )}
                />
                <FormFieldWrapper
                    control={form.control}
                    label="Account Category"
                    name="account_category_id"
                    render={({ field }) => (
                        <AccountCategoryComboBox
                            disabled={isDisabled(field.name)}
                            onChange={(selected) => field.onChange(selected.id)}
                            placeholder="Select Account Category"
                            value={field.value}
                        />
                    )}
                />
            </div>
            <FormFieldWrapper
                className="col-span-4"
                control={form.control}
                label="Account Description"
                name="description"
                render={({ field }) => {
                    const { ref: _ref, ...rest } = field
                    return (
                        <TextEditor
                            {...rest}
                            content={field.value ?? ''}
                            disabled={isDisabled(field.name)}
                            placeholder="Write some description about the account..."
                            textEditorClassName="!max-w-none !h-12"
                        />
                    )
                }}
            />
        </div>
    )
}

export const AccountGlSourceVisibility = ({
    form,
    isDisabled,
    isLoading,
}: AccountHeaderProps) => {
    const modalState = useModalState()
    return (
        <Popover modal {...modalState}>
            <PopoverTrigger
                className="flex items-center"
                onClick={(e) => {
                    modalState.onOpenChange(true)
                    e.preventDefault()
                }}
            >
                <Button
                    className="mb-0 rounded-full size-fit !p-0 border-accent !py-0.5 !px-2 "
                    size="sm"
                    variant="outline"
                >
                    <EyeIcon className="mr-2 size-4" />
                    View GL Source Visibility
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit">
                <h4 className="text-sm font-medium text-muted-foreground">
                    General Ledger Source Visibility
                </h4>
                <div className="grid grid-cols-2 gap-2 ">
                    <FormFieldWrapper
                        control={form.control}
                        name="show_in_general_ledger_source_withdraw"
                        render={({ field }) => (
                            <GradientBackground gradientOnly>
                                <div className="shadow-xs relative flex w-full items-start gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                    <Checkbox
                                        checked={field.value}
                                        className="order-1 after:absolute after:inset-0"
                                        disabled={
                                            isDisabled(field.name) || isLoading
                                        }
                                        id={field.name}
                                        onCheckedChange={field.onChange}
                                    />
                                    <div className="flex grow items-center gap-3">
                                        <div className="size-fit rounded-full bg-secondary p-2">
                                            <HandCoinsIcon className="size-4" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={field.name}>
                                                Show in Withdraw
                                            </Label>
                                            <p className="text-xs text-muted-foreground">
                                                Show this account in withdraw
                                                transactions
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </GradientBackground>
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        name="show_in_general_ledger_source_deposit"
                        render={({ field }) => (
                            <GradientBackground gradientOnly>
                                <div className="shadow-xs relative flex w-full items-start gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                    <Checkbox
                                        checked={field.value}
                                        className="order-1 after:absolute after:inset-0"
                                        disabled={
                                            isDisabled(field.name) || isLoading
                                        }
                                        id={field.name}
                                        onCheckedChange={field.onChange}
                                    />
                                    <div className="flex grow items-center gap-3">
                                        <div className="size-fit rounded-full bg-secondary p-2">
                                            <MoneyIcon className="size-4" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={field.name}>
                                                Show in Deposit
                                            </Label>
                                            <p className="text-xs text-muted-foreground">
                                                Show this account in deposit
                                                transactions
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </GradientBackground>
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="show_in_general_ledger_source_journal"
                        render={({ field }) => (
                            <GradientBackground gradientOnly>
                                <div className="shadow-xs relative flex w-full items-start gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                    <Checkbox
                                        checked={field.value}
                                        className="order-1 after:absolute after:inset-0"
                                        disabled={
                                            isDisabled(field.name) || isLoading
                                        }
                                        id={field.name}
                                        onCheckedChange={field.onChange}
                                    />
                                    <div className="flex grow items-center gap-3">
                                        <div className="size-fit rounded-full bg-secondary p-2">
                                            <InternalIcon className="size-4" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={field.name}>
                                                Show in Journal
                                            </Label>
                                            <p className="text-xs text-muted-foreground">
                                                Show this account in journal
                                                entries
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </GradientBackground>
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="show_in_general_ledger_source_payment"
                        render={({ field }) => (
                            <GradientBackground gradientOnly>
                                <div className="shadow-xs relative flex w-full items-start gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                    <Checkbox
                                        checked={field.value}
                                        className="order-1 after:absolute after:inset-0"
                                        disabled={
                                            isDisabled(field.name) || isLoading
                                        }
                                        id={field.name}
                                        onCheckedChange={field.onChange}
                                    />
                                    <div className="flex grow items-center gap-3">
                                        <div className="size-fit rounded-full bg-secondary p-2">
                                            <MoneyBagIcon className="size-4" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={field.name}>
                                                Show in Payment
                                            </Label>
                                            <p className="text-xs text-muted-foreground">
                                                Show this account in payment
                                                transactions
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </GradientBackground>
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="show_in_general_ledger_source_adjustment"
                        render={({ field }) => (
                            <GradientBackground gradientOnly>
                                <div className="shadow-xs relative flex w-full items-start gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                    <Checkbox
                                        checked={field.value}
                                        className="order-1 after:absolute after:inset-0"
                                        disabled={
                                            isDisabled(field.name) || isLoading
                                        }
                                        id={field.name}
                                        onCheckedChange={field.onChange}
                                    />
                                    <div className="flex grow items-center gap-3">
                                        <div className="size-fit rounded-full bg-secondary p-2">
                                            <ExcludeIcon className="size-4" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={field.name}>
                                                Show in Adjustment
                                            </Label>
                                            <p className="text-xs text-muted-foreground">
                                                Show this account in adjustment
                                                entries
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </GradientBackground>
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="show_in_general_ledger_source_journal_voucher"
                        render={({ field }) => (
                            <GradientBackground gradientOnly>
                                <div className="shadow-xs relative flex w-full items-start gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                    <Checkbox
                                        checked={field.value}
                                        className="order-1 after:absolute after:inset-0"
                                        disabled={
                                            isDisabled(field.name) || isLoading
                                        }
                                        id={field.name}
                                        onCheckedChange={field.onChange}
                                    />
                                    <div className="flex grow items-center gap-3">
                                        <div className="size-fit rounded-full bg-secondary p-2">
                                            <InternalIcon className="size-4" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={field.name}>
                                                Show in Journal Voucher
                                            </Label>
                                            <p className="text-xs text-muted-foreground">
                                                Show this account in journal
                                                vouchers
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </GradientBackground>
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="show_in_general_ledger_source_check_voucher"
                        render={({ field }) => (
                            <GradientBackground gradientOnly>
                                <div className="shadow-xs relative flex w-full items-start gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                    <Checkbox
                                        checked={field.value}
                                        className="order-1 after:absolute after:inset-0"
                                        disabled={
                                            isDisabled(field.name) || isLoading
                                        }
                                        id={field.name}
                                        onCheckedChange={field.onChange}
                                    />
                                    <div className="flex grow items-center gap-3">
                                        <div className="size-fit rounded-full bg-secondary p-2">
                                            <FaCalendarCheckIcon className="size-4" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={field.name}>
                                                Show in Check Voucher
                                            </Label>
                                            <p className="text-xs text-muted-foreground">
                                                Show this account in check
                                                vouchers
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </GradientBackground>
                        )}
                    />
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default AccountHeaderForm
