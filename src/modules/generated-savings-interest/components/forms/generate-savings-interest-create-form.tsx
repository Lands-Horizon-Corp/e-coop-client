import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { AccountPicker } from '@/modules/account'
import { IMemberType } from '@/modules/member-type'
import MemberTypeCombobox from '@/modules/member-type/components/member-type-combobox'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Checkbox } from '@/components/ui/checkbox'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm } from '@/types'

import { GENERATED_INTEREST_SAVINGS_COMPUTATION_TYPES } from '../../generated-savings-interest.constant'
import { useCreateGeneratedSavingsInterest } from '../../generated-savings-interest.service'
import { IGeneratedSavingsInterest } from '../../generated-savings-interest.types'
import { COMPUTATION_TYPE_LABELS } from '../../generated-savings-interest.utils'
import { GeneratedSavingsInterestSchema } from '../../generated-savings-interest.validation'

type TGeneratedSavingsInterestFormValues = z.infer<
    typeof GeneratedSavingsInterestSchema
>

export interface IGeneratedSavingsInterestFormProps
    extends IClassProps,
        IForm<
            Partial<TGeneratedSavingsInterestFormValues>,
            IGeneratedSavingsInterest,
            Error,
            TGeneratedSavingsInterestFormValues
        > {}

const GeneratedSavingsInterestCreateForm = ({
    className,
    ...formProps
}: IGeneratedSavingsInterestFormProps) => {
    const form = useForm<TGeneratedSavingsInterestFormValues>({
        resolver: standardSchemaResolver(GeneratedSavingsInterestSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            document_no: '',
            last_computation_date: '',
            new_computation_date: '',
            account_id: null,
            member_type_id: null,
            savings_computation_type: 'average_daily_balance',
            interest_tax_rate: 20,
            include_closed_account: false,
            include_existing_computed_interest: false,
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateGeneratedSavingsInterest({
        options: {
            onSuccess: (newData) => {
                formProps.onSuccess?.(newData)
                form.reset()
            },
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TGeneratedSavingsInterestFormValues>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((data) => {
        toast.promise(createMutation.mutateAsync(data), {
            loading: 'Generating savings interest...',
            success: 'Savings interest generated successfully',
            error: 'Failed to generate savings interest',
        })
    }, handleFocusError)

    const { error: rawError, isPending, reset } = createMutation

    const error = serverRequestErrExtractor({ error: rawError })

    return (
        <Form {...form}>
            <form
                className={cn('min-w-0 max-w-full flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="min-w-0 max-w-full space-y-4"
                    disabled={isPending || formProps.readOnly}
                >
                    {/* Document Number and Computation Dates */}
                    <div className="grid grid-cols-3 gap-4">
                        <FormFieldWrapper
                            control={form.control}
                            label="Doc. No:"
                            name="document_no"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                    placeholder="Auto-generated"
                                    type="text"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Last Comp. Date *"
                            name="last_computation_date"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    placeholder="MM/DD/YYYY"
                                    type="date"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="New Comp. Date *"
                            name="new_computation_date"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    placeholder="MM/DD/YYYY"
                                    type="date"
                                />
                            )}
                        />
                    </div>

                    {/* Accounts */}
                    <FormFieldWrapper
                        control={form.control}
                        label="Account"
                        name="account_id"
                        render={({ field }) => (
                            <AccountPicker
                                {...field}
                                mode="deposit"
                                onSelect={(account) => {
                                    field.onChange(account?.id || null)
                                    form.setValue('account', account, {
                                        shouldDirty: true,
                                    })
                                }}
                                placeholder="ALL"
                                value={form.getValues('account')}
                            />
                        )}
                    />

                    {/* Member Type */}
                    <FormFieldWrapper
                        control={form.control}
                        label="Member Type"
                        name="member_type_id"
                        render={({ field }) => (
                            <MemberTypeCombobox
                                {...field}
                                onChange={(
                                    selected: IMemberType | undefined
                                ) => {
                                    field.onChange(selected?.id || null)
                                    form.setValue('member_type', selected, {
                                        shouldDirty: true,
                                    })
                                }}
                                placeholder="All Member Types"
                                value={field.value as string | undefined}
                            />
                        )}
                    />

                    {/* Computation Type */}
                    <FormFieldWrapper
                        control={form.control}
                        label="Computation Type *"
                        name="savings_computation_type"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid rounded-xl bg-popover/20 grid-cols-2 p-3.5 gap-3"
                                disabled={isDisabled(field.name)}
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {GENERATED_INTEREST_SAVINGS_COMPUTATION_TYPES.map(
                                    (type) => (
                                        <div
                                            className="flex items-center space-x-2"
                                            key={type}
                                        >
                                            <RadioGroupItem
                                                id={type}
                                                value={type}
                                            />
                                            <Label
                                                className="cursor-pointer font-normal"
                                                htmlFor={type}
                                            >
                                                {COMPUTATION_TYPE_LABELS[type]}
                                            </Label>
                                        </div>
                                    )
                                )}
                            </RadioGroup>
                        )}
                    />

                    {/* Interest Tax Rate */}
                    <FormFieldWrapper
                        control={form.control}
                        label="Interest Tax Rate (%) *"
                        name="interest_tax_rate"
                        render={({ field }) => (
                            <Input
                                {...field}
                                disabled={isDisabled(field.name)}
                                max="100"
                                min="0"
                                onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                }
                                placeholder="20"
                                step="0.01"
                                type="number"
                            />
                        )}
                    />

                    {/* Checkboxes */}
                    <div className="space-y-3 bg-popover/20 p-2.5 rounded-xl">
                        <p className="font-medium text-sm mb-2">
                            Additional Options
                        </p>
                        <FormFieldWrapper
                            control={form.control}
                            name="include_closed_account"
                            render={({ field }) => (
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        checked={field.value}
                                        disabled={isDisabled(field.name)}
                                        id="include_closed_account"
                                        onCheckedChange={field.onChange}
                                    />
                                    <Label
                                        className="cursor-pointer w-full font-normal"
                                        htmlFor="include_closed_account"
                                    >
                                        Include Closed Account
                                    </Label>
                                </div>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="include_existing_computed_interest"
                            render={({ field }) => (
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        checked={field.value}
                                        disabled={isDisabled(field.name)}
                                        id="include_existing_computed_interest"
                                        onCheckedChange={field.onChange}
                                    />
                                    <Label
                                        className="cursor-pointer w-full font-normal"
                                        htmlFor="include_existing_computed_interest"
                                    >
                                        Include Existing Computed Interest
                                    </Label>
                                </div>
                            )}
                        />
                    </div>
                </fieldset>

                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                    readOnly={formProps.readOnly}
                    submitText="Process"
                />
            </form>
        </Form>
    )
}

export const GeneratedSavingsInterestCreateFormModal = ({
    title = 'Generate Savings Interest',
    description = 'Fill out the form to generate savings interest computation.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IGeneratedSavingsInterestFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('!max-w-2xl', className)}
            description={description}
            title={title}
            {...props}
        >
            <GeneratedSavingsInterestCreateForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default GeneratedSavingsInterestCreateForm
