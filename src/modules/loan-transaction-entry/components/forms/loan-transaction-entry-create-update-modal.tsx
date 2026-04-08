import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { AccountPicker, TAccountType } from '@/modules/account'
import { CurrencyInput, ICurrency } from '@/modules/currency'
import { LoanGuideModal } from '@/modules/loan-guide/components/loan-guide'
import {
    ILoanTransactionEntry,
    LoanTransactionEntrySchema,
    TLoanTransactionEntrySchema,
    useCreateLoanTransactionEntry,
    useUpdateLoanTransactionEntryById,
} from '@/modules/loan-transaction-entry'
import LoanTransactionCombobox from '@/modules/loan-transaction/components/loan-combobox'
import MemberPicker from '@/modules/member-profile/components/member-picker'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { CalendarNumberIcon, XIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useIdempotency } from '@/hooks/use-idempotency'
import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps, IForm, TEntityId } from '@/types'

export interface IChargeFormProps
    extends
        IClassProps,
        IForm<
            Partial<ILoanTransactionEntry>,
            ILoanTransactionEntry,
            Error,
            TLoanTransactionEntrySchema
        > {
    id?: TEntityId
    loanTransactionId: TEntityId
    currency?: ICurrency
}

const LoanTransactionEntryCreateUpdate = ({
    className,
    onSuccess,
    id,
    readOnly,
    currency,
    loanTransactionId,
    ...formProps
}: IChargeFormProps) => {
    const form = useForm<TLoanTransactionEntrySchema>({
        resolver: standardSchemaResolver(LoanTransactionEntrySchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            is_add_on: false,
            amount: formProps.defaultValues?.credit || 0,
            ...formProps.defaultValues,
        },
    })

    const { idempotencyKey, resetIdempotencyKey } = useIdempotency()
    const deductionType = form.watch('type')

    const { firstError, formRef, isDisabled } =
        useFormHelper<TLoanTransactionEntrySchema>({
            form,
            readOnly,
            autoSave: false,
        })

    const createMutation = useCreateLoanTransactionEntry({
        options: {
            onSuccess: onSuccess,
            onError: formProps.onError,
        },
    })
    const updateMutation = useUpdateLoanTransactionEntryById({
        options: {
            onSuccess: () => {
                onSuccess?.(form.getValues() as ILoanTransactionEntry)
                resetIdempotencyKey()
            },
            onError: formProps.onError,
        },
    })

    const { error: rawError, isPending } = id ? updateMutation : createMutation

    const error = firstError || serverRequestErrExtractor({ error: rawError })

    const loanGuidePaymentModal = useModalState()

    const onSubmit = form.handleSubmit(async (formData, e) => {
        e?.stopPropagation()
        e?.preventDefault()

        const requestFn = id
            ? updateMutation.mutateAsync({ id, payload: formData })
            : createMutation.mutateAsync({
                  loanTransactionId,
                  payload: formData,
                  idempotencyKey,
              })

        toast.promise(requestFn, {
            loading: 'Saving deduction...',
            success: 'Deduction Saved',
            error: `Something went wrong, please try again. ${error || ''}`,
        })
    })

    const member = form.watch('member_profile')
    const member_id = form.watch('member_profile_id')

    return (
        <Form {...form}>
            <form
                className={cn(
                    'flex w-full max-w-full min-w-0 flex-col gap-y-4',
                    className
                )}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <div className="space-y-4">
                    <FormFieldWrapper
                        control={form.control}
                        label="Account"
                        name="account_id"
                        render={({ field }) => (
                            <AccountPicker
                                currencyId={currency?.id as TEntityId}
                                disabled={
                                    isDisabled(field.name) ||
                                    deductionType === 'automatic-deduction'
                                }
                                hideDescription
                                mode={currency ? 'currency' : 'all'}
                                onSelect={(account) => {
                                    field.onChange(account?.id)
                                    form.setValue('account', account, {
                                        shouldDirty: true,
                                    })
                                    form.setValue(
                                        'description',
                                        account.description,
                                        { shouldDirty: true }
                                    )
                                }}
                                placeholder="Select Account for Charge"
                                value={form.getValues('account')}
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        label="Amount"
                        name="amount"
                        render={({ field: { onChange, ...field } }) => (
                            <CurrencyInput
                                {...field}
                                currency={form.watch('account')?.currency}
                                disabled={isDisabled(field.name)}
                                onValueChange={(newValue = '') => {
                                    onChange(newValue)
                                }}
                                placeholder="0.00"
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Description"
                        name="description"
                        render={({ field }) => (
                            <Textarea
                                {...field}
                                disabled={isDisabled(field.name)}
                                id={field.name}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        onSubmit()
                                        e.preventDefault()
                                    }
                                }}
                                placeholder="Charge description"
                                rows={3}
                            />
                        )}
                    />

                    <FormFieldWrapper
                        className="md:col-span-3"
                        control={form.control}
                        label="Member Profile"
                        name="member_profile_id"
                        render={({ field }) => {
                            return (
                                <div className="flex flex-1 items-center gap-x-1">
                                    <MemberPicker
                                        disabled={isDisabled(field.name)}
                                        mainTriggerClassName="flex-1"
                                        onSelect={(selectedMember) => {
                                            field.onChange(selectedMember?.id)
                                            form.setValue(
                                                'member_profile',
                                                selectedMember
                                            )
                                        }}
                                        placeholder="Member Profile"
                                        value={member}
                                    />
                                    {field.value && (
                                        <Button
                                            className="size-fit p-2.5! shrink-0"
                                            onClick={() => {
                                                field.onChange(undefined)
                                                form.setValue(
                                                    'member_profile',
                                                    undefined
                                                )
                                            }}
                                            type="button"
                                            variant="destructive"
                                        >
                                            <XIcon />
                                        </Button>
                                    )}
                                </div>
                            )
                        }}
                    />

                    {(
                        [
                            'Loan',
                            'SVF-Ledger',
                            'Interest',
                            'Fines',
                        ] as TAccountType[]
                    ).includes(form.watch('account')?.type) && (
                        <div className="flex gap-x-1 items-end">
                            <FormFieldWrapper
                                control={form.control}
                                label="Loan"
                                labelClassName="text-xs font-medium text-muted-foreground"
                                name="member_loan_transaction_id"
                                render={({ field }) => (
                                    <LoanTransactionCombobox
                                        {...field}
                                        disabled={isDisabled(
                                            'member_loan_transaction_id'
                                        )}
                                        loanAccountId={form.watch('account_id')}
                                        memberProfileId={member_id}
                                        mode="member-profile-loan-account"
                                        onChange={(selectedLoanTransaction) => {
                                            if (
                                                (selectedLoanTransaction?.balance ||
                                                    0) <= 0
                                            )
                                                return toast.warning(
                                                    "You can't select loan is fully paid"
                                                )

                                            field.onChange(
                                                selectedLoanTransaction?.id
                                            )
                                            form.setValue(
                                                'member_loan_transaction',
                                                selectedLoanTransaction
                                            )
                                            form.setValue(
                                                'amount',
                                                selectedLoanTransaction?.balance ||
                                                    0
                                            )
                                        }}
                                        placeholder="Select loan type"
                                        value={field.value ?? undefined}
                                    />
                                )}
                            />
                            {form.watch('member_loan_transaction_id') && (
                                <>
                                    <div
                                        className="absolute"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <LoanGuideModal
                                            {...loanGuidePaymentModal}
                                            loanTransactionId={
                                                form.watch(
                                                    'member_loan_transaction_id'
                                                )!
                                            }
                                        />
                                    </div>
                                    <Button
                                        className="text-xs px-2 w-fit mb-0.5 mr-auto"
                                        onClick={() =>
                                            loanGuidePaymentModal.onOpenChange(
                                                true
                                            )
                                        }
                                        size="sm"
                                        type="button"
                                    >
                                        <CalendarNumberIcon />
                                    </Button>
                                </>
                            )}
                        </div>
                    )}

                    <div className="flex items-center gap-6">
                        <FormFieldWrapper
                            className="w-fit"
                            control={form.control}
                            name="is_add_on"
                            render={({ field }) => (
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={field.value || false}
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        onCheckedChange={field.onChange}
                                    />
                                    <Label
                                        className="text-sm font-medium"
                                        htmlFor={field.name}
                                    >
                                        Add-on Charge
                                    </Label>
                                </div>
                            )}
                        />
                    </div>
                </div>

                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty || isPending}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                    }}
                    onSubmit={(e) => onSubmit(e)}
                    readOnly={readOnly}
                    resetButtonType="button"
                    submitButtonType="button"
                    submitText={
                        formProps.defaultValues?.id ? 'Update' : 'Create'
                    }
                />
            </form>
        </Form>
    )
}

export const LoanTransactionEntryCreateUpdateModal = ({
    title = 'Add/Edit Charge',
    description = 'Edit or Add a new deduction.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: IChargeFormProps
}) => {
    return (
        <Modal
            className={cn('max-w-xl!', className)}
            description={description}
            title={title}
            {...props}
        >
            <LoanTransactionEntryCreateUpdate
                {...formProps}
                onSuccess={(charge) => {
                    formProps.onSuccess?.(charge)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default LoanTransactionEntryCreateUpdate

export type CreateVariables<TPayload> =
    | TPayload // Direct: create(payload)
    | {
          payload: TPayload // Wrapped: create({ payload, idempotencyKey })
          idempotencyKey?: string
      }
