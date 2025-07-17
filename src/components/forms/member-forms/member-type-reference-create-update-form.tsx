import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { Path, useForm } from 'react-hook-form'

import Modal, { IModalProps } from '@/components/modals/modal'
import AccountPicker from '@/components/pickers/account-picker'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

import { cn } from '@/lib/utils'

import { memberTypeReferenceSchema } from '@/validations/member/member-type-reference-schema'

import {
    useCreateMemberTypeReference,
    useUpdateMemberTypeReference,
} from '@/hooks/api-hooks/member/use-member-type-reference'

import { IClassProps, IForm, IMemberTypeReference, TEntityId } from '@/types'

type TMemberTypeReferenceFormValues = z.infer<typeof memberTypeReferenceSchema>

export interface IMemberTypeReferenceFormProps
    extends IClassProps,
        IForm<
            Partial<TMemberTypeReferenceFormValues>,
            IMemberTypeReference,
            string,
            TMemberTypeReferenceFormValues
        > {
    memberTypeReferenceId?: TEntityId
}

const MemberTypeReferenceCreateUpdateForm = ({
    className,
    defaultValues,
    readOnly,
    disabledFields,
    memberTypeReferenceId,
    onSuccess,
    onError,
}: IMemberTypeReferenceFormProps) => {
    const form = useForm<TMemberTypeReferenceFormValues>({
        resolver: zodResolver(memberTypeReferenceSchema),
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
            ...defaultValues,
        },
    })

    const createMutation = useCreateMemberTypeReference({ onSuccess, onError })
    const updateMutation = useUpdateMemberTypeReference({ onSuccess, onError })

    const { error, isPending } = memberTypeReferenceId
        ? updateMutation
        : createMutation

    const onSubmit = form.handleSubmit((data) => {
        if (memberTypeReferenceId) {
            updateMutation.mutate({
                memberTypeReferenceId,
                data,
            })
        } else {
            createMutation.mutate(data)
        }
    })

    const isDisabled = (field: Path<TMemberTypeReferenceFormValues>) =>
        readOnly || disabledFields?.includes(field) || false

    return (
        <Form {...form}>
            <form
                onSubmit={onSubmit}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isPending || readOnly}
                    className="grid gap-x-6 gap-y-4 sm:gap-y-3"
                >
                    <FormFieldWrapper
                        control={form.control}
                        name="account_id"
                        label="Account *"
                        render={({ field }) => (
                            <AccountPicker
                                {...field}
                                onSelect={(account) => {
                                    field.onChange(account.id)
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
                                />
                            )}
                        />
                    </fieldset>
                </fieldset>
                <FormErrorMessage errorMessage={error} />
                <div>
                    <Separator className="my-2 sm:my-4" />
                    <div className="flex items-center justify-end gap-x-2">
                        <Button
                            size="sm"
                            type="button"
                            variant="ghost"
                            onClick={() => form.reset()}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            Reset
                        </Button>
                        <Button
                            size="sm"
                            type="submit"
                            disabled={isPending}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            {isPending ? (
                                <LoadingSpinner />
                            ) : memberTypeReferenceId ? (
                                'Update'
                            ) : (
                                'Create'
                            )}
                        </Button>
                    </div>
                </div>
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
