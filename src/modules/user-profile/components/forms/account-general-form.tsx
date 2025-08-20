import { useEffect } from 'react'
import z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { IUserBase } from '@/modules/user/user.types'
import useActionSecurityStore from '@/store/action-security-store'
import { Path, UseFormReturn, useForm } from 'react-hook-form'

import { VerifiedPatchIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import TextEditor from '@/components/text-editor'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { PhoneInput } from '@/components/ui/phone-input'
import { Separator } from '@/components/ui/separator'

import { IClassProps, IForm, TEntityId } from '@/types'

import { useUpdateUserProfileGeneral } from '../../user-profile.service'
import { UserProfileGeneralSchema } from '../../user-profile.validation'

type TAccountGeneralFormValues = z.infer<typeof UserProfileGeneralSchema>

export interface IAccountGeneralFormProps
    extends IClassProps,
        IForm<Partial<TAccountGeneralFormValues>, IUserBase> {
    accountId?: TEntityId
}

export type TFormRef = UseFormReturn<TAccountGeneralFormValues>

const AccountGeneralForm = ({
    readOnly,
    className,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
}: IAccountGeneralFormProps) => {
    const form: TFormRef = useForm<TAccountGeneralFormValues>({
        resolver: zodResolver(UserProfileGeneralSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            user_name: defaultValues?.user_name,
            email: defaultValues?.email,
            description: defaultValues?.description
                ? defaultValues?.description
                : undefined,
        },
    })

    const {
        mutate: update,
        error: rawError,
        isPending,
    } = useUpdateUserProfileGeneral({
        options: {
            onError,
            onSuccess: (userData) => {
                onSuccess?.(userData)
            },
        },
    })

    const descr = form.watch('description')

    console.log('Description changes', descr)

    const error =
        serverRequestErrExtractor({ error: rawError }) ||
        Object.values(form.formState.errors)[0]?.message

    const { onOpenSecurityAction } = useActionSecurityStore()

    const onSubmit = form.handleSubmit((formData) => {
        onOpenSecurityAction({
            title: 'Protected Action',
            description:
                'This action carries significant impact and requires your password for verification.',
            onSuccess: () => update(formData),
        })
    })

    const isDisabled = (field: Path<TAccountGeneralFormValues>) =>
        readOnly || disabledFields?.includes(field) || false

    useEffect(() => {
        form.reset(defaultValues)
    }, [defaultValues, form])

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
                    <fieldset className="space-y-4">
                        <FormFieldWrapper
                            control={form.control}
                            name="user_name"
                            label="Username"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Username"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="description"
                            label="Bio / About"
                            render={({ field }) => (
                                <TextEditor
                                    {...field}
                                    content={field.value}
                                    textEditorClassName="w-full !max-w-full"
                                    placeholder="Write short description about yourself"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormFieldWrapper
                                control={form.control}
                                name="email"
                                label="Email"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="Email"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                name="contact_number"
                                label="Contact Number"
                                render={({
                                    field,
                                    fieldState: { error, invalid },
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
                        </div>
                    </fieldset>
                </fieldset>
                <FormErrorMessage errorMessage={error} />
                {form.formState.isDirty && (
                    <div>
                        <Separator className="my-2 sm:my-4" />
                        <div className="flex items-center justify-end gap-x-2">
                            <Button
                                size="sm"
                                type="button"
                                variant="ghost"
                                onClick={() => form.reset()}
                                className="w-full self-end px-4 sm:w-fit"
                            >
                                Reset
                            </Button>
                            <Button
                                size="sm"
                                type="submit"
                                disabled={isPending}
                                className="w-full self-end px-4 sm:w-fit"
                            >
                                {isPending ? <LoadingSpinner /> : 'Update'}
                            </Button>
                        </div>
                    </div>
                )}
            </form>
        </Form>
    )
}

export default AccountGeneralForm
