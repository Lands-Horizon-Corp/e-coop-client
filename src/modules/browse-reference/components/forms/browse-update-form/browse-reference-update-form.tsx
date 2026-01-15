import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { AccountPicker } from '@/modules/account'
import { useUpdateBrowseReferenceById } from '@/modules/browse-reference/browse-reference.service'
import { IBrowseReference } from '@/modules/browse-reference/browse-reference.types'
import { BrowseReferenceSchema } from '@/modules/browse-reference/browse-reference.validation'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { InfoIcon, SettingsIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import InfoTooltip from '@/components/tooltips/info-tooltip'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import ByAmountFormSection from './by-amount-form-section'
import ByDateFormSection from './by-date-form-section'
import ByYearFormSection from './by-year-form-section'

type TBrowseReferenceFormValues = z.infer<typeof BrowseReferenceSchema>

export interface IBrowseReferenceFormProps
    extends IClassProps,
        IForm<
            Partial<TBrowseReferenceFormValues>,
            IBrowseReference,
            Error,
            TBrowseReferenceFormValues
        > {
    memberTypeReferenceId: TEntityId
}

const BrowseReferenceUpdateForm = ({
    className,
    memberTypeReferenceId,
    ...formProps
}: IBrowseReferenceFormProps) => {
    const form = useForm<TBrowseReferenceFormValues>({
        resolver: standardSchemaResolver(BrowseReferenceSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            description: '',
            account_id: '',
            interest_type: 'none',
            interest_rate: 0,
            charges: 0,
            minimum_balance: 0,
            other_interest_on_saving_computation_minimum_balance: 0,
            other_interest_on_saving_computation_interest_rate: 0,
            ...formProps.defaultValues,
        },
    })

    const updateMutation = useUpdateBrowseReferenceById({
        options: {
            onSuccess: (newData) => {
                formProps.onSuccess?.(newData)
                form.reset(newData)
            },
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError } =
        useFormHelper<TBrowseReferenceFormValues>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((data) => {
        toast.promise(
            updateMutation.mutateAsync({
                id: memberTypeReferenceId,
                payload: data,
            }),
            {
                loading: 'Updating member type reference...',
                success: 'Member type reference updated successfully',
                error: 'Failed to update member type reference',
            }
        )
    }, handleFocusError)

    const { error: rawError, isPending, reset } = updateMutation

    const error = serverRequestErrExtractor({ error: rawError })
    const type = form.watch('interest_type')

    return (
        <Form {...form}>
            <form
                className={cn('min-w-0 max-w-full flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="min-w-0 max-w-full space-y-3"
                    disabled={isPending || formProps.readOnly}
                >
                    <div className="grid grid-cols-2 gap-2">
                        <FormFieldWrapper
                            control={form.control}
                            label="Name *"
                            name="name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    // disabled={isDisabled(field.name)}
                                    placeholder="Name"
                                    type="text"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Account *"
                            name="account_id"
                            render={({ field }) => (
                                <AccountPicker
                                    {...field}
                                    mode="all"
                                    nameOnly
                                    onSelect={(account) => {
                                        field.onChange(account.id)
                                        form.setValue('account', account, {
                                            shouldDirty: true,
                                        })
                                    }}
                                    value={form.getValues('account')}
                                />
                            )}
                        />
                    </div>

                    <div className="space-y-0 grid min-w-0 gap-2 grid-cols-3">
                        <FormFieldWrapper
                            control={form.control}
                            label="Minimum Balance *"
                            name="minimum_balance"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    // disabled={isDisabled(field.name)}
                                    placeholder="Minimum Balance"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Interest *"
                            name="interest_rate"
                            render={({ field }) => (
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        // disabled={isDisabled(field.name)}
                                        onChange={(e) => {
                                            field.onChange(e.target.value)
                                            form.setValue(
                                                'charges',
                                                '' as unknown as number
                                            )
                                        }}
                                        placeholder="0.00"
                                        value={field.value}
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupText>%</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Charges *"
                            name="charges"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    // disabled={isDisabled(field.name)}
                                    onChange={(e) => {
                                        field.onChange(e)
                                        form.setValue(
                                            'interest_rate',
                                            '' as unknown as number
                                        )
                                    }}
                                    placeholder="Charges"
                                />
                            )}
                        />

                        {/* <FormFieldWrapper
                            control={form.control}
                            label="Maintaining Balance *"
                            name="maintaining_balance"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    placeholder="Maintaining Balance"
                                />
                            )}
                        /> */}
                    </div>
                    <FormFieldWrapper
                        control={form.control}
                        label="Interest Computation Type"
                        name="interest_type"
                        render={({ field }) => (
                            <RadioGroup
                                className="gap-2 grid grid-cols-4 items-stretch bg-card p-2 rounded-3xl"
                                defaultValue={field.value}
                                // disabled={isDisabled(field.name)}
                                onValueChange={field.onChange}
                            >
                                <InfoTooltip
                                    content={
                                        <div className="space-y-2 max-w-[300px] text-pretty flex gap-x-4 p-2 items-start text-xs">
                                            <span className="text-primary-foreground p-0.5 shrink-0 rounded-xl bg-primary">
                                                <InfoIcon />
                                            </span>
                                            <p>
                                                No interest computation scheme
                                                applied. Interest will be
                                                calculated using default
                                                settings or manually configured
                                                rates.
                                            </p>
                                        </div>
                                    }
                                    side="top"
                                >
                                    <div className="relative flex w-full h-full bg-card duration-300 items-start gap-2 rounded-2xl border border-input p-4 shadow-xs outline-none has-data-[state=checked]:border-primary has-data-[state=checked]:bg-gradient-to-r has-data-[state=checked]:from-primary/20 has-data-[state=checked]:to-transparent">
                                        <RadioGroupItem
                                            aria-describedby={`${field.name}-none-description`}
                                            className="order-1 after:absolute after:inset-0"
                                            id={`${field.name}-none`}
                                            value="none"
                                        />
                                        <div className="grid grow gap-2">
                                            <Label
                                                htmlFor={`${field.name}-none`}
                                            >
                                                None
                                            </Label>
                                        </div>
                                    </div>
                                </InfoTooltip>

                                <InfoTooltip
                                    content={
                                        <div className="space-y-2 max-w-[300px] text-pretty flex gap-x-4 p-2 items-start text-xs">
                                            <span className="text-primary-foreground p-0.5 shrink-0 rounded-xl bg-primary">
                                                <InfoIcon />
                                            </span>
                                            <p>
                                                Interest is calculated based on
                                                the year of membership or
                                                account opening. Different years
                                                can have different interest
                                                rates.
                                            </p>
                                        </div>
                                    }
                                    side="top"
                                >
                                    <div className="relative flex w-full h-full duration-300 items-start gap-2 rounded-2xl border border-input p-4 shadow-xs outline-none has-data-[state=checked]:border-primary has-data-[state=checked]:bg-gradient-to-r has-data-[state=checked]:from-primary/20 has-data-[state=checked]:to-transparent">
                                        <RadioGroupItem
                                            aria-describedby={`${field.name}-by_year-description`}
                                            className="order-1 after:absolute after:inset-0"
                                            id={`${field.name}-by_year`}
                                            value="year"
                                        />
                                        <div className="grid grow gap-2">
                                            <Label
                                                htmlFor={`${field.name}-by_year`}
                                            >
                                                By Year
                                            </Label>
                                        </div>
                                    </div>
                                </InfoTooltip>

                                <InfoTooltip
                                    content={
                                        <div className="space-y-2 max-w-[300px] text-pretty flex gap-x-4 p-2 items-start text-xs">
                                            <span className="text-primary-foreground p-0.5 shrink-0 rounded-xl bg-primary">
                                                <InfoIcon />
                                            </span>
                                            <p>
                                                Interest is calculated based on
                                                the date of membership or.
                                                Different date ranges can have
                                                different interest rates.
                                            </p>
                                        </div>
                                    }
                                    side="top"
                                >
                                    <div className="relative flex w-full h-full duration-300 items-start gap-2 rounded-2xl border border-input p-4 shadow-xs outline-none has-data-[state=checked]:border-primary has-data-[state=checked]:bg-gradient-to-r has-data-[state=checked]:from-primary/20 has-data-[state=checked]:to-transparent">
                                        <RadioGroupItem
                                            aria-describedby={`${field.name}-date-description`}
                                            className="order-1 after:absolute after:inset-0"
                                            id={`${field.name}-date`}
                                            value="date"
                                        />
                                        <div className="grid grow gap-2">
                                            <Label
                                                htmlFor={`${field.name}-date`}
                                            >
                                                By Date
                                            </Label>
                                        </div>
                                    </div>
                                </InfoTooltip>

                                <InfoTooltip
                                    content={
                                        <div className="space-y-2 max-w-[300px] text-pretty flex gap-x-4 p-2 items-start text-xs">
                                            <span className="text-primary-foreground p-0.5 shrink-0 rounded-xl bg-primary">
                                                <InfoIcon />
                                            </span>
                                            <p>
                                                Interest is calculated based on
                                                the balance amount ranges.
                                                Different amount brackets can
                                                have different interest rates.
                                            </p>
                                        </div>
                                    }
                                    side="top"
                                >
                                    <div className="relative flex w-full h-full duration-300 items-start gap-2 rounded-2xl border border-input p-4 shadow-xs outline-none has-data-[state=checked]:border-primary has-data-[state=checked]:bg-gradient-to-r has-data-[state=checked]:from-primary/20 has-data-[state=checked]:to-transparent">
                                        <RadioGroupItem
                                            aria-describedby={`${field.name}-by_amount-description`}
                                            className="order-1 after:absolute after:inset-0"
                                            id={`${field.name}-by_amount`}
                                            value="amount"
                                        />
                                        <div className="grid grow gap-2">
                                            <Label
                                                htmlFor={`${field.name}-by_amount`}
                                            >
                                                By Amount
                                            </Label>
                                        </div>
                                    </div>
                                </InfoTooltip>
                            </RadioGroup>
                        )}
                    />

                    {type !== 'none' && (
                        <>
                            {type === 'year' && (
                                <ByYearFormSection
                                    form={form}
                                    // isDisabled={isDisabled}
                                />
                            )}
                            {type === 'date' && (
                                <ByDateFormSection
                                    form={form}
                                    // isDisabled={isDisabled}
                                />
                            )}
                            {type === 'amount' && (
                                <ByAmountFormSection
                                    form={form}
                                    // isDisabled={isDisabled}
                                />
                            )}
                        </>
                    )}

                    <Accordion collapsible type="single">
                        <AccordionItem
                            className="!p-0"
                            value="member-type-reference-other-config"
                        >
                            <AccordionTrigger className="px-0 hover:no-underline">
                                <div className="flex items-center text-primary gap-2">
                                    <SettingsIcon className="size-4" />
                                    <span>Other</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-0 space-y-4">
                                <FormFieldWrapper
                                    control={form.control}
                                    label="Description *"
                                    name="description"
                                    render={({ field }) => (
                                        <Textarea
                                            {...field}
                                            autoComplete="off"
                                            // disabled={isDisabled(field.name)}
                                            placeholder="Description"
                                        />
                                    )}
                                />
                                <fieldset className="space-y-4 grid grid-cols-2 gap-2">
                                    <FormFieldWrapper
                                        control={form.control}
                                        label="Other interest on saving computation minimum balance *"
                                        name="other_interest_on_saving_computation_minimum_balance"
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                // disabled={isDisabled(
                                                // field.name
                                                // )}
                                                placeholder="Minimum Balance"
                                            />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        label="Other interest on saving computation interest rate *"
                                        name="other_interest_on_saving_computation_interest_rate"
                                        render={({ field }) => (
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    // disabled={isDisabled(
                                                    // field.name
                                                    // )}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="0.00"
                                                    value={field.value}
                                                />
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupText>
                                                        %
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        )}
                                    />
                                </fieldset>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
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

export const BrowseReferenceUpdateFormModal = ({
    title = 'Update Member Type Reference',
    description = 'Fill out the form to update the reference.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<IBrowseReferenceFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('!max-w-xl', className)}
            description={description}
            title={title}
            {...props}
        >
            <BrowseReferenceUpdateForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default BrowseReferenceUpdateForm
