import { useState } from 'react'
import z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import JointMemberProfileListModal from '@/routes/org/$orgname/branch.$branchname/(employee)/transaction/-components/joint-member-profile-list-modal'
import { useAuthUserWithOrg } from '@/store/user-auth-store'
import { Path, useForm } from 'react-hook-form'

import { HandShakeHeartIcon } from '@/components/icons'
import SectionTitle from '@/components/member-infos/section-title'
import Modal, { IModalProps } from '@/components/modals/modal'
import MemberPicker from '@/components/pickers/member-picker'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import SignatureField from '@/components/ui/signature-field'
import { Textarea } from '@/components/ui/textarea'

import { cn } from '@/lib/utils'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '@/validations/common'

import { useCreateTransaction } from '@/hooks/api-hooks/use-transaction'
import { useAlertBeforeClosing } from '@/hooks/use-alert-before-closing'

import {
    IClassProps,
    IForm,
    IMedia,
    IMemberProfile,
    ITransactionRequest,
    ITransactionResponse,
    PaymentSource,
    TEntityId,
} from '@/types'

const TransactionSchema = z.object({
    signature_media_id: entityIdSchema.optional(),
    member: z.any(),
    member_profile_id: entityIdSchema.optional(),
    member_joint_account_id: entityIdSchema.optional(),
    joint_account_id: z.any(),
    reference_number: z.string().min(1, 'Reference number is required'),
    is_reference_number_checked: z.boolean().optional(),
    description: descriptionSchema
        .max(255, 'Max 255 character description')
        .optional()
        .transform(descriptionTransformerSanitizer),
    source: z.enum(PaymentSource, {
        required_error: 'Source is required',
    }),
    signature_media: z.any(),
})

type TTransactionFormValues = z.infer<typeof TransactionSchema>

export interface ITransactionFormProps
    extends IClassProps,
        IForm<
            Partial<ITransactionRequest>,
            ITransactionResponse,
            string,
            TTransactionFormValues
        > {
    member_id?: TEntityId
}

const CreateTransactionForm = ({
    readOnly,
    className,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
    member_id,
}: ITransactionFormProps) => {
    const [selectedMember, setSelectedMember] = useState<IMemberProfile | null>(
        null
    )

    const form = useForm<TTransactionFormValues>({
        resolver: zodResolver(TransactionSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            ...defaultValues,
            member_profile_id: member_id,
            source: 'payment',
            member: selectedMember,
        },
    })

    const { currentAuth: user } = useAuthUserWithOrg()
    const {
        user_organization: {
            user_setting_used_or: userSettingOR,
            user_setting_number_padding,
        },
    } = user

    const {
        mutate: createMutation,
        isPending,
        error,
    } = useCreateTransaction({
        onSuccess,
        onError,
    })

    const onSubmit = form.handleSubmit((formData) => {
        createMutation(formData)
    })

    const isDisabled = (field: Path<TTransactionFormValues>) =>
        readOnly || disabledFields?.includes(field) || false

    const isDirty = Object.keys(form.formState.dirtyFields).length > 0

    useAlertBeforeClosing(isDirty)

    const JointAccount = selectedMember?.member_joint_accounts ?? []

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className={cn('', className)}>
                <FormFieldWrapper
                    control={form.control}
                    name="reference_number"
                    label="Reference Number"
                    className="col-span-2"
                    render={({ field }) => (
                        <Input
                            {...field}
                            id={field.name}
                            placeholder="Reference Number"
                            autoComplete="off"
                            disabled={
                                isDisabled(field.name) ||
                                form.watch('is_reference_number_checked')
                            }
                        />
                    )}
                />
                <FormFieldWrapper
                    control={form.control}
                    className="h-12 flex items-center col-span-2"
                    name="is_reference_number_checked"
                    render={({ field }) => (
                        <div className="flex items-center text-muted-foreground space-x-2 h-12">
                            <Checkbox
                                id={field.name}
                                defaultChecked={field.value}
                                onChange={field.onChange}
                                checked={field.value}
                                onCheckedChange={(checked) => {
                                    field.onChange(checked)
                                    if (checked) {
                                        form.setValue(
                                            'reference_number',
                                            userSettingOR
                                                ?.toString()
                                                .padStart(
                                                    user_setting_number_padding,
                                                    '0'
                                                ) ?? ''
                                        )
                                    }
                                }}
                                name={field.name}
                            />
                            <Label className="text-xs">
                                Auto Generate OR Number
                            </Label>
                        </div>
                    )}
                />
                <FormFieldWrapper
                    control={form.control}
                    name="member"
                    label="Select a Member"
                    render={({ field }) => (
                        <MemberPicker
                            value={field.value}
                            onSelect={(selectedMember) => {
                                field.onChange(selectedMember)
                                setSelectedMember(selectedMember)
                                form.setValue(
                                    'member_profile_id',
                                    selectedMember?.id
                                )
                            }}
                            placeholder="Select Member"
                            disabled={isDisabled(field.name)}
                        />
                    )}
                />
                <FormFieldWrapper
                    control={form.control}
                    name="joint_account_id"
                    label="Select Joint Account"
                    render={({ field }) => (
                        <JointMemberProfileListModal
                            triggerProps={{
                                disabled: JointAccount.length === 0,
                            }}
                            title={
                                <SectionTitle
                                    title="Joint Accounts"
                                    subTitle="Co-owners of this account that have the access and share  financial responsibility of this account (Select a one joint member )"
                                    Icon={HandShakeHeartIcon}
                                />
                            }
                            onSelect={(jointMember) => {
                                field.onChange(jointMember?.id)
                            }}
                            selectedMemberJointId={field.value}
                            memberJointProfile={JointAccount}
                        />
                    )}
                />
                {/* <FormFieldWrapper
                    control={form.control}
                    name="source"
                    label="Payment Source"
                    className="col-span-2"
                    render={({ field }) => (
                        <Select onValueChange={field.onChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Payment Source" />
                            </SelectTrigger>
                            <SelectContent className="w-full">
                                {Object.values(PaymentSource).map((source) => (
                                    <SelectItem
                                        key={source}
                                        value={source}
                                        disabled={isDisabled(field.name)}
                                    >
                                        {source}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                /> */}
                <FormFieldWrapper
                    control={form.control}
                    name="description"
                    label="Description"
                    render={({ field }) => (
                        <Textarea
                            {...field}
                            id={field.name}
                            placeholder="a short description..."
                            autoComplete="off"
                        />
                    )}
                />
                <FormFieldWrapper
                    control={form.control}
                    name="signature_media_id"
                    label="Signature"
                    render={({ field }) => {
                        const value = form.watch('signature_media')
                        return (
                            <SignatureField
                                {...field}
                                placeholder="Signature"
                                value={
                                    value
                                        ? (value as IMedia).download_url
                                        : value
                                }
                                onChange={(newImage) => {
                                    if (newImage) field.onChange(newImage.id)
                                    else field.onChange(undefined)

                                    form.setValue('signature_media', newImage)
                                }}
                            />
                        )
                    }}
                />{' '}
                <div className="w-full col-span-2 space-y-2">
                    <Separator />
                    <FormErrorMessage errorMessage={error} />
                    <div className="space-y-2">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <LoadingSpinner />
                            ) : (
                                'Create Transaction'
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}

export const CreateTransactionFormModal = ({
    title = 'Create Transaction',
    description = 'Fill out the form to add a new transaction.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<ITransactionFormProps, 'className '>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <CreateTransactionForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default CreateTransactionFormModal
