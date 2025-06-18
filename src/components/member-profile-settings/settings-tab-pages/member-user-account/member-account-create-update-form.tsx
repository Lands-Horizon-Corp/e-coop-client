import z from 'zod'
import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
    ChecklistTemplate,
    ValueChecklistMeter,
} from '@/components/value-checklist-indicator'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormItem } from '@/components/ui/form'
import { VerifiedPatchIcon } from '@/components/icons'
import PasswordInput from '@/components/ui/password-input'
import Modal, { IModalProps } from '@/components/modals/modal'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import FormErrorMessage from '@/components/ui/form-error-message'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { PhoneInput } from '@/components/contact-input/contact-input'

import { cn } from '@/lib/utils'
import { toReadableDate } from '@/utils'
import { memberProfileUserAccountSchema } from '@/validations/member/member-profile-schema'

import {
    IForm,
    TEntityId,
    IClassProps,
    IMemberProfile,
    IMemberProfileUserAccountRequest,
} from '@/types'
import {
    useCreateMemberProfileUserAccount,
    useUpdateMemberProfileUserAccount,
} from '@/hooks/api-hooks/member/use-member-profile-settings'
import { Separator } from '@/components/ui/separator'

type TForm = z.infer<typeof memberProfileUserAccountSchema>

interface IMemberUserAccountFormProps
    extends IClassProps,
        IForm<Partial<TForm>, IMemberProfile, string> {
    memberProfileId: TEntityId
    userId?: TEntityId
}

const MemberUserAccountCreateUpdateForm = ({
    userId,
    memberProfileId,

    readOnly,
    className,
    defaultValues,
    onError,
    onSuccess,
}: IMemberUserAccountFormProps) => {
    const form = useForm<TForm>({
        resolver: zodResolver(memberProfileUserAccountSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            email: '',
            user_name: '',
            first_name: '',
            last_name: '',
            full_name: '',
            contact_number: '',
            middle_name: '',
            suffix: '',
            ...defaultValues,
            with_password: defaultValues?.with_password ?? false,
            birthdate: toReadableDate(new Date(), 'yyyy-MM-dd'),
        },
    })

    const first_name = useWatch({ control: form.control, name: 'first_name' })
    const middle_name = useWatch({ control: form.control, name: 'middle_name' })
    const last_name = useWatch({ control: form.control, name: 'last_name' })
    const suffix = useWatch({ control: form.control, name: 'suffix' })

    const with_password = useWatch({
        control: form.control,
        name: 'with_password',
    })

    useEffect(() => {
        const fullName = [first_name, middle_name, last_name]
            .filter((name) => name && name.trim() !== '')
            .join(' ')
        form.setValue('full_name', suffix ? `${fullName}, ${suffix}` : fullName)
    }, [first_name, middle_name, last_name, suffix, form])

    const createMutation = useCreateMemberProfileUserAccount({
        onSuccess,
        onError,
    })

    const updateMutation = useUpdateMemberProfileUserAccount({
        onSuccess,
        onError,
    })

    const handleSubmit = (formData: TForm) => {
        const finalPayload: IMemberProfileUserAccountRequest = {
            ...formData,
            birthdate: new Date(formData.birthdate).toISOString(),
        }

        if (userId === undefined)
            return createMutation.mutate({
                memberProfileId,
                data: finalPayload,
            })

        return updateMutation.mutate({
            userId,
            memberProfileId,
            data: finalPayload,
        })
    }

    const {
        isPending: isLoading,
        error,
        reset,
    } = userId ? updateMutation : createMutation

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isLoading || readOnly}
                    className="grid grid-cols-1 gap-x-6 gap-y-8"
                >
                    <fieldset className="space-y-3">
                        <legend>Personal Information</legend>
                        <div className="grid grid-cols-3 gap-x-2">
                            <FormFieldWrapper
                                control={form.control}
                                name="first_name"
                                label="First Name *"
                                className="col-span-1"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id={field.name}
                                        autoComplete="given-name"
                                        placeholder="First Name"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="middle_name"
                                label="Middle Name *"
                                className="col-span-1"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="Middle Name"
                                        autoComplete="additional-name"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="last_name"
                                label="Last Name *"
                                className="col-span-1"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="Last Name"
                                        autoComplete="family-name"
                                    />
                                )}
                            />
                        </div>

                        <FormFieldWrapper
                            control={form.control}
                            name="birthdate"
                            label="Date of Birth *"
                            render={({ field }) => (
                                <Input
                                    type="date"
                                    {...field}
                                    value={field.value ?? ''}
                                    className="block [&::-webkit-calendar-picker-indicator]:hidden"
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="contact_number"
                            label="Contact Number"
                            render={({
                                field,
                                fieldState: { invalid, error },
                            }) => (
                                <div className="relative flex flex-1 items-center gap-x-2">
                                    <VerifiedPatchIcon
                                        className={cn(
                                            'absolute right-2 top-1/2 z-20 size-4 -translate-y-1/2 text-primary delay-300 duration-300 ease-in-out',
                                            (invalid || error) &&
                                                'text-destructive'
                                        )}
                                    />
                                    <PhoneInput
                                        {...field}
                                        className="w-full"
                                        defaultCountry="PH"
                                    />
                                </div>
                            )}
                        />
                    </fieldset>

                    <fieldset className="space-y-3">
                        <legend>Credentials</legend>

                        <FormFieldWrapper
                            control={form.control}
                            name="user_name"
                            label="User Name *"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    autoComplete="username"
                                    placeholder="Username"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="email"
                            label="Email *"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    autoComplete="email"
                                    placeholder="example@email.com"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="password"
                            label={`Password ${!userId ? '*' : ''}`}
                            render={({ field }) => (
                                <FormItem>
                                    <PasswordInput
                                        {...field}
                                        onChange={(e) => {
                                            const inputValue = e.target.value

                                            form.setValue(
                                                'with_password',
                                                inputValue !== undefined &&
                                                    inputValue.length > 0
                                            )

                                            field.onChange(e)
                                        }}
                                        id={field.name}
                                        defaultVisibility
                                        placeholder="+8 Character Password"
                                        autoComplete="new-password"
                                    />
                                    {with_password && (
                                        <ValueChecklistMeter
                                            value={field.value ?? ''}
                                            hideOnComplete
                                            checkList={ChecklistTemplate[
                                                'password-checklist'
                                            ].concat([
                                                {
                                                    regex: /^.{0,50}$/,
                                                    text: 'No more than 50 characters',
                                                },
                                            ])}
                                        />
                                    )}
                                </FormItem>
                            )}
                        />
                    </fieldset>
                </fieldset>
                {userId === undefined && (
                    <div className="grid gap-2">
                        <p className="text-xs text-muted-foreground">
                            Make sure the member agrees to the eCoop{' '}
                            <a className="font-medium underline">
                                terms of service
                            </a>
                            ,{' '}
                            <a className="font-medium underline">
                                privacy policy
                            </a>
                            , and{' '}
                            <a className="font-medium underline">
                                notification settings
                            </a>
                        </p>
                    </div>
                )}
                <div className="mt-4 space-y-2">
                    <FormErrorMessage errorMessage={error} />
                    <div>
                        <Separator className="my-2 sm:my-4" />
                        <fieldset
                            disabled={
                                isLoading || readOnly || !form.formState.isDirty
                            }
                            className="flex items-center justify-end gap-x-2"
                        >
                            <Button
                                size="sm"
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                    reset()
                                    form.reset()
                                }}
                                className="w-full self-end px-8 sm:w-fit"
                            >
                                Reset
                            </Button>
                            <Button
                                size="sm"
                                type="submit"
                                className="w-full self-end px-8 sm:w-fit"
                            >
                                {isLoading ? (
                                    <LoadingSpinner />
                                ) : userId === undefined ? (
                                    'Create'
                                ) : (
                                    'Update'
                                )}
                            </Button>
                        </fieldset>
                    </div>
                </div>
            </form>
        </Form>
    )
}

export const MemberUserAccountCreateUpdateFormModal = ({
    title = 'Setup Member User Account',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<IMemberUserAccountFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            className={cn('w-fit !max-w-7xl', className)}
            {...props}
        >
            <MemberUserAccountCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
                className="mt-4"
            />
        </Modal>
    )
}

export default MemberUserAccountCreateUpdateForm
