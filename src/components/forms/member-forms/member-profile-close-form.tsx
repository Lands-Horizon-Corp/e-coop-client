import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Path, useFieldArray, useForm } from 'react-hook-form'

import {
    XIcon,
    PlusIcon,
    CommentDashedIcon,
    HeartBreakFillIcon,
} from '@/components/icons'
import { Button } from '@/components/ui/button'
import TextEditor from '@/components/text-editor'
import { Separator } from '@/components/ui/separator'
import Modal, { IModalProps } from '@/components/modals/modal'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import FormErrorMessage from '@/components/ui/form-error-message'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Form, FormControl, FormItem } from '@/components/ui/form'
import AccountClosureReasonCombobox from '@/components/comboboxes/closure-reasons-combobox'

import { cn } from '@/lib'
import { TEntityId } from '@/server'
import { IClassProps } from '@/types'
import { IForm } from '@/types/components'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { useCloseMemberProfile } from '@/hooks/api-hooks/member/use-member-profile'
import { memberCreateCloseRemarksSchema } from '@/validations/member/member-close-remark-schema'

type TMemberCloseForm = z.infer<typeof memberCreateCloseRemarksSchema>

interface IMemberProfileCloseFormProps
    extends IClassProps,
        IForm<Partial<TMemberCloseForm>, unknown, string> {
    profileId: TEntityId
}

const MemberProfileCloseForm = ({
    readOnly,
    className,
    profileId,
    hiddenFields,
    disabledFields,
    defaultValues = { remarks: [] },
    onSuccess,
}: IMemberProfileCloseFormProps) => {
    const { onOpen } = useConfirmModalStore()
    const form = useForm<TMemberCloseForm>({
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: defaultValues,
        resolver: zodResolver(memberCreateCloseRemarksSchema),
    })

    const {
        data,
        error,
        mutate: closeAccount,
        isPending: isClosingAccount,
    } = useCloseMemberProfile({
        onSuccess,
    })

    const isDisabled = (field: Path<TMemberCloseForm>) =>
        readOnly || disabledFields?.includes(field) || false

    const {
        remove: removeRemark,
        append: appendRemark,
        fields: remarksFields,
    } = useFieldArray({
        control: form.control,
        name: 'remarks',
        keyName: 'fieldKey',
    })

    const handleSubmit = ({ remarks }: TMemberCloseForm) => {
        closeAccount({ profileId, data: remarks })
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset
                    className="min-h-[60vh] gap-x-4 gap-y-4 space-y-5"
                    disabled={isClosingAccount || readOnly}
                >
                    <FormFieldWrapper
                        name="remarks"
                        control={form.control}
                        label="Add Close Remark"
                        hiddenFields={hiddenFields}
                        render={() => (
                            <FormItem className="col-span-1 space-y-2">
                                <Separator />
                                <p className="text-sm text-muted-foreground/70">
                                    Closure reason helps others to understand
                                    what are the reasons for the member&apos;s
                                    account/profile closure.
                                </p>
                                <fieldset
                                    disabled={isDisabled('remarks')}
                                    className="space-y-2"
                                >
                                    {remarksFields.map((field, index) => (
                                        <div
                                            key={field.fieldKey}
                                            className="relative space-y-2 rounded-xl border bg-background p-4"
                                        >
                                            <FormFieldWrapper
                                                control={form.control}
                                                hiddenFields={hiddenFields}
                                                label="Closure Category"
                                                name={`remarks.${index}.category`}
                                                render={({ field }) => (
                                                    <FormControl>
                                                        <AccountClosureReasonCombobox
                                                            {...field}
                                                            className="w-full"
                                                            disabled={isDisabled(
                                                                field.name
                                                            )}
                                                            placeholder="select category"
                                                        />
                                                    </FormControl>
                                                )}
                                            />
                                            <FormFieldWrapper
                                                control={form.control}
                                                hiddenFields={hiddenFields}
                                                label="Closure Detailed Description"
                                                name={`remarks.${index}.description`}
                                                render={({ field }) => (
                                                    <FormControl>
                                                        <TextEditor
                                                            {...field}
                                                            disabled={isDisabled(
                                                                field.name
                                                            )}
                                                            className="w-full"
                                                            textEditorClassName="!max-w-none"
                                                            placeholder="Write a full description/reason explaining what happened..."
                                                        />
                                                    </FormControl>
                                                )}
                                            />
                                            <Button
                                                size="icon"
                                                type="button"
                                                variant="secondary"
                                                onClick={() =>
                                                    removeRemark(index)
                                                }
                                                disabled={isDisabled('remarks')}
                                                className="absolute -right-1 -top-1 !my-0 size-fit rounded-full p-1"
                                            >
                                                <XIcon className="size-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        size="sm"
                                        type="button"
                                        variant="secondary"
                                        className="w-full"
                                        onClick={() =>
                                            appendRemark({
                                                membersProfileId: profileId,
                                                category: 'Inactive Membership',
                                                description: '',
                                            })
                                        }
                                        disabled={isDisabled('remarks')}
                                    >
                                        <PlusIcon className="mr-2" /> Add
                                        Closure Remark Reason
                                    </Button>
                                    {remarksFields.length === 0 && (
                                        <div className="flex flex-col items-center justify-center gap-y-4 py-16 text-muted-foreground/70">
                                            <CommentDashedIcon className="size-16" />
                                            <p className="text-center text-sm">
                                                No closure reason yet, at least
                                                1 reason is required
                                            </p>
                                        </div>
                                    )}
                                </fieldset>
                            </FormItem>
                        )}
                    />
                    <FormErrorMessage errorMessage={error} />
                </fieldset>
                <div>
                    <Separator className="my-2 sm:my-4" />
                    <div className="flex items-center justify-end gap-x-2">
                        <Button
                            type="button"
                            variant="ghost"
                            disabled={readOnly || isClosingAccount}
                            onClick={() => {
                                onOpen({
                                    title: 'Reset Form',
                                    description:
                                        'Are you sure to reset the form fields? Any changes will be lost.',
                                    onConfirm: () => {
                                        form.reset()
                                    },
                                })
                            }}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            Reset
                        </Button>
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={isClosingAccount || !!data}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            {isClosingAccount && (
                                <LoadingSpinner className="mr-2 inline" />
                            )}
                            Close Account
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}

export const MemberProfileCloseFormModal = ({
    title = (
        <span>
            <HeartBreakFillIcon className="mr-2 inline size-8 text-destructive/90" />
            Member Account Closure
        </span>
    ),
    description = 'Please specify the reason for closing this member account/profile. After closing, this account will not be able to do any transactions.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<IMemberProfileCloseFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('sm:max-w-full lg:max-w-3xl', className)}
            {...props}
        >
            <MemberProfileCloseForm {...formProps} />
        </Modal>
    )
}

export default MemberProfileCloseForm
