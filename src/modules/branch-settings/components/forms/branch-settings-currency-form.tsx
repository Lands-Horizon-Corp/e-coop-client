import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { AccountPicker } from '@/modules/account'
import { CurrencyCombobox } from '@/modules/currency'
import TransactionReverseRequestFormModal from '@/modules/transaction/components/modals/transaction-modal-request-reverse'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { BankIcon, InfoIcon, MoneyIcon } from '@/components/icons'
import InfoTooltip from '@/components/tooltips/info-tooltip'
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
                className={cn('flex w-full flex-col gap-y-6', className)}
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
                                    value={form.watch('currency')}
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

export default BranchSettingsCurrencyForm
