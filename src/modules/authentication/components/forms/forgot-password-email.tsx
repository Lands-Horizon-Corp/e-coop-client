import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'

import { KeyIcon } from '@/components/icons'
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

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm } from '@/types'

import { useForgotPassword } from '../../authentication.service'

const forgotPasswordFormSchema = z.object({
    key: z.string().min(1, 'Please provide Email, Number or Email'),
})

export type TForgotPasswordEmail = z.infer<typeof forgotPasswordFormSchema>

interface IForgotPasswordEmailFormProps
    extends IClassProps,
        IForm<Partial<TForgotPasswordEmail>, TForgotPasswordEmail> {}

const ForgotPasswordEmail = ({
    className,
    ...formProps
}: IForgotPasswordEmailFormProps) => {
    const form = useForm<TForgotPasswordEmail>({
        resolver: standardSchemaResolver(forgotPasswordFormSchema),
        reValidateMode: 'onChange',
        mode: 'onChange',
        defaultValues: {
            key: '',
            ...formProps.defaultValues,
        },
    })

    const {
        mutate: onFormSubmit,
        error: responseError,
        isPending: isLoading,
    } = useForgotPassword({
        options: {
            onError: formProps.onError,
            onSuccess: formProps.onSuccess,
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TForgotPasswordEmail>({
            form,
            ...formProps,
            autoSave: false,
            preventExitOnDirty: false,
        })

    const onSubmit = form.handleSubmit(
        (formData) => onFormSubmit(formData),
        handleFocusError
    )

    const error = serverRequestErrExtractor({ error: responseError })

    return (
        <Form {...form}>
            <form
                ref={formRef}
                onSubmit={onSubmit}
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
                    disabled={isLoading || formProps.readOnly}
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
                                            disabled={isDisabled(field.name)}
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
                        disabled={isLoading || formProps.readOnly}
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
