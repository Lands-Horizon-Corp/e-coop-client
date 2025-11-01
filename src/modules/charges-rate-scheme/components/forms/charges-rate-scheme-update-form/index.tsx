import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { CurrencyCombobox } from '@/modules/currency'

import IconCombobox from '@/components/comboboxes/icon-combobox'
import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { InfoIcon, TIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import InfoTooltip from '@/components/tooltips/info-tooltip'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import { useUpdateChargesRateSchemeById } from '../../..'
import {
    IChargesRateScheme,
    IChargesRateSchemeRequest,
} from '../../../charges-rate-scheme.types'
import {
    ChargesRateSchemeSchema,
    TChargesRateSchemeSchema,
} from '../../../charges-rate-scheme.validation'
import ByRateOrAmountRange from './by-rate-amount-range-section'
import ByTermMopMemberTypeSection from './by-term-mop-member-type-section'
import ByTermSection from './by-term-section'
import ConnectAccountSection from './connect-account-section'

type TChargesRateSchemeFormValues = TChargesRateSchemeSchema

export interface IChargesRateSchemeFormProps
    extends IClassProps,
        IForm<
            Partial<IChargesRateSchemeRequest>,
            IChargesRateScheme,
            Error,
            TChargesRateSchemeFormValues
        > {
    chargesRateSchemeId: TEntityId
}

const ChargesRateSchemeUpdateForm = ({
    className,
    ...formProps
}: IChargesRateSchemeFormProps) => {
    const form = useForm<TChargesRateSchemeFormValues>({
        resolver: standardSchemaResolver(ChargesRateSchemeSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            description: '',
            charges_rate_scheme_accounts: [],
            ...formProps.defaultValues,
        },
    })

    const updateMutation = useUpdateChargesRateSchemeById({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Charges Rate Scheme updated',
                onSuccess: (data) => {
                    form.reset(data)
                    formProps.onSuccess?.(data)
                },
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TChargesRateSchemeFormValues>({
            form,
            autoSave: formProps.autoSave,
            readOnly: formProps.readOnly,
            hiddenFields: formProps.hiddenFields,
            disabledFields: formProps.disabledFields,
            defaultValues: formProps.defaultValues,
        })

    const onSubmit = form.handleSubmit((formData) => {
        updateMutation.mutate({
            id: formProps.chargesRateSchemeId,
            payload: formData,
        })
    }, handleFocusError)

    const { error: errorResponse, isPending, reset } = updateMutation

    const error = serverRequestErrExtractor({ error: errorResponse })

    return (
        <Form {...form}>
            <form
                className={cn(
                    'flex w-full min-w-0 flex-col gap-y-4',
                    className
                )}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="flex gap-x-6 gap-y-4 sm:gap-y-3 min-w-0 max-w-full"
                    disabled={isPending || formProps.readOnly}
                >
                    <fieldset className="space-y-3 flex-1 max-w-full min-w-0">
                        <div className="bg-card rounded-2xl p-4 space-y-3">
                            <div className="flex items-start gap-x-2">
                                <FormFieldWrapper
                                    className="w-fit"
                                    control={form.control}
                                    label="Icon"
                                    name="icon"
                                    render={({ field }) => (
                                        <IconCombobox
                                            {...field}
                                            disabled={isDisabled(field.name)}
                                            onChange={field.onChange}
                                            placeholder="Scheme Icon"
                                            value={field.value as TIcon}
                                        />
                                    )}
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    label="Charges Rate Scheme Name"
                                    name="name"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            autoComplete="off"
                                            disabled={isDisabled(field.name)}
                                            id={field.name}
                                            placeholder="Charges Rate Scheme Name"
                                        />
                                    )}
                                />
                                <ConnectAccountSection
                                    form={form}
                                    triggerClassName="w-[250px] mt-6"
                                />
                            </div>
                            <FormFieldWrapper
                                control={form.control}
                                label="Currency"
                                name="currency_id"
                                render={({ field }) => (
                                    <CurrencyCombobox
                                        {...field}
                                        className="w-fit"
                                        disabled={isDisabled(field.name)}
                                        onChange={(currency) =>
                                            field.onChange(currency.id)
                                        }
                                        placeholder="Description"
                                        value={field.value}
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
                                        autoComplete="off"
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        placeholder="Description"
                                    />
                                )}
                            />
                        </div>
                        <FormFieldWrapper
                            control={form.control}
                            label="Charges Rate Type"
                            name="type"
                            render={({ field }) => (
                                <RadioGroup
                                    className="gap-2 grid grid-cols-3 items-center bg-card p-2 rounded-3xl"
                                    defaultValue={field.value}
                                    disabled={isDisabled(field.name)}
                                    onValueChange={field.onChange}
                                >
                                    {/* By Range */}
                                    <InfoTooltip
                                        content={
                                            <div className="space-y-2 max-w-[300px] text-pretty flex gap-x-4 p-2 items-start text-xs">
                                                <span className="text-primary-foreground p-0.5 shrink-0 rounded-xl bg-primary">
                                                    <InfoIcon />
                                                </span>
                                                <p>
                                                    This charge scheme applies
                                                    rates (%) or fixed amounts
                                                    based on specific amount
                                                    ranges. The applicable
                                                    charge depends on which
                                                    range the transaction amount
                                                    falls into as defined in the
                                                    table below.
                                                </p>
                                            </div>
                                        }
                                        side="top"
                                    >
                                        <div className="relative flex w-full bg-card duration-300 items-start gap-2 rounded-2xl border border-input p-4 shadow-xs outline-none has-data-[state=checked]:border-primary has-data-[state=checked]:bg-gradient-to-r has-data-[state=checked]:from-primary/20 has-data-[state=checked]:to-transparent">
                                            <RadioGroupItem
                                                aria-describedby={`${field.name}-by_range-description`}
                                                className="order-1 after:absolute after:inset-0"
                                                id={`${field.name}-by-range`}
                                                value="by_range"
                                            />
                                            <div className="grid grow gap-2">
                                                <Label
                                                    htmlFor={`${field.name}-by_range`}
                                                >
                                                    By Range % or Amount Range
                                                </Label>
                                                <p
                                                    className="text-xs text-muted-foreground"
                                                    id={`${field.name}-by_range-description`}
                                                >
                                                    Charges are calculated based
                                                    on amount ranges with rates
                                                    or fixed amounts.
                                                </p>
                                            </div>
                                        </div>
                                    </InfoTooltip>
                                    {/* By Term */}
                                    <InfoTooltip
                                        content={
                                            <div className="space-y-2 max-w-[300px] text-pretty flex gap-x-4 p-2 items-start text-xs">
                                                <span className="text-primary-foreground p-0.5 shrink-0 rounded-xl bg-primary">
                                                    <InfoIcon />
                                                </span>
                                                <p>
                                                    This charge scheme applies
                                                    different rates or amounts
                                                    based on the transaction
                                                    term. Each term can have its
                                                    own specific charge
                                                    configuration.
                                                </p>
                                            </div>
                                        }
                                        side="top"
                                    >
                                        <div className="relative flex w-full duration-300 items-start gap-2 rounded-2xl border border-input p-4 shadow-xs outline-none has-data-[state=checked]:border-primary has-data-[state=checked]:bg-gradient-to-r has-data-[state=checked]:from-primary/20 has-data-[state=checked]:to-transparent h-full">
                                            <RadioGroupItem
                                                aria-describedby={`${field.name}-by_term-description`}
                                                className="order-1 after:absolute after:inset-0"
                                                id={`${field.name}-by_term`}
                                                value="by_term"
                                            />
                                            <div className="grid grow gap-2">
                                                <Label
                                                    htmlFor={`${field.name}-by_term`}
                                                >
                                                    By Term{' '}
                                                    <span className="text-xs leading-[inherit] font-normal text-muted-foreground">
                                                        (Term-based)
                                                    </span>
                                                </Label>
                                                <p
                                                    className="text-xs text-muted-foreground"
                                                    id={`${field.name}-by_term-description`}
                                                >
                                                    Charges are calculated based
                                                    on transaction term.
                                                </p>
                                            </div>
                                        </div>
                                    </InfoTooltip>
                                    {/* By Type / MOP / Member Type */}
                                    <InfoTooltip
                                        content={
                                            <div className="space-y-2 max-w-[300px] text-pretty flex gap-x-4 p-2 items-start text-xs">
                                                <span className="text-primary-foreground p-0.5 shrink-0 rounded-xl bg-primary">
                                                    <InfoIcon />
                                                </span>
                                                <p>
                                                    This charge scheme applies
                                                    rates or amounts based on a
                                                    combination of term period,
                                                    mode of payment (MOP), and
                                                    member type. Different
                                                    configurations can be set
                                                    for each combination.
                                                </p>
                                            </div>
                                        }
                                        side="top"
                                    >
                                        <div className="relative flex w-full duration-300 items-start gap-2 rounded-2xl border border-input p-4 shadow-xs outline-none has-data-[state=checked]:border-primary has-data-[state=checked]:bg-gradient-to-r has-data-[state=checked]:from-primary/20 has-data-[state=checked]:to-transparent">
                                            <RadioGroupItem
                                                aria-describedby={`${field.name}-by-type-mop-member-description`}
                                                className="order-1 after:absolute after:inset-0"
                                                id={`${field.name}-by-type-mop-member`}
                                                value="by_type"
                                            />
                                            <div className="grid grow gap-2">
                                                <Label
                                                    htmlFor={`${field.name}-by-type-mop-member`}
                                                >
                                                    By Type{' '}
                                                    <span className="text-muted-foreground/70">
                                                        /
                                                    </span>{' '}
                                                    MOP{' '}
                                                    <span className="text-muted-foreground/70">
                                                        /
                                                    </span>{' '}
                                                    Member type
                                                </Label>
                                                <p
                                                    className="text-xs text-muted-foreground"
                                                    id={`${field.name}-by-type-mop-member-description`}
                                                >
                                                    Charges are calculated based
                                                    on term period, mode of
                                                    payment, and member type.
                                                </p>
                                            </div>
                                        </div>
                                    </InfoTooltip>
                                </RadioGroup>
                            )}
                        />

                        <div className="min-w-0 max-w-full">
                            {form.watch('type') === 'by_range' && (
                                <ByRateOrAmountRange form={form} />
                            )}
                            {form.watch('type') === 'by_term' && (
                                <ByTermSection form={form} />
                            )}
                            {form.watch('type') === 'by_type' && (
                                <ByTermMopMemberTypeSection form={form} />
                            )}
                        </div>
                    </fieldset>
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

//

// MODAL VERSION
export const ChargesRateSchemeCreateUpdateFormModal = ({
    title = 'Create Charges Rate Scheme',
    description = 'Fill out the form to add a new charges rate scheme.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<IChargesRateSchemeFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('max-w-[80vw] min-w-[80vw]', className)}
            description={description}
            title={title}
            {...props}
        >
            <ChargesRateSchemeUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default ChargesRateSchemeUpdateForm
