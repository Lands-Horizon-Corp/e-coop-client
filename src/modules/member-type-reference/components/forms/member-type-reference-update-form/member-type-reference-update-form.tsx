import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { AccountPicker } from '@/modules/account'
import { useUpdateMemberTypeReferenceById } from '@/modules/member-type-reference/member-type-reference.service'
import { IMemberTypeReference } from '@/modules/member-type-reference/member-type-reference.types'
import { MemberTypeReferenceSchema } from '@/modules/member-type-reference/member-type-reference.validation'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { InfoIcon, SettingsIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import InfoTooltip from '@/components/tooltips/info-tooltip'
import { Label } from '@/components/ui/label'

type TMemberTypeReferenceFormValues = z.infer<typeof MemberTypeReferenceSchema>

export interface IMemberTypeReferenceFormProps
    extends IClassProps,
        IForm<
            Partial<TMemberTypeReferenceFormValues>,
            IMemberTypeReference,
            Error,
            TMemberTypeReferenceFormValues
        > {
    memberTypeReferenceId: TEntityId
}

const MemberTypeReferenceUpdateForm = ({
    className,
    memberTypeReferenceId,
    ...formProps
}: IMemberTypeReferenceFormProps) => {
    const form = useForm<TMemberTypeReferenceFormValues>({
        resolver: standardSchemaResolver(MemberTypeReferenceSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            description: '',
            account_id: '',
            interest_rate: 0,
            charges: 0,
            minimum_balance: 0,
            maintaining_balance: 0,
            other_interest_on_saving_computation_minimum_balance: 0,
            other_interest_on_saving_computation_interest_rate: 0,
            ...formProps.defaultValues,
        },
    })

    const updateMutation = useUpdateMemberTypeReferenceById({
        options: { onSuccess: formProps.onSuccess, onError: formProps.onError },
    })

    const { formRef, firstError, handleFocusError, isDisabled } =
        useFormHelper<TMemberTypeReferenceFormValues>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((data) => {
        updateMutation.mutate({
            id: memberTypeReferenceId,
            payload: data,
        })
    }, handleFocusError)

    const { error: rawError, isPending, reset } = updateMutation

    const error = serverRequestErrExtractor({ error: rawError }) || firstError

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
                    <FormFieldWrapper
                        control={form.control}
                        label="Name *"
                        name="name"
                        render={({ field }) => (
                            <Input
                                {...field}
                                disabled={isDisabled(field.name)}
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

                    <fieldset className="space-y-0 grid min-w-0 gap-2 grid-cols-2">
                        <FormFieldWrapper
                            className="col-span-2 "
                            control={form.control}
                            label="Minimum Balance *"
                            name="minimum_balance"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    placeholder="Minimum Balance"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Interest *"
                            name="interest_rate"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    onChange={(e) => {
                                        field.onChange(e)
                                        form.setValue('charges', undefined)
                                    }}
                                    placeholder="Interest Rate (%)"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Charges *"
                            name="charges"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    onChange={(e) => {
                                        field.onChange(e)
                                        form.setValue(
                                            'interest_rate',
                                            undefined
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
                    </fieldset>

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
                                            disabled={isDisabled(field.name)}
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
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                                placeholder="Minimum Balance"
                                            />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        label="Other interest on saving computation interest rate *"
                                        name="other_interest_on_saving_computation_interest_rate"
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                                placeholder="Interest Rate"
                                            />
                                        )}
                                    />
                                </fieldset>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <FormFieldWrapper
                        control={form.control}
                        label="Type of Scheme"
                        name="type"
                        render={({ field }) => (
                            <RadioGroup
                                className="gap-2 grid grid-cols-4 items-stretch bg-card p-2 rounded-3xl"
                                defaultValue={field.value}
                                disabled={isDisabled(field.name)}
                                onValueChange={field.onChange}
                            >
                                {/* None */}
                                <InfoTooltip
                                    content={
                                        <div className="space-y-2 max-w-[300px] text-pretty flex gap-x-4 p-2 items-start text-xs">
                                            <span className="text-primary-foreground p-0.5 shrink-0 rounded-xl bg-primary">
                                                <InfoIcon />
                                            </span>
                                            <p>
                                                No interest computation scheme
                                                applied. Interest will be
                                                calculated using default settings
                                                or manually configured rates.
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
                                            <Label htmlFor={`${field.name}-none`}>
                                                None
                                            </Label>
                                            <p
                                                className="text-xs text-muted-foreground"
                                                id={`${field.name}-none-description`}
                                            >
                                                No specific computation scheme
                                            </p>
                                        </div>
                                    </div>
                                </InfoTooltip>

                                {/* By Year */}
                                <InfoTooltip
                                    content={
                                        <div className="space-y-2 max-w-[300px] text-pretty flex gap-x-4 p-2 items-start text-xs">
                                            <span className="text-primary-foreground p-0.5 shrink-0 rounded-xl bg-primary">
                                                <InfoIcon />
                                            </span>
                                            <p>
                                                Interest is calculated based on the
                                                year of membership or account
                                                opening. Different years can have
                                                different interest rates.
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
                                            value="by_year"
                                        />
                                        <div className="grid grow gap-2">
                                            <Label htmlFor={`${field.name}-by_year`}>
                                                By Year
                                            </Label>
                                            <p
                                                className="text-xs text-muted-foreground"
                                                id={`${field.name}-by_year-description`}
                                            >
                                                Interest computed based on year
                                            </p>
                                        </div>
                                    </div>
                                </InfoTooltip>

                                {/* By Month */}
                                <InfoTooltip
                                    content={
                                        <div className="space-y-2 max-w-[300px] text-pretty flex gap-x-4 p-2 items-start text-xs">
                                            <span className="text-primary-foreground p-0.5 shrink-0 rounded-xl bg-primary">
                                                <InfoIcon />
                                            </span>
                                            <p>
                                                Interest is calculated based on the
                                                month of membership or account
                                                activity. Different months can
                                                have different interest rates.
                                            </p>
                                        </div>
                                    }
                                    side="top"
                                >
                                    <div className="relative flex w-full h-full duration-300 items-start gap-2 rounded-2xl border border-input p-4 shadow-xs outline-none has-data-[state=checked]:border-primary has-data-[state=checked]:bg-gradient-to-r has-data-[state=checked]:from-primary/20 has-data-[state=checked]:to-transparent">
                                        <RadioGroupItem
                                            aria-describedby={`${field.name}-by_month-description`}
                                            className="order-1 after:absolute after:inset-0"
                                            id={`${field.name}-by_month`}
                                            value="by_month"
                                        />
                                        <div className="grid grow gap-2">
                                            <Label htmlFor={`${field.name}-by_month`}>
                                                By Month
                                            </Label>
                                            <p
                                                className="text-xs text-muted-foreground"
                                                id={`${field.name}-by_month-description`}
                                            >
                                                Interest computed based on month
                                            </p>
                                        </div>
                                    </div>
                                </InfoTooltip>

                                {/* By Amount */}
                                <InfoTooltip
                                    content={
                                        <div className="space-y-2 max-w-[300px] text-pretty flex gap-x-4 p-2 items-start text-xs">
                                            <span className="text-primary-foreground p-0.5 shrink-0 rounded-xl bg-primary">
                                                <InfoIcon />
                                            </span>
                                            <p>
                                                Interest is calculated based on the
                                                balance amount ranges. Different
                                                amount brackets can have
                                                different interest rates.
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
                                            value="by_amount"
                                        />
                                        <div className="grid grow gap-2">
                                            <Label htmlFor={`${field.name}-by_amount`}>
                                                By Amount
                                            </Label>
                                            <p
                                                className="text-xs text-muted-foreground"
                                                id={`${field.name}-by_amount-description`}
                                            >
                                                Interest computed based on balance
                                                amount
                                            </p>
                                        </div>
                                    </div>
                                </InfoTooltip>
                            </RadioGroup>
                        )}
                    />
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
                    submitText="Update"
                />
            </form>
        </Form>
    )
}

export const MemberTypeReferenceUpdateFormModal = ({
    title = 'Update Member Type Reference',
    description = 'Fill out the form to update the reference.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<IMemberTypeReferenceFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('!max-w-xl', className)}
            description={description}
            title={title}
            {...props}
        >
            <MemberTypeReferenceUpdateForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default MemberTypeReferenceUpdateForm
