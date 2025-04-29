import z from 'zod'
import { useForm } from 'react-hook-form'
import { Link } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'

import {
    Form,
    FormItem,
    FormField,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form'
import {
    Select,
    SelectItem,
    SelectValue,
    SelectContent,
    SelectTrigger,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import EcoopLogo from '@/components/ecoop-logo'
import { Button } from '@/components/ui/button'
import PasswordInput from '@/components/ui/password-input'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import FormErrorMessage from '@/components/ui/form-error-message'

import { cn } from '@/lib/utils'
import { signInSchema } from '@/validations'

import { IUserData } from '@/types'
import { IForm } from '@/types/components'
import { IClassProps } from '@/types/components'
import { useSignIn } from '@/hooks/api-hooks/use-auth'

type TSignIn = z.infer<typeof signInSchema>

interface ISignInFormProps
    extends IClassProps,
        IForm<Partial<TSignIn>, IUserData, string> {}

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
            key: '',
            accountType: 'Member',
            ...defaultValues,
        },
    })

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((data) => mutate(data))}
                className={cn(
                    'flex w-full flex-col gap-y-4 sm:w-[390px]',
                    className
                )}
            >
                <div className="flex items-center justify-center gap-x-2 py-4 font-medium">
                    <EcoopLogo className="size-24" />
                    <p className="text-xl">Login to your account</p>
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
                                <FormLabel
                                    htmlFor={field.name}
                                    className="w-full max-w-[90px] text-right font-medium"
                                >
                                    Key
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="Email, contact, or username"
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
                                <FormLabel
                                    htmlFor="password-field"
                                    className="w-full max-w-[90px] text-right font-medium"
                                >
                                    Password
                                </FormLabel>
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
                    <FormField
                        control={form.control}
                        name="accountType"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel
                                    htmlFor="account-type"
                                    className="w-full max-w-[90px] text-right font-medium"
                                >
                                    Account Type
                                </FormLabel>
                                <Select
                                    name={field.name}
                                    defaultValue={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <FormControl id="account-type">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Member">
                                            Member
                                        </SelectItem>
                                        <SelectItem value="Owner">
                                            Owner
                                        </SelectItem>
                                        <SelectItem value="Admin">
                                            Admin
                                        </SelectItem>
                                        <SelectItem value="Employee">
                                            Employee
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                </fieldset>
                <div className="mt-6 flex flex-col space-y-2">
                    <FormErrorMessage errorMessage={error} />
                    <Button type="submit" disabled={isPending || readOnly}>
                        {isPending ? <LoadingSpinner /> : 'Login'}
                    </Button>
                    <Link
                        className="text-sm text-primary"
                        to="/auth/forgot-password"
                        search={{
                            key: form.getValues('key'),
                            accountType: form.getValues('accountType'),
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
