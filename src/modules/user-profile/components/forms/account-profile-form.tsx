import { useEffect } from 'react'
import z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import useActionSecurityStore from '@/store/action-security-store'
import { Path, useForm } from 'react-hook-form'

import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

import { IClassProps, IForm } from '@/types'

import { IUserBase } from '../../../user/user.types'
import { useUpdateUserProfile } from '../../user-profile.service'
import { UserProfileSchema } from '../../user-profile.validation'

type TAccountProfileFormValues = z.infer<typeof UserProfileSchema>

export interface IAccountProfileFormProps
    extends IClassProps,
        IForm<Partial<TAccountProfileFormValues>, IUserBase> {}

const AccountProfileForm = ({
    readOnly,
    className,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
}: IAccountProfileFormProps) => {
    const form = useForm<TAccountProfileFormValues>({
        resolver: zodResolver(UserProfileSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            first_name: '',
            middle_name: '',
            last_name: '',
            suffix: '',
            ...defaultValues,
        },
    })

    const {
        isPending,
        error: rawError,
        mutate,
    } = useUpdateUserProfile({
        options: {
            onError,
            onSuccess: (newData) => {
                onSuccess?.(newData)
            },
        },
    })

    const { onOpenSecurityAction } = useActionSecurityStore()

    const onSubmit = form.handleSubmit((formData) => {
        onOpenSecurityAction({
            title: 'Protected Action',
            description:
                'This action carries significant impact and requires your password for verification.',
            onSuccess: () => mutate(formData),
        })
    })

    const error = serverRequestErrExtractor({ error: rawError })

    const isDisabled = (field: Path<TAccountProfileFormValues>) =>
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
                            name="first_name"
                            label="First Name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="First Name"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="middle_name"
                            label="Middle Name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Middle Name"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="last_name"
                            label="Last Name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Last Name"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="suffix"
                            label="Suffix"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Suffix"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                    </fieldset>
                </fieldset>
                <FormErrorMessage errorMessage={error} />
                <div>
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
                </div>
            </form>
        </Form>
    )
}

export default AccountProfileForm
