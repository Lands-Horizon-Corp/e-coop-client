import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { formatNumber } from '@/helpers'
import { toInputDateString } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { AccountPicker } from '@/modules/account'
import GeneratedSavingsInterestEntriesView from '@/modules/generated-savings-interest-entry/components/tables/generated-savings-interest-entries-view'
import { IMemberType } from '@/modules/member-type'
import MemberTypeCombobox from '@/modules/member-type/components/member-type-combobox'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import { GENERATED_INTEREST_SAVINGS_COMPUTATION_TYPES } from '../../generated-savings-interest.constant'
import {
    useCreateGeneratedSavingsInterest,
    useGenerateSavingsInterestProcessView,
    useUpdateGeneratedSavingsInterestById,
} from '../../generated-savings-interest.service'
import { IGeneratedSavingsInterest } from '../../generated-savings-interest.types'
import { COMPUTATION_TYPE_LABELS } from '../../generated-savings-interest.utils'
import {
    GeneratedSavingsInterestSchema,
    GeneratedSavingsInterestViewSchema,
} from '../../generated-savings-interest.validation'

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
        > {
    generatedSavingsInterestId?: TEntityId
}

const GeneratedSavingsInterestCreateForm = ({
    className,
    generatedSavingsInterestId,
    ...formProps
}: IGeneratedSavingsInterestFormProps) => {
    const form = useForm<TGeneratedSavingsInterestFormValues>({
        resolver: standardSchemaResolver(GeneratedSavingsInterestSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            document_no: '',
            last_computation_date: '',
            account_id: null,
            member_type_id: null,
            savings_computation_type: 'average_daily_balance',
            interest_tax_rate: 0,
            include_closed_account: false,
            include_existing_computed_interest: false,
            entries: [],
            ...formProps.defaultValues,
            new_computation_date: toInputDateString(
                formProps.defaultValues?.new_computation_date || new Date()
            ),
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

    const updateMutation = useUpdateGeneratedSavingsInterestById({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const generateMutation = useGenerateSavingsInterestProcessView({
        options: {
            onSuccess: (data) => {
                form.setValue('entries', data.entries || [])
                form.setValue('is_viewing_entries', true)
                form.setValue('total_interest', data.total_interest || 0)
                form.setValue('total_tax', data.total_tax || 0)
                toast.success('Interest entries generated successfully')
                form.trigger()
            },
            onError: (error) => {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(
                    errorMessage || 'Failed to generate interest entries'
                )
            },
        },
    })

    const { formRef, handleFocusError } =
        useFormHelper<TGeneratedSavingsInterestFormValues>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((data) => {
        const mutationPromise = generatedSavingsInterestId
            ? updateMutation.mutateAsync({
                  id: generatedSavingsInterestId,
                  payload: data,
              })
            : createMutation.mutateAsync(data)

        toast.promise(mutationPromise, {
            loading: generatedSavingsInterestId
                ? 'Updating savings interest...'
                : 'Generating savings interest...',
            success: generatedSavingsInterestId
                ? 'Savings interest updated successfully'
                : 'Savings interest generated successfully',
            error: generatedSavingsInterestId
                ? 'Failed to update savings interest'
                : 'Failed to generate savings interest',
        })
    }, handleFocusError)

    const onProcess = async () => {
        const formData = form.getValues()
        form.trigger()
        generateMutation.reset()

        const result = GeneratedSavingsInterestViewSchema.safeParse(formData)

        if (!result.success) {
            toast.error(`Validation failed, please check the form fields.`)

            handleFocusError()
            return
        }

        toast.promise(generateMutation.mutateAsync(result.data), {
            loading: 'Generating interest entries...',
        })
    }

    const {
        error: rawError,
        isPending,
        reset,
    } = generatedSavingsInterestId ? updateMutation : createMutation

    const error = serverRequestErrExtractor({
        error: rawError || generateMutation.error,
    })

    return (
        <Form {...form}>
            <form
                className={cn(
                    'min-w-0 max-w-full flex flex-col gap-y-4',
                    className
                )}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="min-w-0 max-w-full space-y-4"
                    disabled={isPending || formProps.readOnly}
                >
                    <FormFieldWrapper
                        control={form.control}
                        label="Doc. No:"
                        name="document_no"
                        render={({ field }) => (
                            <Input
                                {...field}
                                autoComplete="off"
                                // disabled={isDisabled(field.name)}
                                placeholder="Auto-generated"
                                type="text"
                            />
                        )}
                    />
                    {/* Document Number and Computation Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <FormFieldWrapper
                            control={form.control}
                            label={
                                <>
                                    <p>Last Computation Date *</p>
                                    <p>mm/dd/yyyy</p>
                                </>
                            }
                            labelClassName="w-full flex justify-between"
                            name="last_computation_date"
                            render={({ field }) => (
                                <InputDate
                                    {...field}
                                    className="block"
                                    // disabled={isDisabled(field.name)}
                                    placeholder="Entry Date"
                                    value={field.value ?? ''}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label={
                                <>
                                    <p>Last Computation Date *</p>
                                    <p>mm/dd/yyyy</p>
                                </>
                            }
                            labelClassName="w-full flex justify-between"
                            name="new_computation_date"
                            render={({ field }) => (
                                <InputDate
                                    {...field}
                                    className="block"
                                    // disabled={isDisabled(field.name)}
                                    placeholder="Entry Date"
                                    value={field.value ?? ''}
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
                                // disabled={isDisabled(field.name)}
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
                                // disabled={isDisabled(field.name)}
                                onChange={(e) => field.onChange(e.target.value)}
                                placeholder="20"
                                step="0.01"
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
                                        // disabled={isDisabled(field.name)}
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
                                        // disabled={isDisabled(field.name)}
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
                    <EntriesSection
                        form={form}
                        isDisabledSection={!!generatedSavingsInterestId}
                        isProcessing={generateMutation.isPending}
                        onProcess={onProcess}
                    />
                    <EntriesModalSection form={form} />
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
                    submitText={generatedSavingsInterestId ? 'Update' : 'Save'}
                />
            </form>
        </Form>
    )
}

const EntriesSection = ({
    form,
    isProcessing,
    isDisabledSection = false,
    onProcess,
}: {
    isDisabledSection?: boolean
    form: ReturnType<typeof useForm<TGeneratedSavingsInterestFormValues>>
    isProcessing: boolean
    onProcess: () => void
}) => {
    const entries = form.watch('entries') || []
    const hasEntries = entries.length > 0

    return (
        <FormFieldWrapper
            control={form.control}
            name="entries"
            render={({ field }) => (
                <div
                    {...field}
                    className={cn(
                        'rounded-xl p-4 space-y-2',
                        'border-2 transition-all duration-500 ease-in-out',
                        hasEntries
                            ? 'bg-gradient-to-br from-primary/15 via-accent/10 to-primary/5 border-primary/30 shadow-sm'
                            : 'bg-popover/20 border-transparent'
                    )}
                >
                    <div className=" flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <p className="text-sm font-medium">
                                Generated Entries
                            </p>
                            <span
                                className={cn(
                                    'px-1.5 py-0.5 rounded-md font-semibold text-xs',
                                    'transition-all duration-300 ease-in-out',
                                    hasEntries
                                        ? 'bg-primary text-primary-foreground shadow-sm scale-105'
                                        : 'bg-muted text-muted-foreground'
                                )}
                            >
                                {formatNumber(entries.length)}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            {hasEntries && (
                                <Button
                                    className="transition-all duration-300 ease-in-out animate-in fade-in slide-in-from-right-2"
                                    onClick={() =>
                                        form.setValue(
                                            'is_viewing_entries',
                                            true
                                        )
                                    }
                                    size="xs"
                                    type="button"
                                    variant="outline"
                                >
                                    View Entries
                                </Button>
                            )}
                            <Button
                                className="transition-all duration-300 ease-in-out"
                                disabled={isProcessing || isDisabledSection}
                                onClick={onProcess}
                                size="xs"
                                type="button"
                                variant={hasEntries ? 'secondary' : 'default'}
                            >
                                {isProcessing
                                    ? 'Processing...'
                                    : 'Generate / Process'}
                            </Button>
                        </div>
                    </div>
                    {hasEntries && (
                        <p className="text-xs font-medium text-muted-foreground">
                            You now generated an entr
                            {entries.length > 1 ? 'ies' : 'y'}. You can change
                            config and reprocess to get another result or you
                            can save it
                        </p>
                    )}
                </div>
            )}
        />
    )
}

const EntriesModalSection = ({
    form,
}: {
    form: ReturnType<typeof useForm<TGeneratedSavingsInterestFormValues>>
}) => {
    const entries = form.watch('entries') || []
    const isViewingEntries = form.watch('is_viewing_entries') || false

    return (
        <Modal
            className="!max-w-7xl"
            description={`Showing ${formatNumber(entries.length)} generated entries. Review the computed interest amounts below.`}
            onOpenChange={(open) => {
                form.setValue('is_viewing_entries', open)
            }}
            open={isViewingEntries}
            title="Generated Savings Interest Entries"
        >
            <GeneratedSavingsInterestEntriesView
                className="h-[70vh] text-sm"
                entries={entries}
                total_interest={form.getValues('total_interest')}
                total_tax={form.getValues('total_tax')}
            />
        </Modal>
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
