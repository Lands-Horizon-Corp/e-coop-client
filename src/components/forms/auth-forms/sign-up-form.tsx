import { useEffect } from 'react'
import z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { toReadableDate } from '@/utils'
import { useForm, useWatch } from 'react-hook-form'

import { PhoneInput } from '@/components/contact-input/contact-input'
import { VerifiedPatchIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormItem } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import PasswordInput from '@/components/ui/password-input'
import {
    ChecklistTemplate,
    ValueChecklistMeter,
} from '@/components/value-checklist-indicator'

import { cn } from '@/lib/utils'

import { signUpSchema } from '@/validations/form-validation/sign-up-schema'

import { useSignUp } from '@/hooks/api-hooks/use-auth'

import { IAuthContext, IClassProps, IForm, ISignUpRequest } from '@/types'

type TSignUpForm = z.infer<typeof signUpSchema>

interface ISignUpFormProps
    extends IClassProps,
        IForm<Partial<ISignUpRequest>, IAuthContext, string> {}

const SignUpForm = ({
    readOnly,
    className,
    defaultValues,
    onError,
    onSuccess,
}: ISignUpFormProps) => {
    const form = useForm<TSignUpForm>({
        resolver: zodResolver(signUpSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            email: '',
            user_name: '',
            first_name: '',
            last_name: '',
            full_name: '',
            birthdate: toReadableDate(new Date(), 'yyyy-MM-dd'),
            contact_number: '',
            password: '',
            accept_terms: false,
            middle_name: '',
            suffix: '',
            ...defaultValues,
        },
    })

    const first_name = useWatch({ control: form.control, name: 'first_name' })
    const middle_name = useWatch({ control: form.control, name: 'middle_name' })
    const last_name = useWatch({ control: form.control, name: 'last_name' })
    const suffix = useWatch({ control: form.control, name: 'suffix' })

    useEffect(() => {
        const fullName = [first_name, middle_name, last_name]
            .filter((name) => name && name.trim() !== '')
            .join(' ')
        form.setValue('full_name', suffix ? `${fullName}, ${suffix}` : fullName)
    }, [first_name, middle_name, last_name, suffix, form])

    const {
        error,
        isPending: isLoading,
        mutate: signUp,
    } = useSignUp({ onSuccess, onError })

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((formData) =>
                    signUp({
                        ...formData,
                        birthdate: new Date(formData.birthdate).toISOString(),
                    })
                )}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <div className="flex items-center gap-x-2 pt-2 font-medium sm:pb-4">
                    <p className="text-2xl md:text-5xl">Sign Up</p>
                </div>
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
                            name="full_name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    disabled
                                    autoComplete="name"
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="birthdate"
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
                            render={({ field }) => (
                                <FormItem>
                                    <PasswordInput
                                        {...field}
                                        id={field.name}
                                        defaultVisibility
                                        placeholder="+8 Character Password"
                                        autoComplete="new-password"
                                    />
                                    <ValueChecklistMeter
                                        value={field.value}
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
                                </FormItem>
                            )}
                        />
                    </fieldset>
                </fieldset>
                <FormFieldWrapper
                    control={form.control}
                    name="accept_terms"
                    render={({ field }) => (
                        <FormItem className="col-span-3">
                            <div className="shadow-xs relative flex w-full items-start gap-2 rounded-xl outline-none duration-300 ease-in-out has-[:checked]:bg-primary/10 has-[:checked]:p-4">
                                <Checkbox
                                    id={field.name}
                                    name={field.name}
                                    checked={field.value}
                                    disabled={isLoading || readOnly}
                                    onCheckedChange={field.onChange}
                                    className="order-0 after:absolute after:inset-0"
                                />
                                <div className="grid gap-2">
                                    <p className="text-xs text-muted-foreground">
                                        I agree to the eCoop{' '}
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
                            </div>
                        </FormItem>
                    )}
                />
                <div className="mt-4 flex flex-col items-center space-y-2">
                    <FormErrorMessage errorMessage={error} />
                    <Button
                        size="sm"
                        type="submit"
                        className="w-full max-w-xl rounded-3xl"
                        disabled={isLoading || readOnly}
                    >
                        {isLoading ? <LoadingSpinner /> : 'Submit'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default SignUpForm
