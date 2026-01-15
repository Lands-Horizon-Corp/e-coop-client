import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { AccountPicker } from '@/modules/account'
import { CurrencyInput } from '@/modules/currency'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { SettingsIcon } from '@/components/icons'
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

import {
    useCreateBrowseReference,
    useUpdateBrowseReferenceById,
} from '../../browse-reference.service'
import { IBrowseReference } from '../../browse-reference.types'
import { BrowseReferenceSchema } from '../../browse-reference.validation'

type TBrowseReferenceFormValues = z.infer<typeof BrowseReferenceSchema>

export interface IBrowseReferenceFormProps
    extends IClassProps,
        IForm<
            Partial<TBrowseReferenceFormValues>,
            IBrowseReference,
            Error,
            TBrowseReferenceFormValues
        > {
    memberTypeReferenceId?: TEntityId
}

const BrowseReferenceCreateUpdateForm = ({
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
            interest_rate: 0,
            interest_type: 'none',
            charges: 0,
            minimum_balance: 0,
            other_interest_on_saving_computation_minimum_balance: 0,
            other_interest_on_saving_computation_interest_rate: 0,
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateBrowseReference({
        options: { onSuccess: formProps.onSuccess, onError: formProps.onError },
    })
    const updateMutation = useUpdateBrowseReferenceById({
        options: { onSuccess: formProps.onSuccess, onError: formProps.onError },
    })

    const { formRef, firstError, handleFocusError, isDisabled } =
        useFormHelper<TBrowseReferenceFormValues>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((data) => {
        if (memberTypeReferenceId) {
            updateMutation.mutate({
                id: memberTypeReferenceId,
                payload: data,
            })
        } else {
            createMutation.mutate(data)
        }
    }, handleFocusError)

    const {
        error: rawError,
        isPending,
        reset,
    } = memberTypeReferenceId ? updateMutation : createMutation

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
                                nameOnly
                                onSelect={(account) => {
                                    field.onChange(account.id)
                                    form.setValue('name', account?.name)
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
                            render={({ field: { onChange, ...field } }) => (
                                <CurrencyInput
                                    {...field}
                                    currency={form.watch('account')?.currency}
                                    onValueChange={(newValue = '') => {
                                        onChange(newValue)
                                    }}
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
                            render={({ field: { onChange, ...field } }) => (
                                <CurrencyInput
                                    {...field}
                                    currency={form.watch('account')?.currency}
                                    onValueChange={(newValue = '') => {
                                        form.setValue(
                                            'interest_rate',
                                            undefined
                                        )
                                        onChange(newValue)
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
                                        render={({
                                            field: { onChange, ...field },
                                        }) => (
                                            <CurrencyInput
                                                {...field}
                                                onValueChange={(
                                                    newValue = ''
                                                ) => {
                                                    onChange(newValue)
                                                }}
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
                    submitText={memberTypeReferenceId ? 'Update' : 'Create'}
                />
            </form>
        </Form>
    )
}

export const BrowseReferenceCreateUpdateFormModal = ({
    title = 'Create Member Type Reference',
    description = 'Fill out the form to add or update a reference.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IBrowseReferenceFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('!max-w-xl', className)}
            description={description}
            title={title}
            {...props}
        >
            <BrowseReferenceCreateUpdateForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default BrowseReferenceCreateUpdateForm
