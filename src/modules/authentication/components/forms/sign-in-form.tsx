import { Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { FingerprintIcon } from 'lucide-react'

import EcoopLogo from '@/components/ecoop-logo'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import { Input } from '@/components/ui/input'
import PasswordInput from '@/components/ui/password-input'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm } from '@/types'

import { useSignIn } from '../../authentication.service'
import { IAuthContext } from '../../authentication.types'
import { SignInSchema } from '../../authentication.validation'

type TSignIn = z.infer<typeof SignInSchema>

interface ISignInFormProps
    extends IClassProps,
        Omit<IForm<Partial<TSignIn>, IAuthContext>, 'preventExitOnDirty'> {}

const SignInForm = ({ className, ...formProps }: ISignInFormProps) => {
    const {
        mutate,
        error: responseError,
        isPending,
    } = useSignIn({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const form = useForm<TSignIn>({
        resolver: standardSchemaResolver(SignInSchema),
        reValidateMode: 'onChange',
        mode: 'onChange',
        defaultValues: {
            password: '',
            key: '',
            ...formProps.defaultValues,
        },
    })

    const { formRef, handleFocusError, isDisabled } = useFormHelper<TSignIn>({
        form,
        ...formProps,
        autoSave: false,
        preventExitOnDirty: false,
    })

    const onSubmit = form.handleSubmit((data) => {
        mutate(data)
        formProps.onSubmit?.(data)
    }, handleFocusError)

    const error = serverRequestErrExtractor({ error: responseError })

    return (
        <div className=" flex items-center justify-center p-4 w-full">
            <div className="w-full flex justify-center flex-col items-center ">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <EcoopLogo className="w-16 h-16" themeMode="dynamic" />
                </div>

                {/* Welcome heading */}
                <div className="text-center mb-6">
                    <h1 className="text-foreground text-2xl font-semibold mb-2">
                        Welcome back!
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Don't have an account yet?{' '}
                        <Link
                            className="text-primary hover:underline"
                            to={'/auth/sign-up' as string}
                        >
                            Sign up now
                        </Link>
                    </p>
                </div>

                <Form {...form}>
                    <form
                        className={cn('flex flex-col gap-y-4', className)}
                        onSubmit={onSubmit}
                        ref={formRef}
                    >
                        <fieldset
                            className="space-y-4"
                            disabled={isPending || formProps.readOnly}
                        >
                            {/* Email Field */}
                            <FormField
                                control={form.control}
                                name="key"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-foreground text-sm">
                                            Email address
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                autoComplete="email"
                                                className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary rounded-lg h-12"
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                                id={field.name}
                                                placeholder="sample@email.com"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs text-destructive" />
                                    </FormItem>
                                )}
                            />

                            {/* Password Field */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-foreground text-sm">
                                            Password
                                        </FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                {...field}
                                                autoComplete="current-password"
                                                className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary rounded-lg h-12"
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                                id="password-field"
                                                placeholder="••••••••••••••"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs text-destructive" />
                                    </FormItem>
                                )}
                            />

                            {/* Remember me and Forgot password */}
                            <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                        id="remember"
                                    />
                                    <label
                                        className="text-sm text-foreground cursor-pointer"
                                        htmlFor="remember"
                                    >
                                        Remember me
                                    </label>
                                </div>
                                <Link
                                    className="text-sm text-primary hover:underline"
                                    search={{
                                        key: form.getValues('key'),
                                    }}
                                    to={'/auth/forgot-password' as string}
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </fieldset>

                        <div className="mt-6  flex flex-col items-center space-y-4">
                            <FormErrorMessage errorMessage={error} />
                            <Button
                                className="max-w-32 w-full rounded-lg font-medium"
                                disabled={isPending || formProps.readOnly}
                                type="submit"
                            >
                                <FingerprintIcon className="mr-1 size-4" />
                                {isPending ? <LoadingSpinner /> : 'Log in'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default SignInForm
