import z from 'zod'
import { Path, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import TextEditor from '@/components/text-editor'
import { Separator } from '@/components/ui/separator'
import Modal, { IModalProps } from '@/components/modals/modal'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import AccountsPicker from '@/components/pickers/accounts-picker'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import MemberTypeSelect from '@/components/selects/member-type-select'

import { cn } from '@/lib/utils'
import { IForm, IClassProps } from '@/types'
import {
    useCreateMemberTypeReference,
    useUpdateMemberTypeReference,
} from '@/hooks/api-hooks/member/use-member-type'
import { IMemberTypeReferenceRequest, TEntityId } from '@/server/types'
import { createMemberTypeReferenceSchema } from '@/validations/member/member-type-reference-schema'

type TMemberTypeReferenceForm = z.infer<typeof createMemberTypeReferenceSchema>

export interface IMemberTypeReferenceCreateUpdateFormProps
    extends IClassProps,
        IForm<Partial<IMemberTypeReferenceRequest>, unknown, string> {
    memberTypeReferenceId?: TEntityId
}

const MemberTypeReferenceCreateUpdateForm = ({
    memberTypeReferenceId,
    readOnly,
    className,
    hiddenFields,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
}: IMemberTypeReferenceCreateUpdateFormProps) => {
    const isUpdateMode = Boolean(memberTypeReferenceId)

    const form = useForm<TMemberTypeReferenceForm>({
        resolver: zodResolver(createMemberTypeReferenceSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            accountId: '',
            memberTypeId: '',
            description: '',
            ...defaultValues,
        },
    })

    const {
        error: createError,
        isPending: isCreating,
        mutate: createMemberTypeReference,
    } = useCreateMemberTypeReference({ onSuccess, onError })

    const {
        error: updateError,
        isPending: isUpdating,
        mutate: updateMemberTypeReference,
    } = useUpdateMemberTypeReference({ onSuccess, onError })

    const onSubmit = (formData: TMemberTypeReferenceForm) => {
        if (isUpdateMode && memberTypeReferenceId) {
            updateMemberTypeReference({
                memberTypeReferenceId,
                data: formData,
            })
        } else {
            createMemberTypeReference(formData)
        }
    }

    const combinedError = createError || updateError

    const isDisabled = (field: Path<TMemberTypeReferenceForm>) =>
        readOnly || disabledFields?.includes(field) || false

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isCreating || isUpdating || readOnly}
                    className="grid gap-x-6 gap-y-4 sm:gap-y-3"
                >
                    <div className="grid grid-cols-2 gap-2">
                        <FormFieldWrapper
                            name="memberTypeId"
                            control={form.control}
                            label="Member Type"
                            hiddenFields={hiddenFields}
                            render={({ field }) => (
                                <MemberTypeSelect
                                    {...field}
                                    value={field.value}
                                    placeholder="Select Member Type"
                                    disabled={
                                        isCreating ||
                                        isUpdating ||
                                        readOnly ||
                                        isDisabled(field.name)
                                    }
                                />
                            )}
                        />
                        <FormFieldWrapper
                            name="accountId"
                            control={form.control}
                            label="Account"
                            hiddenFields={hiddenFields}
                            render={({ field }) => (
                                <AccountsPicker
                                    {...field}
                                    placeholder="Select Account"
                                    disabled={
                                        isCreating ||
                                        isUpdating ||
                                        readOnly ||
                                        isDisabled(field.name)
                                    }
                                />
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        <FormFieldWrapper
                            name="interestRate"
                            control={form.control}
                            label="Interest Rate (%)"
                            hiddenFields={hiddenFields}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="number"
                                    step="0.01"
                                    id={field.name}
                                    placeholder="Interest Rate"
                                    disabled={
                                        isCreating ||
                                        isUpdating ||
                                        readOnly ||
                                        isDisabled(field.name)
                                    }
                                />
                            )}
                        />
                        <FormFieldWrapper
                            name="maintainingBalance"
                            control={form.control}
                            label="Maintaining Balance"
                            hiddenFields={hiddenFields}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    step="1"
                                    type="number"
                                    id={field.name}
                                    placeholder="Maintaining Bal."
                                    disabled={
                                        isCreating ||
                                        isUpdating ||
                                        readOnly ||
                                        isDisabled(field.name)
                                    }
                                />
                            )}
                        />
                        <FormFieldWrapper
                            name="minimumBalance"
                            control={form.control}
                            hiddenFields={hiddenFields}
                            label="Minimum Balance"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="number"
                                    step="1"
                                    id={field.name}
                                    placeholder="Minimum Bal."
                                    disabled={
                                        isCreating ||
                                        isUpdating ||
                                        readOnly ||
                                        isDisabled(field.name)
                                    }
                                />
                            )}
                        />
                        <FormFieldWrapper
                            name="charges"
                            hiddenFields={hiddenFields}
                            control={form.control}
                            label="Charges"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="number"
                                    step="1"
                                    id={field.name}
                                    placeholder="Charges..."
                                    disabled={
                                        isCreating ||
                                        isUpdating ||
                                        readOnly ||
                                        isDisabled(field.name)
                                    }
                                />
                            )}
                        />
                        <FormFieldWrapper
                            name="description"
                            control={form.control}
                            label="Description"
                            className="col-span-4"
                            hiddenFields={hiddenFields}
                            render={({ field }) => (
                                <TextEditor
                                    {...field}
                                    placeholder="Description"
                                    className="w-full"
                                    textEditorClassName="w-full bg-background !max-w-none"
                                    disabled={
                                        isCreating ||
                                        isUpdating ||
                                        readOnly ||
                                        isDisabled(field.name)
                                    }
                                />
                            )}
                        />
                    </div>
                </fieldset>
                <fieldset
                    disabled={isCreating || isUpdating || readOnly}
                    className="grid grid-cols-2 gap-4 sm:gap-3"
                >
                    <div className="space-y-4 sm:space-y-3">
                        <p>Active Member</p>
                        <div className="grid grid-cols-2 gap-3">
                            <FormFieldWrapper
                                name="activeMemberMinimumBalance"
                                control={form.control}
                                label="Active Member Min. Balance"
                                hiddenFields={hiddenFields}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="number"
                                        step="0.01"
                                        id={field.name}
                                        placeholder="Active Member Min. Balance"
                                        disabled={
                                            isCreating ||
                                            isUpdating ||
                                            readOnly ||
                                            isDisabled(field.name)
                                        }
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                name="activeMemberRatio"
                                control={form.control}
                                label="Active Member Ratio"
                                hiddenFields={hiddenFields}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        step="1"
                                        type="number"
                                        id={field.name}
                                        placeholder="Active Member Ratio"
                                        disabled={
                                            isCreating ||
                                            isUpdating ||
                                            readOnly ||
                                            isDisabled(field.name)
                                        }
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <div className="space-y-4 sm:space-y-3">
                        <p>Other interest on saving computation</p>
                        <div className="grid grid-cols-2 gap-3">
                            <FormFieldWrapper
                                name="otherInterestOnSavingComputationMinimumBalance"
                                control={form.control}
                                label="Minimum Balance"
                                hiddenFields={hiddenFields}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="number"
                                        step="0.01"
                                        id={field.name}
                                        placeholder="Minimum Balance"
                                        disabled={
                                            isCreating ||
                                            isUpdating ||
                                            readOnly ||
                                            isDisabled(field.name)
                                        }
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                name="otherInterestOnSavingComputationInterestRate"
                                control={form.control}
                                label="Interest Rate (%)"
                                hiddenFields={hiddenFields}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        step="0.01"
                                        type="number"
                                        id={field.name}
                                        placeholder="Interest Rate"
                                        disabled={
                                            isCreating ||
                                            isUpdating ||
                                            readOnly ||
                                            isDisabled(field.name)
                                        }
                                    />
                                )}
                            />
                        </div>
                    </div>
                </fieldset>

                <FormErrorMessage errorMessage={combinedError} />

                <div>
                    <Separator className="my-2 sm:my-4" />
                    <div className="flex items-center justify-end gap-x-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => form.reset()}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            Reset
                        </Button>
                        <Button
                            type="submit"
                            disabled={isCreating || isUpdating}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            {isCreating || isUpdating ? (
                                <LoadingSpinner />
                            ) : isUpdateMode ? (
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
    description = 'Fill out the form to add a new member type reference.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IMemberTypeReferenceCreateUpdateFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('max-w-7xl', className)}
            {...props}
        >
            <MemberTypeReferenceCreateUpdateForm {...formProps} />
        </Modal>
    )
}

export default MemberTypeReferenceCreateUpdateForm
