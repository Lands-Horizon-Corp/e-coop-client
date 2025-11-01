import { UseFormReturn, useFieldArray, useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { AccountPicker, IAccount } from '@/modules/account'
import { CurrencyCombobox } from '@/modules/currency'
import { IMemberProfile } from '@/modules/member-profile'
import MemberPicker from '@/modules/member-profile/components/member-picker'
import TransactionReverseRequestFormModal from '@/modules/transaction/components/modals/transaction-modal-request-reverse'
import { canAddMemberProfile } from '@/modules/unbalance-account/unbalance-account.utils'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { BankIcon, InfoIcon, MoneyIcon, TrashIcon } from '@/components/icons'
import InfoTooltip from '@/components/tooltips/info-tooltip'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps, IForm, TEntityId } from '@/types'

import { useUpdateBranchSettingsCurrency } from '../../branch-settings.service'
import { IBranchSettings } from '../../branch-settings.types'
import {
    BranchSettingsCurrencySchema,
    TBranchSettingsCurrencySchema,
} from '../../branch-settings.validation'

export interface IBranchSettingsCurrencyFormProps
    extends IClassProps,
        IForm<Partial<TBranchSettingsCurrencySchema>, IBranchSettings, Error> {}

const BranchSettingsCurrencyForm = ({
    className,
    ...formProps
}: IBranchSettingsCurrencyFormProps) => {
    const modalState = useModalState()
    const form = useForm<TBranchSettingsCurrencySchema>({
        resolver: standardSchemaResolver(BranchSettingsCurrencySchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            ...formProps.defaultValues,
        },
    })

    const updateMutation = useUpdateBranchSettingsCurrency({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Branch settings currency saved.',
                textError: 'Failed to save branch settings currency.',
                onSuccess: (data) => {
                    form.reset(data)
                    formProps.onSuccess?.(data)
                },
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError } =
        useFormHelper<TBranchSettingsCurrencySchema>({
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
                className={cn('flex w-full flex-col gap-y-4', className)}
                onSubmit={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    modalState.onOpenChange(true)
                }}
                ref={formRef}
            >
                <TransactionReverseRequestFormModal
                    formProps={{
                        onSuccess: () => {
                            onSubmit()
                        },
                    }}
                    onOpenChange={modalState.onOpenChange}
                    open={modalState.open}
                />
                <fieldset
                    className="space-y-6"
                    disabled={isPending || formProps.readOnly}
                >
                    {/* Default accounts */}
                    <div className="space-y-4 p-4 bg-secondary/60 dark:bg-popover rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="size-fit rounded-full bg-yellow-100 p-2 dark:bg-yellow-900/20">
                                <BankIcon className="size-5 " />
                            </div>
                            <div>
                                <h3 className="font-semibold">
                                    Currency & Default Accounts
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    Configure currency and default accounts
                                </p>
                            </div>
                        </div>

                        <FormFieldWrapper
                            control={form.control}
                            label="Currency *"
                            name="currency_id"
                            render={({ field }) => (
                                <CurrencyCombobox
                                    {...field}
                                    onChange={(currency) => {
                                        field.onChange(currency?.id)
                                        form.setValue('currency', currency)
                                        form.setValue(
                                            'cash_on_hand_account_id',
                                            undefined as unknown as TEntityId
                                        )
                                        form.setValue(
                                            'cash_on_hand_account',
                                            undefined
                                        )
                                        form.setValue(
                                            'paid_up_shared_capital_account_id',
                                            undefined as unknown as TEntityId
                                        )
                                        form.setValue(
                                            'paid_up_shared_capital_account',
                                            undefined
                                        )
                                    }}
                                    value={field.value}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label={
                                <span>
                                    Paid Up Share Capital{' '}
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
                                                        Paid up share capital
                                                        account
                                                    </p>
                                                    <p className="text-muted-foreground text-xs">
                                                        Indicates the account
                                                        containing paid up share
                                                        capital
                                                    </p>
                                                </div>
                                            </div>
                                        }
                                    />
                                </span>
                            }
                            name="paid_up_shared_capital_account_id"
                            render={({ field }) => (
                                <AccountPicker
                                    currencyId={form.getValues('currency_id')}
                                    mode="currency-paid-up-shared-capital"
                                    nameOnly
                                    onSelect={(selectedAccount) => {
                                        field.onChange(selectedAccount?.id)
                                        form.setValue(
                                            'paid_up_shared_capital_account',
                                            selectedAccount,
                                            { shouldDirty: true }
                                        )
                                    }}
                                    placeholder="Select default account"
                                    value={form.getValues(
                                        'paid_up_shared_capital_account'
                                    )}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label={
                                <span>
                                    Cash On Hand (COH) account
                                    <InfoTooltip
                                        content={
                                            <div className="flex gap-2 text-muted-foreground max-w-[400px]">
                                                <MoneyIcon
                                                    aria-hidden="true"
                                                    className="size-6 shrink-0 opacity-60"
                                                    size={16}
                                                />
                                                <div className="space-y-1">
                                                    <p className="text-[13px] font-medium">
                                                        Cash on Hand Account
                                                    </p>
                                                    <p className="text-muted-foreground text-xs">
                                                        Indicates the Cash on
                                                        Hand account
                                                    </p>
                                                </div>
                                            </div>
                                        }
                                    />
                                </span>
                            }
                            name="cash_on_hand_account_id"
                            render={({ field }) => (
                                <AccountPicker
                                    currencyId={form.getValues('currency_id')}
                                    mode="currency-cash-and-cash-equivalence"
                                    nameOnly
                                    onSelect={(selectedAccount) => {
                                        field.onChange(selectedAccount?.id)
                                        form.setValue(
                                            'cash_on_hand_account',
                                            selectedAccount,
                                            { shouldDirty: true }
                                        )
                                    }}
                                    placeholder="Select default account"
                                    value={form.getValues(
                                        'cash_on_hand_account'
                                    )}
                                />
                            )}
                        />

                        <UnbalanceAccountSection form={form} />

                        {/* <FormFieldWrapper
                            control={form.control}
                            label={
                                <span>
                                    Account for Overflow
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
                                                        Account for Overflow
                                                    </p>
                                                    <p className="text-muted-foreground text-xs">
                                                        Account to handle
                                                        overflow transactions
                                                    </p>
                                                </div>
                                            </div>
                                        }
                                    />
                                </span>
                            }
                            name="account_for_overflow_id"
                            render={({ field }) => (
                                <AccountPicker
                                    currencyId={form.getValues('currency_id')}
                                    mode="currency"
                                    nameOnly
                                    onSelect={(selectedAccount) => {
                                        field.onChange(selectedAccount?.id)
                                        form.setValue(
                                            'account_for_overflow',
                                            selectedAccount,
                                            { shouldDirty: true }
                                        )
                                    }}
                                    placeholder="Select overflow account"
                                    value={form.getValues(
                                        'account_for_overflow'
                                    )}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label={
                                <span>
                                    Account for Underflow
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
                                                        Account for Underflow
                                                    </p>
                                                    <p className="text-muted-foreground text-xs">
                                                        Account to handle
                                                        underflow transactions
                                                    </p>
                                                </div>
                                            </div>
                                        }
                                    />
                                </span>
                            }
                            name="account_for_underflow_id"
                            render={({ field }) => (
                                <AccountPicker
                                    currencyId={form.getValues('currency_id')}
                                    mode="currency"
                                    nameOnly
                                    onSelect={(selectedAccount) => {
                                        field.onChange(selectedAccount?.id)
                                        form.setValue(
                                            'account_for_underflow',
                                            selectedAccount,
                                            { shouldDirty: true }
                                        )
                                    }}
                                    placeholder="Select underflow account"
                                    value={form.getValues(
                                        'account_for_underflow'
                                    )}
                                />
                            )}
                        /> */}
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

const UnbalanceAccountSection = ({
    form,
}: {
    form: UseFormReturn<TBranchSettingsCurrencySchema>
}) => {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'unbalanced_accounts',
    })

    const currency = form.watch('currency')
    const currencyId = form.watch('currency_id')

    return (
        <div className="space-y-4 p-4 bg-secondary/60 dark:bg-popover rounded-xl">
            <div className="flex items-center justify-between">
                <div className="flex flex-1 items-center gap-3">
                    <div>
                        <h3 className="font-semibold">Unbalance Account</h3>
                        <p className="text-xs text-muted-foreground">
                            Unbalanced Account - This setting allows the system
                            to automatically post any cash discrepancies from
                            the teller&apos;s blotter to the designated
                            accounts. When an underflow (cash shortage) occurs,
                            the amount is recorded in the Underflow Account.
                            When an overflow (cash overage) occurs, the amount
                            is recorded in the Overflow Account. This ensures
                            that all unbalanced transactions are properly
                            tracked and accounted for in the General Ledger.
                        </p>
                    </div>
                </div>
                <button
                    className="flex items-center shrink-0 gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                    disabled={!currencyId}
                    onClick={() =>
                        append({
                            currency_id: currencyId,
                            currency: currency,

                            account_for_overage:
                                undefined as unknown as IAccount,
                            account_for_overage_id:
                                undefined as unknown as TEntityId,

                            account_for_shortage:
                                undefined as unknown as IAccount,
                            account_for_shortage_id:
                                undefined as unknown as TEntityId,

                            member_profile_id_for_overage:
                                undefined as unknown as TEntityId,
                            member_profile_for_overage:
                                undefined as unknown as IMemberProfile,

                            member_profile_id_for_shortage:
                                undefined as unknown as TEntityId,
                            member_profile_for_shortage:
                                undefined as unknown as IMemberProfile,
                        })
                    }
                    type="button"
                >
                    ADD +
                </button>
            </div>

            {fields.length > 0 && (
                <FormFieldWrapper
                    control={form.control}
                    name="unbalanced_accounts"
                    render={({ field }) => (
                        <div className="space-y-3" ref={field.ref}>
                            {fields.map((field, index) => {
                                const shortageAccount = form.watch(
                                    `unbalanced_accounts.${index}`
                                ).account_for_shortage as IAccount | undefined
                                const overageAccount = form.watch(
                                    `unbalanced_accounts.${index}`
                                ).account_for_overage as IAccount | undefined

                                const overageCanAddMemberProfile =
                                    canAddMemberProfile(overageAccount)

                                const shortageCanAddMemberProfile =
                                    canAddMemberProfile(shortageAccount)

                                const basedCurrencyId =
                                    form.watch(
                                        `unbalanced_accounts.${index}.currency_id`
                                    ) || currencyId

                                return (
                                    <div
                                        className="space-y-3 p-4 bg-background dark:bg-secondary/40 rounded-2xl border border-border"
                                        key={field.id}
                                    >
                                        <div className="flex items-start justify-between">
                                            <FormFieldWrapper
                                                control={form.control}
                                                label="Currency *"
                                                name={`unbalanced_accounts.${index}.currency_id`}
                                                render={({ field }) => (
                                                    <CurrencyCombobox
                                                        className="w-fit"
                                                        onChange={(
                                                            selected
                                                        ) => {
                                                            if (
                                                                selected.id ===
                                                                form.getValues(
                                                                    `unbalanced_accounts.${index}.currency_id`
                                                                )
                                                            )
                                                                return

                                                            field.onChange(
                                                                selected.id
                                                            )
                                                            form.setValue(
                                                                `unbalanced_accounts.${index}.currency`,
                                                                selected
                                                            )

                                                            form.setValue(
                                                                `unbalanced_accounts.${index}.account_for_shortage_id`,
                                                                undefined as unknown as TEntityId
                                                            )
                                                            form.setValue(
                                                                `unbalanced_accounts.${index}.account_for_shortage`,
                                                                undefined
                                                            )
                                                            form.setValue(
                                                                `unbalanced_accounts.${index}.account_for_overage_id`,
                                                                undefined as unknown as TEntityId
                                                            )
                                                            form.setValue(
                                                                `unbalanced_accounts.${index}.account_for_overage`,
                                                                undefined
                                                            )

                                                            form.setValue(
                                                                `unbalanced_accounts.${index}.member_profile_for_shortage`,
                                                                undefined
                                                            )
                                                            form.setValue(
                                                                `unbalanced_accounts.${index}.member_profile_id_for_shortage`,
                                                                undefined
                                                            )

                                                            form.setValue(
                                                                `unbalanced_accounts.${index}.member_profile_for_overage`,
                                                                undefined
                                                            )
                                                            form.setValue(
                                                                `unbalanced_accounts.${index}.member_profile_id_for_overage`,
                                                                undefined
                                                            )
                                                        }}
                                                        placeholder="Select Currency"
                                                        value={field.value}
                                                    />
                                                )}
                                            />
                                            <Button
                                                className="text-destructive size-fit p-2 hover:text-destructive/80 text-sm"
                                                onClick={() => {
                                                    const itemId =
                                                        form.getValues(
                                                            `unbalanced_accounts.${index}.id`
                                                        )
                                                    if (itemId) {
                                                        const deleteIds =
                                                            form.getValues(
                                                                'unbalanced_account_delete_ids'
                                                            )
                                                        form.setValue(
                                                            'unbalanced_account_delete_ids',
                                                            [
                                                                ...deleteIds,
                                                                itemId,
                                                            ]
                                                        )
                                                    }
                                                    remove(index)
                                                }}
                                                size="icon"
                                                type="button"
                                                variant="destructive"
                                            >
                                                <TrashIcon />
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <FormFieldWrapper
                                                control={form.control}
                                                label="Account for Shortage"
                                                name={`unbalanced_accounts.${index}.account_for_shortage_id`}
                                                render={({ field }) => (
                                                    <AccountPicker
                                                        currencyId={
                                                            basedCurrencyId
                                                        }
                                                        mode="currency"
                                                        nameOnly
                                                        onSelect={(
                                                            selectedAccount
                                                        ) => {
                                                            field.onChange(
                                                                selectedAccount?.id
                                                            )
                                                            form.setValue(
                                                                `unbalanced_accounts.${index}.account_for_shortage`,
                                                                selectedAccount,
                                                                {
                                                                    shouldDirty: true,
                                                                }
                                                            )

                                                            if (
                                                                !canAddMemberProfile(
                                                                    selectedAccount
                                                                )
                                                            ) {
                                                                form.setValue(
                                                                    `unbalanced_accounts.${index}.member_profile_for_shortage`,
                                                                    undefined
                                                                )
                                                                form.setValue(
                                                                    `unbalanced_accounts.${index}.member_profile_id_for_shortage`,
                                                                    undefined
                                                                )
                                                            }
                                                        }}
                                                        placeholder="Select account"
                                                        value={form.getValues(
                                                            `unbalanced_accounts.${index}.account_for_shortage`
                                                        )}
                                                    />
                                                )}
                                            />

                                            <FormFieldWrapper
                                                control={form.control}
                                                label="Account for Overage"
                                                name={`unbalanced_accounts.${index}.account_for_overage_id`}
                                                render={({ field }) => (
                                                    <AccountPicker
                                                        currencyId={
                                                            basedCurrencyId
                                                        }
                                                        mode="currency"
                                                        nameOnly
                                                        onSelect={(
                                                            selectedAccount
                                                        ) => {
                                                            field.onChange(
                                                                selectedAccount?.id
                                                            )
                                                            form.setValue(
                                                                `unbalanced_accounts.${index}.account_for_overage`,
                                                                selectedAccount,
                                                                {
                                                                    shouldDirty: true,
                                                                }
                                                            )
                                                            if (
                                                                !canAddMemberProfile(
                                                                    selectedAccount
                                                                )
                                                            ) {
                                                                form.setValue(
                                                                    `unbalanced_accounts.${index}.member_profile_for_overage`,
                                                                    undefined
                                                                )
                                                                form.setValue(
                                                                    `unbalanced_accounts.${index}.member_profile_id_for_overage`,
                                                                    undefined
                                                                )
                                                            }
                                                        }}
                                                        placeholder="Select account"
                                                        value={form.getValues(
                                                            `unbalanced_accounts.${index}.account_for_overage`
                                                        )}
                                                    />
                                                )}
                                            />

                                            {shortageCanAddMemberProfile ? (
                                                <FormFieldWrapper
                                                    control={form.control}
                                                    label="Member Profile for Shortage"
                                                    name={`unbalanced_accounts.${index}.member_profile_id_for_shortage`}
                                                    render={({ field }) => (
                                                        <MemberPicker
                                                            onSelect={(
                                                                selectedMember
                                                            ) => {
                                                                field.onChange(
                                                                    selectedMember?.id
                                                                )
                                                                form.setValue(
                                                                    `unbalanced_accounts.${index}.member_profile_for_shortage`,
                                                                    selectedMember,
                                                                    {
                                                                        shouldDirty: true,
                                                                    }
                                                                )
                                                            }}
                                                            placeholder="Select member profile"
                                                            value={form.getValues(
                                                                `unbalanced_accounts.${index}.member_profile_for_shortage`
                                                            )}
                                                        />
                                                    )}
                                                />
                                            ) : (
                                                <span />
                                            )}

                                            {overageCanAddMemberProfile ? (
                                                <FormFieldWrapper
                                                    control={form.control}
                                                    label="Member Profile for Overage"
                                                    name={`unbalanced_accounts.${index}.member_profile_id_for_overage`}
                                                    render={({ field }) => (
                                                        <MemberPicker
                                                            onSelect={(
                                                                selectedAccount
                                                            ) => {
                                                                field.onChange(
                                                                    selectedAccount?.id
                                                                )
                                                                form.setValue(
                                                                    `unbalanced_accounts.${index}.member_profile_for_overage`,
                                                                    selectedAccount,
                                                                    {
                                                                        shouldDirty: true,
                                                                    }
                                                                )
                                                            }}
                                                            placeholder="Select member profile"
                                                            value={form.getValues(
                                                                `unbalanced_accounts.${index}.member_profile_for_overage`
                                                            )}
                                                        />
                                                    )}
                                                />
                                            ) : (
                                                <span />
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                />
            )}
        </div>
    )
}

export default BranchSettingsCurrencyForm
