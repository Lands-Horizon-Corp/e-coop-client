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
                ref={formRef}
                onSubmit={handleSubmit}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset
                    className="min-h-[60vh] gap-x-4 gap-y-4 space-y-5"
                    disabled={isClosingAccount || formProps.readOnly}
                >
                    <FormFieldWrapper
                        name="remarks"
                        control={form.control}
                        label="Add Close Remark"
                        hiddenFields={formProps.hiddenFields}
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
                                                            content={
                                                                field.value
                                                            }
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
                                                member_profile_id: profileId,
                                                reason: 'Voluntary Withdrawal',
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
                </fieldset>
                <FormFooterResetSubmit
                    error={error}
                    readOnly={formProps.readOnly}
                    isLoading={isClosingAccount}
                    disableSubmit={isClosingAccount || !!data}
                    submitText="Close Account"
                    className="sticky bottom-0"
                    onReset={() => {
                        form.reset(formProps.defaultValues)
                        reset()
                    }}
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
            title={title}
            description={description}
            className={cn('sm:max-w-full lg:max-w-3xl', className)}
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
