import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form'
import { KeyIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import PasswordInput from '@/components/ui/password-input'
import FormErrorMessage from '@/components/ui/form-error-message'
import LoadingSpinner from '@/components/spinners/loading-spinner'

import { cn } from '@/lib/utils'
import { IAuthForm } from '@/types/components'
import { useChangePassword } from '@/hooks/api-hooks/use-auth'
import { ResetPasswordSchema } from '@/validations/form-validation/reset-password-schema'

type TResetPasswordForm = z.infer<typeof ResetPasswordSchema>

interface Props extends IAuthForm<TResetPasswordForm, void> {
    resetId: string
}

const ResetPasswordForm = ({
    resetId,
    readOnly,
    className,
    defaultValues = { newPassword: '', confirmPassword: '' },
    onError,
    onSuccess,
}: Props) => {
    const form = useForm<TResetPasswordForm>({
        resolver: zodResolver(ResetPasswordSchema),
        reValidateMode: 'onChange',
        mode: 'onChange',
        defaultValues,
    })

    const {
        mutate: changePassword,
        isPending,
        error,
    } = useChangePassword({
        onError,
        onSuccess,
    })

    const firstError = Object.values(form.formState.errors)[0]?.message

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((data) =>
                    changePassword({ ...data, resetId })
                )}
                className={cn(
                    'flex w-full flex-col gap-y-4 sm:w-[390px]',
                    className
                )}
            >
                <div className="flex flex-col items-center gap-y-4 py-4 text-center">
                    <div className="relative p-8">
                        <KeyIcon className="size-[53px] text-green-500" />
                        <div className="absolute inset-0 rounded-full bg-green-500/20" />
                        <div className="absolute inset-5 rounded-full bg-green-500/20" />
                    </div>
                    <p className="text-xl font-medium">Set new password</p>
                    <p className="px-10 text-sm text-foreground/70">
                        Set a new password for your account, make sure to use a
                        strong password.
                    </p>
                </div>
                <fieldset
                    disabled={isPending || readOnly}
                    className="space-y-4"
                >
                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem className="min-w-[277px]">
                                <FormLabel
                                    htmlFor={field.name}
                                    className="font-medium"
                                >
                                    Password
                                </FormLabel>
                                <FormControl>
                                    <PasswordInput
                                        {...field}
                                        id={field.name}
                                        placeholder="Password"
                                        autoComplete="no"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem className="min-w-[277px]">
                                <FormLabel
                                    htmlFor={field.name}
                                    className="font-medium"
                                >
                                    Confirm Password
                                </FormLabel>
                                <FormControl>
                                    <PasswordInput
                                        {...field}
                                        id={field.name}
                                        autoComplete="false"
                                        placeholder="Confirm Password"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </fieldset>

                <div className="mt-4 flex flex-col space-y-2">
                    <FormErrorMessage errorMessage={firstError || error} />
                    <Button type="submit" disabled={isPending || readOnly}>
                        {isPending ? <LoadingSpinner /> : 'Save Password'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default ResetPasswordForm
