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
            autoSave: !!memberTypeReferenceId,
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
                ref={formRef}
                onSubmit={onSubmit}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isPending || formProps.readOnly}
                    className="grid gap-x-6 gap-y-4 sm:gap-y-3"
                >
                    <FormFieldWrapper
                        control={form.control}
                        name="account_id"
                        label="Account *"
                        render={({ field }) => (
                            <AccountPicker
                                {...field}
                                value={form.getValues('account')}
                                onSelect={(account) => {
                                    field.onChange(account.id)
                                    form.setValue('account', account, {
                                        shouldDirty: true,
                                    })
                                }}
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="description"
                        label="Description *"
                        render={({ field }) => (
                            <Textarea
                                {...field}
                                placeholder="Description"
                                autoComplete="off"
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />
                    <p>Financial Details</p>
                    <fieldset className="space-y-4">
                        <FormFieldWrapper
                            control={form.control}
                            name="interest_rate"
                            label="Interest *"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="number"
                                    placeholder="Interest Rate (%)"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="minimum_balance"
                            label="Minimum Balance *"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="number"
                                    placeholder="Minimum Balance"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="charges"
                            label="Charges *"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="number"
                                    placeholder="Charges"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="maintaining_balance"
                            label="Maintaining Balance *"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="number"
                                    placeholder="Maintaining Balance"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                    </fieldset>
                    <p>Active Member Criteria</p>
                    <fieldset className="space-y-4">
                        <FormFieldWrapper
                            control={form.control}
                            name="active_member_ratio"
                            label="Active Member Ration *"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="number"
                                    placeholder="Active Member Ratio"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="active_member_minimum_balance"
                            label="Active Member Minimum Balance *"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="number"
                                    placeholder="Maintaining Balance"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                    </fieldset>
                    <p>Other</p>

                    <fieldset className="space-y-4">
                        <FormFieldWrapper
                            control={form.control}
                            name="other_interest_on_saving_computation_minimum_balance"
                            label="Other interest on saving computation minimum balance *"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="number"
                                    placeholder="Maintaining Balance"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="other_interest_on_saving_computation_interest_rate"
                            label="Other interest on saving computation interest rate *"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="number"
                                    placeholder="Maintaining Balance"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                    </fieldset>
                </fieldset>
                <FormFooterResetSubmit
                    error={error}
                    readOnly={formProps.readOnly}
                    isLoading={isPending}
                    disableSubmit={!form.formState.isDirty}
                    submitText={memberTypeReferenceId ? 'Update' : 'Create'}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
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
            title={title}
            description={description}
            className={cn('max-w-2xl', className)}
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
