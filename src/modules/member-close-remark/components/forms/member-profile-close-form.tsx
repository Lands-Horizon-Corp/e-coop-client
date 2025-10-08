import { useFieldArray, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import {
    CommentDashedIcon,
    HeartBreakFillIcon,
    PlusIcon,
    XIcon,
} from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import TextEditor from '@/components/text-editor'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormItem } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Separator } from '@/components/ui/separator'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import { useCloseMemberProfile } from '../../member-close-remark.service'
import { MemberCreateCloseRemarksSchema } from '../../member-close-remark.validation'
import AccountClosureReasonCombobox from '../closure-reasons-combobox'

type TMemberCloseForm = z.infer<typeof MemberCreateCloseRemarksSchema>

interface IMemberProfileCloseFormProps
    extends IClassProps,
        IForm<Partial<TMemberCloseForm>, unknown, string> {
    profileId: TEntityId
}

const MemberProfileCloseForm = ({
    className,
    profileId,
    ...formProps
}: IMemberProfileCloseFormProps) => {
    const form = useForm<TMemberCloseForm>({
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: {
            remarks: [],
            ...formProps.defaultValues,
        },
        resolver: standardSchemaResolver(MemberCreateCloseRemarksSchema),
    })

    const {
        data,
        error: rawError,
        mutate: closeAccount,
        isPending: isClosingAccount,
        reset,
    } = useCloseMemberProfile({
        options: {
            onSuccess: formProps.onSuccess,
            meta: {
                invalidates: [['member-profile', profileId]],
            },
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TMemberCloseForm>({
            form,
            ...formProps,
            autoSave: false,
            preventExitOnDirty: false,
        })

    const error = serverRequestErrExtractor({ error: rawError })

    const {
        remove: removeRemark,
        append: appendRemark,
        fields: remarksFields,
    } = useFieldArray({
        control: form.control,
        name: 'remarks',
        keyName: 'fieldKey',
    })

    form.watch('remarks')

    const handleSubmit = form.handleSubmit(({ remarks }: TMemberCloseForm) => {
        closeAccount({ profileId, data: remarks })
    }, handleFocusError)

    return (
        <Form {...form}>
            <form
                className={cn('flex w-full flex-col gap-y-4', className)}
                onSubmit={handleSubmit}
                ref={formRef}
            >
                <fieldset
                    className="min-h-[60vh] gap-x-4 gap-y-4 space-y-5"
                    disabled={isClosingAccount || formProps.readOnly}
                >
                    <FormFieldWrapper
                        control={form.control}
                        hiddenFields={formProps.hiddenFields}
                        label="Add Close Remark"
                        name="remarks"
                        render={() => (
                            <FormItem className="col-span-1 space-y-2">
                                <Separator />
                                <p className="text-sm text-muted-foreground/70">
                                    Closure reason helps others to understand
                                    what are the reasons for the member&apos;s
                                    account/profile closure.
                                </p>
                                <fieldset
                                    className="space-y-2"
                                    disabled={isDisabled('remarks')}
                                >
                                    {remarksFields.map((field, index) => (
                                        <div
                                            className="relative space-y-2 rounded-xl border bg-background p-4"
                                            key={field.fieldKey}
                                        >
                                            <FormFieldWrapper
                                                control={form.control}
                                                hiddenFields={
                                                    formProps.hiddenFields
                                                }
                                                label="Reason"
                                                name={`remarks.${index}.reason`}
                                                render={({ field }) => (
                                                    <FormControl>
                                                        <AccountClosureReasonCombobox
                                                            {...field}
                                                            className="w-full"
                                                            disabled={isDisabled(
                                                                field.name
                                                            )}
                                                            placeholder="select reason"
                                                        />
                                                    </FormControl>
                                                )}
                                            />
                                            <FormFieldWrapper
                                                control={form.control}
                                                hiddenFields={
                                                    formProps.hiddenFields
                                                }
                                                label="Closure Detailed Description"
                                                name={`remarks.${index}.description`}
                                                render={({ field }) => (
                                                    <FormControl>
                                                        <TextEditor
                                                            {...field}
                                                            className="w-full"
                                                            content={
                                                                field.value
                                                            }
                                                            disabled={isDisabled(
                                                                field.name
                                                            )}
                                                            placeholder="Write a full description/reason explaining what happened..."
                                                            textEditorClassName="!max-w-none"
                                                        />
                                                    </FormControl>
                                                )}
                                            />
                                            <Button
                                                className="absolute -right-1 -top-1 !my-0 size-fit rounded-full p-1"
                                                disabled={isDisabled('remarks')}
                                                onClick={() =>
                                                    removeRemark(index)
                                                }
                                                size="icon"
                                                type="button"
                                                variant="secondary"
                                            >
                                                <XIcon className="size-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        className="w-full"
                                        disabled={isDisabled('remarks')}
                                        onClick={() =>
                                            appendRemark({
                                                member_profile_id: profileId,
                                                reason: 'Voluntary Withdrawal',
                                                description: '',
                                            })
                                        }
                                        size="sm"
                                        type="button"
                                        variant="secondary"
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
                </fieldset>
                <FormFooterResetSubmit
                    className="sticky bottom-0"
                    disableSubmit={isClosingAccount || !!data}
                    error={error}
                    isLoading={isClosingAccount}
                    onReset={() => {
                        form.reset(formProps.defaultValues)
                        reset()
                    }}
                    readOnly={formProps.readOnly}
                    submitText="Close Account"
                />
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
            className={cn('sm:max-w-full lg:max-w-3xl', className)}
            description={description}
            title={title}
            {...props}
        >
            <MemberProfileCloseForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default MemberProfileCloseForm
