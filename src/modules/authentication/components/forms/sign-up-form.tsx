import { useEffect } from 'react'

import { Link } from '@tanstack/react-router'
import { useForm, useWatch } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'

import { VerifiedPatchIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormItem } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import PasswordInput from '@/components/ui/password-input'
import { PhoneInput } from '@/components/ui/phone-input'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm } from '@/types'

import { useSignUp } from '../../authentication.service'
import { IAuthContext, ISignUpRequest } from '../../authentication.types'
import { SignUpSchema } from '../../authentication.validation'
import {
    ChecklistTemplate,
    ValueChecklistMeter,
} from '../value-checklist-indicator'

type TSignUpForm = z.infer<typeof SignUpSchema>

interface ISignUpFormProps
    extends IClassProps,
        IForm<Partial<ISignUpRequest>, IAuthContext> {}

const SignUpForm = ({ className, ...formProps }: ISignUpFormProps) => {
    const form = useForm<TSignUpForm>({
        resolver: standardSchemaResolver(SignUpSchema),
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
            ...formProps.defaultValues,
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TSignUpForm>({
            form,
            ...formProps,
            autoSave: false,
            preventExitOnDirty: true,
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
        error: rawError,
        isPending: isLoading,
        mutate: signUp,
    } = useSignUp({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const onSubmit = form.handleSubmit(
        (formData) =>
            signUp({
                ...formData,
                birthdate: new Date(formData.birthdate).toISOString(),
            }),
        handleFocusError
    )

    const error = serverRequestErrExtractor({ error: rawError })

    return (
        <Form {...form}>
            <form
                className={cn('flex w-full flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <div className="flex items-center gap-x-2 pt-2 font-medium sm:pb-4">
                    <p className="text-2xl md:text-5xl">Sign Up</p>
                </div>
                <fieldset
                    className="grid grid-cols-1 gap-x-6 gap-y-8"
                    disabled={isLoading || formProps.readOnly}
                >
                    <fieldset className="space-y-3">
                        <legend>Personal Information</legend>
                        <div className="grid grid-cols-3 gap-x-2">
                            <FormFieldWrapper
                                className="col-span-1"
                                control={form.control}
                                name="first_name"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        autoComplete="given-name"
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        onKeyDown={(e) => {
                                            const allowed = /^[a-zA-Z\s]$/
                                            if (
                                                e.key.length === 1 &&
                                                !allowed.test(e.key)
                                            ) {
                                                e.preventDefault()
                                            }
                                        }}
                                        placeholder="First Name"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                className="col-span-1"
                                control={form.control}
                                name="middle_name"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        autoComplete="additional-name"
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        onKeyDown={(e) => {
                                            const allowed = /^[a-zA-Z\s]$/
                                            if (
                                                e.key.length === 1 &&
                                                !allowed.test(e.key)
                                            ) {
                                                e.preventDefault()
                                            }
                                        }}
                                        placeholder="Middle Name"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                className="col-span-1"
                                control={form.control}
                                name="last_name"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        autoComplete="family-name"
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        onKeyDown={(e) => {
                                            const allowed = /^[a-zA-Z\s]$/
                                            if (
                                                e.key.length === 1 &&
                                                !allowed.test(e.key)
                                            ) {
                                                e.preventDefault()
                                            }
                                        }}
                                        placeholder="Last Name"
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
                                    autoComplete="name"
                                    disabled
                                    id={field.name}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            className="relative"
                            control={form.control}
                            description="mm/dd/yyyy"
                            descriptionClassName="absolute top-0 right-0"
                            label="Date of Birth *"
                            name="birthdate"
                            render={({ field }) => (
                                <InputDate
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    value={field.value ?? ''}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Contact Number *"
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
                                        disabled={isDisabled(field.name)}
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
                                    autoComplete="username"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
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
                                    autoComplete="email"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
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
                                        autoComplete="new-password"
                                        defaultVisibility
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        placeholder="+8 Character Password"
                                    />
                                    <ValueChecklistMeter
                                        checkList={ChecklistTemplate[
                                            'password-checklist'
                                        ].concat([
                                            {
                                                regex: /^.{0,50}$/,
                                                text: 'No more than 50 characters',
                                            },
                                        ])}
                                        hideOnComplete
                                        value={field.value}
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
                                    checked={field.value}
                                    className="order-0 z-0 after:absolute after:inset-0"
                                    disabled={
                                        isLoading ||
                                        formProps.readOnly ||
                                        isDisabled(field.name)
                                    }
                                    id={field.name}
                                    name={field.name}
                                    onCheckedChange={field.onChange}
                                />
                                <div
                                    className="grid gap-2 z-10"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <p className="text-xs text-muted-foreground">
                                        I agree to lands horizon - e coop suite{' '}
                                        <Link
                                            className="underline underline-offset-4 text-primary/70"
                                            rel="noopener noreferrer"
                                            target="_blank"
                                            to={
                                                '/policy/terms-and-condition' as string
                                            }
                                        >
                                            terms and condition
                                        </Link>
                                        ,{' '}
                                        <Link
                                            className="underline underline-offset-4 text-primary/70"
                                            rel="noopener noreferrer"
                                            target="_blank"
                                            to={
                                                '/policy/privacy-policy' as string
                                            }
                                        >
                                            privacy policy and data privacy.
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </FormItem>
                    )}
                />
                <div className="mt-4 flex flex-col items-center space-y-2">
                    <FormErrorMessage errorMessage={error} />
                    <Button
                        className="w-full max-w-xl rounded-3xl"
                        disabled={isLoading || formProps.readOnly}
                        size="sm"
                        type="submit"
                    >
                        {isLoading ? <LoadingSpinner /> : 'Submit'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default SignUpForm
