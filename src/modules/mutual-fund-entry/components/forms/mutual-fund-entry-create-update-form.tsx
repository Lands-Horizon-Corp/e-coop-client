import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { AccountPicker } from '@/modules/account'
import MemberPicker from '@/modules/member-profile/components/member-picker'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    useCreateMutualFundEntry,
    useUpdateMutualFundEntryById,
} from '../../mutual-fund-entry.service'
import {
    IMutualFundEntry,
    IMutualFundEntryRequest,
} from '../../mutual-fund-entry.types'
import { MutualFundEntrySchema } from '../../mutual-fund-entry.validation'

type TMutualFundEntrySchema = z.infer<typeof MutualFundEntrySchema>

export interface IMutualFundEntryFormProps
    extends IClassProps,
        IForm<
            Partial<IMutualFundEntryRequest>,
            IMutualFundEntry,
            Error,
            TMutualFundEntrySchema
        > {
    mutualFundEntryId?: TEntityId
    mutualFundId?: TEntityId
}

const MutualFundEntryCreateUpdateForm = ({
    mutualFundEntryId,
    mutualFundId,
    className,
    ...formProps
}: IMutualFundEntryFormProps) => {
    const form = useForm<TMutualFundEntrySchema>({
        resolver: standardSchemaResolver(MutualFundEntrySchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            account_id: '',
            member_profile_id: '',
            amount: 0,
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateMutualFundEntry({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const updateMutation = useUpdateMutualFundEntryById({
        options: {
            onSuccess: (newData) => {
                formProps.onSuccess?.(newData)
                form.reset(newData)
            },
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TMutualFundEntrySchema>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((formData) => {
        if (mutualFundEntryId) {
            updateMutation.mutate({
                id: mutualFundEntryId,
                payload: formData,
            })
        } else if (mutualFundId) {
            createMutation.mutate({
                mutualFundId: mutualFundId!,
                payload: formData,
            })
        }
    }, handleFocusError)

    const {
        error: rawError,
        isPending,
        reset,
    } = mutualFundEntryId ? updateMutation : createMutation

    const error = serverRequestErrExtractor({ error: rawError })

    return (
        <Form {...form}>
            <form
                className={cn('flex w-full flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="space-y-3"
                    disabled={isPending || formProps.readOnly}
                >
                    <FormFieldWrapper
                        control={form.control}
                        label="Member Profile *"
                        name="member_profile_id"
                        render={({ field }) => (
                            <MemberPicker
                                disabled={isDisabled(field.name)}
                                onSelect={(memberProfile) => {
                                    field.onChange(memberProfile?.id)
                                    form.setValue(
                                        'member_profile',
                                        memberProfile,
                                        {
                                            shouldDirty: true,
                                        }
                                    )
                                }}
                                value={form.getValues('member_profile')}
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
                                disabled={isDisabled(field.name)}
                                mode="deposit"
                                nameOnly
                                onSelect={(account) => {
                                    field.onChange(account?.id)
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
                        label="Amount *"
                        name="amount"
                        render={({ field }) => (
                            <Input
                                {...field}
                                autoComplete="off"
                                disabled={isDisabled(field.name)}
                                id={field.name}
                                min="0"
                                placeholder="0.00"
                            />
                        )}
                    />
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
                    submitText={mutualFundEntryId ? 'Update' : 'Create'}
                />
            </form>
        </Form>
    )
}

export const MutualFundEntryCreateUpdateFormModal = ({
    title = 'Create Mutual Fund Entry',
    description = 'Fill out the form to create a new mutual fund entry.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IMutualFundEntryFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('!max-w-xl', className)}
            description={description}
            title={title}
            {...props}
        >
            <MutualFundEntryCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default MutualFundEntryCreateUpdateForm
