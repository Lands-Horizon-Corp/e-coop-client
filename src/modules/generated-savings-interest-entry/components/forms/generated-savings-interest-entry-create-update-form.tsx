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
    useCreateGeneratedSavingsInterestEntry,
    useUpdateGeneratedSavingsInterestEntryById,
} from '../../generated-savings-interest-entry.service'
import {
    IGeneratedSavingsInterestEntry,
    IGeneratedSavingsInterestEntryRequest,
} from '../../generated-savings-interest-entry.types'
import { GeneratedSavingsInterestEntrySchema } from '../../generated-savings-interest-entry.validation'

type TGeneratedSavingsInterestEntrySchema = z.infer<
    typeof GeneratedSavingsInterestEntrySchema
>

export interface IGeneratedSavingsInterestEntryFormProps
    extends IClassProps,
        IForm<
            Partial<IGeneratedSavingsInterestEntryRequest>,
            IGeneratedSavingsInterestEntry,
            Error,
            TGeneratedSavingsInterestEntrySchema
        > {
    generatedSavingsInterestEntryId?: TEntityId
}

const GeneratedSavingsInterestEntryCreateUpdateForm = ({
    generatedSavingsInterestEntryId,
    className,
    ...formProps
}: IGeneratedSavingsInterestEntryFormProps) => {
    const form = useForm<TGeneratedSavingsInterestEntrySchema>({
        resolver: standardSchemaResolver(GeneratedSavingsInterestEntrySchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            account_id: '',
            member_profile_id: '',
            interest_amount: 0,
            interest_tax: 0,
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateGeneratedSavingsInterestEntry({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const updateMutation = useUpdateGeneratedSavingsInterestEntryById({
        options: {
            onSuccess: (newData) => {
                formProps.onSuccess?.(newData)
                form.reset(newData)
            },
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TGeneratedSavingsInterestEntrySchema>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((formData) => {
        if (generatedSavingsInterestEntryId) {
            updateMutation.mutate({
                id: generatedSavingsInterestEntryId,
                payload: formData,
            })
        } else {
            createMutation.mutate(formData)
        }
    }, handleFocusError)

    const {
        error: rawError,
        isPending,
        reset,
    } = generatedSavingsInterestEntryId ? updateMutation : createMutation

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
                    <div className="grid grid-cols-2 gap-2">
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
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <FormFieldWrapper
                            control={form.control}
                            label="Interest Amount *"
                            name="interest_amount"
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

                        <FormFieldWrapper
                            control={form.control}
                            label="Interest Tax *"
                            name="interest_tax"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="0.00"
                                />
                            )}
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
                    submitText={
                        generatedSavingsInterestEntryId ? 'Update' : 'Create'
                    }
                />
            </form>
        </Form>
    )
}

export const GeneratedSavingsInterestEntryCreateUpdateFormModal = ({
    title = 'Create Savings Interest Entry',
    description = 'Fill out the form to create a new savings interest entry.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IGeneratedSavingsInterestEntryFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('!max-w-xl', className)}
            description={description}
            title={title}
            {...props}
        >
            <GeneratedSavingsInterestEntryCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default GeneratedSavingsInterestEntryCreateUpdateForm
