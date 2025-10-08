import { Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'

import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
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
        <Form {...form}>
            <form
                className={cn('flex w-full flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <div className="flex items-center gap-x-2 py-4 font-medium">
                    <p className="text-lg font-medium md:text-5xl">Sign In</p>
                </div>
                <fieldset
                    className="space-y-3"
                    disabled={isPending || formProps.readOnly}
                >
                    <FormField
                        control={form.control}
                        name="key"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormControl>
                                    <Input
                                        {...field}
                                        autoComplete="off"
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        placeholder="Email Address"
                                    />
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                    <Link
                        className="mt-4 text-right text-sm text-muted-foreground hover:text-foreground hover:underline"
                        search={{
                            key: form.getValues('key'),
                        }}
                        to={'/auth/forgot-password' as string}
                    >
                        Forgot Password
                    </Link>
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormControl>
                                    <PasswordInput
                                        {...field}
                                        autoComplete="off"
                                        disabled={isDisabled(field.name)}
                                        id="password-field"
                                        placeholder="Password"
                                    />
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                </fieldset>
                <div className="mt-6 flex flex-col space-y-2">
                    <FormErrorMessage errorMessage={error} />
                    <Button
                        className="w-full max-w-xl rounded-3xl"
                        disabled={isPending || formProps.readOnly}
                        size="sm"
                        type="submit"
                    >
                        {isPending ? <LoadingSpinner /> : 'Login'}
                    </Button>

                    <span className="my-5">
                        New to Ecoop?{' '}
                        <Link
                            className="mt-2 hover:text-foreground hover:underline"
                            to={'/auth/sign-up' as string}
                        >
                            <span className="text-primary">
                                Sign up for an account
                            </span>
                        </Link>
                    </span>
                </div>
            </form>
        </Form>
    )
}

export default SignInForm
