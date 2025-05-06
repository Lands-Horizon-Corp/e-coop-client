import z from 'zod'
import { useForm } from 'react-hook-form'
import { Link } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'

import {
    Form,
    FormItem,
    FormField,
    FormControl,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import PasswordInput from '@/components/ui/password-input'
import FormErrorMessage from '@/components/ui/form-error-message'
import LoadingSpinner from '@/components/spinners/loading-spinner'

import { cn } from '@/lib/utils'
import { signInSchema } from '@/validations'

import { IForm, IClassProps, IAuthContext } from '@/types'
import { useSignIn } from '@/hooks/api-hooks/use-auth'

type TSignIn = z.infer<typeof signInSchema>

interface ISignInFormProps
    extends IClassProps,
        IForm<Partial<TSignIn>, IAuthContext, string> {}

const SignInForm = ({
    readOnly,
    className,
    defaultValues,
    onError,
    onSuccess,
}: ISignInFormProps) => {
    const { mutate, error, isPending } = useSignIn({ onSuccess, onError })

    const form = useForm<TSignIn>({
        resolver: zodResolver(signInSchema),
        reValidateMode: 'onChange',
        mode: 'onChange',
        defaultValues: {
            password: '',
            email: '',
            ...defaultValues,
        },
    })

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((data) => mutate(data))}
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
                        name="email"
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
                            email: form.getValues('email'),
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
