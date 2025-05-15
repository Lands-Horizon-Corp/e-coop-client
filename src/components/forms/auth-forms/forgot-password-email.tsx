import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
    Form,
    FormItem,
    FormField,
    FormControl,
    FormMessage,
} from '@/components/ui/form'

import { KeyIcon } from '@/components/icons'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import FormErrorMessage from '@/components/ui/form-error-message'
import LoadingSpinner from '@/components/spinners/loading-spinner'

import { cn } from '@/lib/utils'
import { IForm, IClassProps } from '@/types'
import { useForgotPassword } from '@/hooks/api-hooks/use-auth'

const forgotPasswordFormSchema = z.object({
    key: z.string().min(1, 'Please provide Email, Number or Email'),
})

export type TForgotPasswordEmail = z.infer<typeof forgotPasswordFormSchema>

interface IForgotPasswordEmailFormProps
    extends IClassProps,
        IForm<Partial<TForgotPasswordEmail>, TForgotPasswordEmail, string> {}

const ForgotPasswordEmail = ({
    readOnly,
    className,
    defaultValues,
    onError,
    onSuccess,
}: IForgotPasswordEmailFormProps) => {
    const form = useForm<TForgotPasswordEmail>({
        resolver: zodResolver(forgotPasswordFormSchema),
        reValidateMode: 'onChange',
        mode: 'onChange',
        defaultValues: {
            key: '',
            ...defaultValues,
        },
    })

    const {
        mutate: onFormSubmit,
        error,
        isPending: isLoading,
    } = useForgotPassword({
        onError,
        onSuccess,
    })

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((formData) =>
                    onFormSubmit(formData)
                )}
                className={cn(
                    'flex w-full flex-col gap-y-4 sm:w-[390px]',
                    className
                )}
            >
                <div className="flex flex-col items-center gap-y-4 py-4 text-center">
                    <div className="relative p-8">
                        <KeyIcon className="size-[53px] text-[#FF7E47]" />
                        <div className="absolute inset-0 rounded-full bg-[#FF7E47]/20" />
                        <div className="absolute inset-5 rounded-full bg-[#FF7E47]/20" />
                    </div>
                    <p className="text-xl font-medium">Forgot Password?</p>
                    <p className="text-sm text-foreground/70">
                        Enter your registered email address to receive a link to
                        reset your password.
                    </p>
                </div>
                <fieldset
                    disabled={isLoading || readOnly}
                    className="space-y-4"
                >
                    <FormField
                        name="key"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormControl>
                                    <div className="flex-1 space-y-2">
                                        <Input
                                            {...field}
                                            id={field.name}
                                            autoComplete="off"
                                            placeholder="Email address"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </fieldset>

                <div className="mt-4 flex flex-col space-y-2">
                    <FormErrorMessage errorMessage={error} />
                    <Button
                        size="sm"
                        type="submit"
                        disabled={isLoading || readOnly}
                        className="w-full max-w-xl rounded-3xl"
                    >
                        {isLoading ? <LoadingSpinner /> : 'Send Code to Email'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default ForgotPasswordEmail
