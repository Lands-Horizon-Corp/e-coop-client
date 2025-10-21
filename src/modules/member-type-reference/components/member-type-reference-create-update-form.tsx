import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { AccountPicker } from '@/modules/account'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import { useCreate, useUpdateById } from '../member-type-reference.service'
import { IMemberTypeReference } from '../member-type-reference.types'
import { MemberTypeReferenceSchema } from '../member-type-reference.validation'

type TMemberTypeReferenceFormValues = z.infer<typeof MemberTypeReferenceSchema>

export interface IMemberTypeReferenceFormProps
    extends IClassProps,
        IForm<
            Partial<TMemberTypeReferenceFormValues>,
            IMemberTypeReference,
            Error,
            TMemberTypeReferenceFormValues
        > {
    memberTypeReferenceId?: TEntityId
}

const MemberTypeReferenceCreateUpdateForm = ({
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
            member_type_id: '',

            interest_rate: 0,
            charges: 0,
            minimum_balance: 0,
            maintaining_balance: 0,
            active_member_ratio: 0,
            active_member_minimum_balance: 0,
            other_interest_on_saving_computation_minimum_balance: 0,
            other_interest_on_saving_computation_interest_rate: 0,
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreate({
        options: { onSuccess: formProps.onSuccess, onError: formProps.onError },
    })
    const updateMutation = useUpdateById({
        options: { onSuccess: formProps.onSuccess, onError: formProps.onError },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TMemberTypeReferenceFormValues>({
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

    const error = serverRequestErrExtractor({ error: rawError })

    return (
        <Form {...form}>
            <form
                className={cn('flex w-full flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="grid gap-x-6 gap-y-4 sm:gap-y-3"
                    disabled={isPending || formProps.readOnly}
                >
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
                    <p>Financial Details</p>
                    <fieldset className="space-y-4">
                        <FormFieldWrapper
                            control={form.control}
                            label="Interest *"
                            name="interest_rate"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    placeholder="Interest Rate (%)"
                                    type="number"
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Minimum Balance *"
                            name="minimum_balance"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    placeholder="Minimum Balance"
                                    type="number"
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
                                    placeholder="Charges"
                                    type="number"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Maintaining Balance *"
                            name="maintaining_balance"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    placeholder="Maintaining Balance"
                                    type="number"
                                />
                            )}
                        />
                    </fieldset>
                    <p>Active Member Criteria</p>
                    <fieldset className="space-y-4">
                        <FormFieldWrapper
                            control={form.control}
                            label="Active Member Ration *"
                            name="active_member_ratio"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    placeholder="Active Member Ratio"
                                    type="number"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Active Member Minimum Balance *"
                            name="active_member_minimum_balance"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    placeholder="Maintaining Balance"
                                    type="number"
                                />
                            )}
                        />
                    </fieldset>
                    <p>Other</p>

                    <fieldset className="space-y-4">
                        <FormFieldWrapper
                            control={form.control}
                            label="Other interest on saving computation minimum balance *"
                            name="other_interest_on_saving_computation_minimum_balance"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    placeholder="Maintaining Balance"
                                    type="number"
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
                                    disabled={isDisabled(field.name)}
                                    placeholder="Maintaining Balance"
                                    type="number"
                                />
                            )}
                        />
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
                    submitText={memberTypeReferenceId ? 'Update' : 'Create'}
                />
            </form>
        </Form>
    )
}

export const MemberTypeReferenceCreateUpdateFormModal = ({
    title = 'Create Member Type Reference',
    description = 'Fill out the form to add or update a reference.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IMemberTypeReferenceFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('max-w-2xl', className)}
            description={description}
            title={title}
            {...props}
        >
            <MemberTypeReferenceCreateUpdateForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default MemberTypeReferenceCreateUpdateForm
