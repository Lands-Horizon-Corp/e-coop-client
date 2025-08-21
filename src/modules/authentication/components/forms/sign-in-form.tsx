import { Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

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

import { IClassProps, IForm } from '@/types'

import { useSignIn } from '../../authentication.service'
import { IAuthContext } from '../../authentication.types'
import { SignInSchema } from '../../authentication.validation'

type TSignIn = z.infer<typeof SignInSchema>

interface ISignInFormProps
    extends IClassProps,
        IForm<Partial<TSignIn>, IAuthContext> {}

const SignInForm = ({
    readOnly,
    className,
    defaultValues,
    onError,
    onSubmit,
    onSuccess,
}: ISignInFormProps) => {
    const {
        mutate,
        error: responseError,
        isPending,
    } = useSignIn({
        options: {
            onSuccess,
            onError,
        },
    })

    const form = useForm<TSignIn>({
        resolver: zodResolver(SignInSchema),
        reValidateMode: 'onChange',
        mode: 'onChange',
        defaultValues: {
            password: '',
            key: '',
            ...defaultValues,
        },
    })

    const error = serverRequestErrExtractor({ error: responseError })

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((data) => {
                    mutate(data)
                    onSubmit?.(data)
                })}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <div className="flex items-center gap-x-2 py-4 font-medium">
                    <p className="text-lg font-medium md:text-5xl">Sign In</p>
                </div>
                <fieldset
                    disabled={isPending || readOnly}
                    className="space-y-3"
                >
                    <FormField
                        control={form.control}
                        name="key"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormControl>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="Email Address"
                                        autoComplete="off"
                                    />
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormControl>
                                    <PasswordInput
                                        {...field}
                                        id="password-field"
                                        autoComplete="off"
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
                        size="sm"
                        type="submit"
                        className="w-full max-w-xl rounded-3xl"
                        disabled={isPending || readOnly}
                    >
                        {isPending ? <LoadingSpinner /> : 'Login'}
                    </Button>
                    <Link
                        className="mt-4 text-sm text-muted-foreground hover:text-foreground hover:underline"
                        to={'/auth/forgot-password' as string}
                        search={{
                            key: form.getValues('key'),
                        }}
                    >
                        Forgot Password
                    </Link>
                </div>
            </form>
        </Form>
    )
}

export default SignInForm
