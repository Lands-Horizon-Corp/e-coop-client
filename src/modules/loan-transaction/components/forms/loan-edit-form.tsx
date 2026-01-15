import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { CurrencyInput } from '@/modules/currency'
import MemberProfileInfoViewLoanCard from '@/modules/member-profile/components/member-profile-info-loan-view-card'
import useConfirmModalStore from '@/store/confirm-modal-store'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import CopyWrapper from '@/components/wrappers/copy-wrapper'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import { useLoanEdit } from '../../loan-transaction.service'
import {
    ILoanEditTransactionRequest,
    ILoanTransaction,
    TLoanType,
} from '../../loan-transaction.types'
import { LoanEditTransactionSchema } from '../../loan-transaction.validation'
import { LOAN_TYPE } from '../../loan.constants'
import LoanTypeConfirmDisplay from '../confirm-dialog-displays/loan-type-confirm-display'
import LoanModeOfPaymentCombobox from '../loan-mode-of-payment-combobox'
import WeekdayCombobox from '../weekday-combobox'
import LoanComakerSection from './loan-transaction-create-update-form/loan-comaker-section'

type TLoanEditFormValues = z.infer<typeof LoanEditTransactionSchema>

export interface ILoanEditFormProps
    extends IClassProps,
        IForm<
            Partial<ILoanEditTransactionRequest>,
            ILoanTransaction,
            Error,
            TLoanEditFormValues
        > {
    loanTransactionId: TEntityId
}

const LoanEditForm = ({ className, ...formProps }: ILoanEditFormProps) => {
    const form = useForm<TLoanEditFormValues>({
        resolver: standardSchemaResolver(LoanEditTransactionSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            ...formProps.defaultValues,
        },
    })

    const { onOpen } = useConfirmModalStore()

    const editMutation = useLoanEdit({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Loan updated',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TLoanEditFormValues>({
            form,
            autoSave: formProps.autoSave,
            readOnly: formProps.readOnly,
            hiddenFields: formProps.hiddenFields,
            disabledFields: formProps.disabledFields,
            defaultValues: formProps.defaultValues,
        })

    const onSubmit = form.handleSubmit((formData) => {
        editMutation.mutate({
            id: formProps.loanTransactionId,
            payload: formData,
        })
    }, handleFocusError)

    const { error: errorResponse, isPending, reset } = editMutation
    const error = serverRequestErrExtractor({ error: errorResponse })

    const mode_of_payment = form.watch('mode_of_payment')
    const member_profile = form.watch('member_profile')

    return (
        <Form {...form}>
            <form
                className={cn('flex flex-col gap-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                    disabled={isPending || formProps.readOnly}
                >
                    {member_profile && (
                        <div className="col-span-2 space-y-1 bg-gradient-to-br items-center justify-center from-primary/10 to-background bg-popover rounded-xl">
                            <MemberProfileInfoViewLoanCard
                                memberProfile={member_profile}
                            />
                        </div>
                    )}

                    <div className="space-y-4">
                        <section
                            className="rounded-lg bg-card border p-4 space-y-4"
                            title="Basic Information"
                        >
                            <div>
                                <h3 className="text-sm font-semibold text-primary">
                                    Basic Information
                                </h3>
                                <Separator />
                            </div>

                            <p className="text-sm">
                                Loan ID :{' '}
                                <CopyWrapper>{form.watch('id')}</CopyWrapper>
                            </p>

                            <p className="text-sm">
                                CV No. :{' '}
                                <CopyWrapper>
                                    {form.watch('voucher')}
                                </CopyWrapper>
                            </p>

                            <Separator />
                            <div className="flex flex-wrap gap-4">
                                <FormFieldWrapper
                                    className="w-fit"
                                    control={form.control}
                                    name="is_investment"
                                    render={({ field }) => (
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                aria-label="Toggle exclude sunday"
                                                checked={field.value || false}
                                                className="peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input h-4 w-6 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
                                                id={field.name}
                                                onCheckedChange={field.onChange}
                                            />
                                            <Label htmlFor={field.name}>
                                                Investment
                                            </Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </section>

                        <section
                            className="rounded-lg bg-card border p-4 space-y-4"
                            title="Basic Information"
                        >
                            <div>
                                <h3 className="text-sm font-semibold text-primary">
                                    Loan Details
                                </h3>
                                <Separator />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <FormFieldWrapper
                                    control={form.control}
                                    label="Date Release"
                                    name="released_date"
                                    render={({ field }) => (
                                        <InputDate {...field} />
                                    )}
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    label="Terms"
                                    name="terms"
                                    render={({ field }) => <Input {...field} />}
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    label="M.O.P."
                                    name="mode_of_payment"
                                    render={({ field }) => (
                                        <LoanModeOfPaymentCombobox {...field} />
                                    )}
                                />

                                <FormFieldWrapper
                                    control={form.control}
                                    label="Additional Days"
                                    name="additional_days"
                                    render={({ field }) => <Input {...field} />}
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    label="Amortization"
                                    name="amortization"
                                    render={({ field }) => <Input {...field} />}
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    label="Number of Mos"
                                    name="number_of_months"
                                    render={({ field }) => <Input {...field} />}
                                />

                                <FormFieldWrapper
                                    control={form.control}
                                    label="Loan Applied"
                                    name="applied_1"
                                    render={({ field }) => <Input {...field} />}
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    label="Applied"
                                    name="amount_granted"
                                    render={({ field }) => <Input {...field} />}
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    label="Advance Interest"
                                    name="advance_interest"
                                    render={({ field }) => <Input {...field} />}
                                />
                            </div>
                        </section>

                        <section
                            className="rounded-lg bg-card border p-4 space-y-4"
                            title="Basic Information"
                        >
                            <div>
                                <h3 className="text-sm font-semibold text-primary">
                                    Classication
                                </h3>
                                <Separator />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                                <FormFieldWrapper
                                    className="gap-y-2 col-span-9 flex flex-col"
                                    control={form.control}
                                    label="Loan Type"
                                    name="loan_type"
                                    render={({ field }) => (
                                        <RadioGroup
                                            className="grid grid-cols-2 gap-2"
                                            {...field}
                                            onValueChange={(
                                                loanType: TLoanType
                                            ) => {
                                                onOpen({
                                                    title: 'Change Loan Type',
                                                    description:
                                                        'Are you sure you want to change loan type? This action will affect loan entries.',
                                                    content:
                                                        LoanTypeConfirmDisplay({
                                                            loanType,
                                                        }),
                                                    onConfirm: () => {
                                                        field.onChange(loanType)
                                                    },
                                                })
                                            }}
                                            value={field.value ?? ''}
                                        >
                                            {LOAN_TYPE.map((loan_type, i) => (
                                                <div className="flex capitalize text-nowrap text-foreground/60 has-checked:text-foreground items-center gap-2">
                                                    <RadioGroupItem
                                                        id={`${loan_type}`}
                                                        key={i}
                                                        value={loan_type}
                                                    />
                                                    <Label
                                                        htmlFor={`${loan_type}`}
                                                    >
                                                        {loan_type}
                                                    </Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    )}
                                />
                                <FormFieldWrapper
                                    className="gap-y-2 col-span-3 flex flex-col"
                                    control={form.control}
                                    label="Collector"
                                    name="collector_place"
                                    render={({ field }) => (
                                        <RadioGroup
                                            className="grid grid-cols-1 gap-2"
                                            {...field}
                                            onValueChange={field.onChange}
                                            value={field.value ?? ''}
                                        >
                                            <div className="flex capitalize text-nowrap text-foreground/60 has-checked:text-foreground items-center gap-2">
                                                <RadioGroupItem
                                                    id="field"
                                                    value="field"
                                                />
                                                <Label htmlFor="field">
                                                    Field
                                                </Label>
                                            </div>
                                            <div className="flex capitalize text-nowrap text-foreground/60 has-checked:text-foreground items-center gap-2">
                                                <RadioGroupItem
                                                    id="office"
                                                    value="office"
                                                />
                                                <Label htmlFor="office">
                                                    Office
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    )}
                                />
                            </div>
                        </section>
                    </div>

                    <div className="space-y-4">
                        <section
                            className="rounded-lg bg-card border p-4 space-y-4"
                            title="Rates & Dates"
                        >
                            <div>
                                <h3 className="text-sm font-semibold text-primary">
                                    Rates & Dates
                                </h3>
                                <Separator />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {mode_of_payment === 'monthly' && (
                                    <FormFieldWrapper
                                        className="col-span-2"
                                        control={form.control}
                                        label="Payment Day"
                                        name="mode_of_payment_monthly_exact_day"
                                        render={({ field }) => (
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm">
                                                    By 30 Days
                                                </span>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                />
                                                <span className="text-sm">
                                                    By Exact Day
                                                </span>
                                            </div>
                                        )}
                                    />
                                )}

                                {mode_of_payment === 'weekly' && (
                                    <FormFieldWrapper
                                        control={form.control}
                                        label="Weekdays Payment"
                                        name="mode_of_payment_weekly"
                                        render={({ field }) => (
                                            <WeekdayCombobox {...field} />
                                        )}
                                    />
                                )}

                                <FormFieldWrapper
                                    className="w-fit"
                                    control={form.control}
                                    label="Interest Rate (%)"
                                    name="interest_rate"
                                    render={({ field }) => <Input {...field} />}
                                />
                                <FormFieldWrapper
                                    className="w-fit"
                                    control={form.control}
                                    label="Fines Rate (%)"
                                    name="fines_rate"
                                    render={({ field }) => <Input {...field} />}
                                />

                                <FormFieldWrapper
                                    className="w-fit"
                                    control={form.control}
                                    label="Date Rebated"
                                    name="date_rebated"
                                    render={({ field }) => (
                                        <InputDate
                                            {...field}
                                            className="block"
                                            placeholder="Date Rebated"
                                            value={field.value ?? ''}
                                        />
                                    )}
                                />
                                <FormFieldWrapper
                                    className="w-fit"
                                    control={form.control}
                                    label="Last Pay Date"
                                    name="last_pay_date"
                                    render={({ field }) => (
                                        <InputDate
                                            {...field}
                                            className="block"
                                            placeholder="Last Pay Date"
                                            value={field.value ?? ''}
                                        />
                                    )}
                                />

                                <FormFieldWrapper
                                    className="w-fit"
                                    control={form.control}
                                    label="Loan Count"
                                    name="count"
                                    render={({ field }) => <Input {...field} />}
                                />
                            </div>
                        </section>

                        <div className="space-y-4">
                            <section
                                className="rounded-lg bg-card border p-4 space-y-4"
                                title="Payment Information"
                            >
                                <div>
                                    <h3 className="text-sm font-semibold text-primary">
                                        Payment Information
                                    </h3>
                                    <Separator />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormFieldWrapper
                                        control={form.control}
                                        label="Orig Ticket"
                                        name="interest_rate"
                                        render={({ field }) => (
                                            <Input {...field} />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        label="First Pay Date"
                                        name="first_pay_date"
                                        render={({ field }) => (
                                            <InputDate
                                                {...field}
                                                className="block"
                                                placeholder="Date Rebated"
                                                value={field.value ?? ''}
                                            />
                                        )}
                                    />

                                    <FormFieldWrapper
                                        control={form.control}
                                        label="First Pay Amount"
                                        name="first_pay_amount"
                                        render={({
                                            field: { onChange, ...field },
                                        }) => (
                                            <CurrencyInput
                                                {...field}
                                                currency={
                                                    form.getValues('account')
                                                        ?.currency
                                                }
                                                onValueChange={(
                                                    newValue = ''
                                                ) => {
                                                    onChange(newValue)
                                                }}
                                                placeholder="first pay amount"
                                            />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        label="First IRR"
                                        name="first_irr"
                                        render={({ field }) => (
                                            <Input {...field} />
                                        )}
                                    />

                                    <FormFieldWrapper
                                        control={form.control}
                                        label="First DQ"
                                        name="first_irr"
                                        render={({ field }) => (
                                            <Input {...field} />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        label="Int. Prev. Paid"
                                        name="interest_previous_paid"
                                        render={({ field }) => (
                                            <Input {...field} />
                                        )}
                                    />

                                    <FormFieldWrapper
                                        className="col-span-2"
                                        control={form.control}
                                        label="Int. Prev. Paid"
                                        name="interest_previous_paid"
                                        render={({ field }) => (
                                            <Input {...field} />
                                        )}
                                    />
                                </div>
                            </section>
                        </div>
                    </div>

                    <div className="col-span-2">
                        <LoanComakerSection
                            form={form}
                            isDisabled={isDisabled}
                        />
                    </div>
                </fieldset>

                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty || isPending}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                    readOnly={formProps.readOnly}
                    submitText="Update"
                />
            </form>
        </Form>
    )
}

export const LoanEditFormModal = ({
    // title = 'Edit Loan',
    // description = 'Update loan transaction details.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<ILoanEditFormProps, 'className'>
}) => {
    return (
        <Modal {...props} className={cn('!max-w-7xl', className)}>
            <LoanEditForm
                {...formProps}
                onSuccess={(updated) => {
                    formProps.onSuccess?.(updated)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default LoanEditForm
