import z from 'zod'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

import {
    Form,
    FormItem,
    FormLabel,
    FormField,
    FormControl,
    FormDescription,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { CheckIcon, CloseIcon } from '@/components/icons'
import PasswordInput from '@/components/ui/password-input'
import FormErrorMessage from '@/components/ui/form-error-message'
import LoadingSpinner from '@/components/spinners/loading-spinner'

import { passwordSchema } from '@/validations/common'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUpdateAccountPassword } from '@/hooks/api-hooks/use-account'

interface Props {
    onSave?: () => void
}

const contactOptionSchema = z
    .object({
        PreviousPassword: passwordSchema,
        NewPassword: passwordSchema,
        ConfirmPassword: passwordSchema,
    })
    .refine(
        ({ NewPassword, ConfirmPassword }) => NewPassword === ConfirmPassword,
        {
            message: "Password doesn't match",
            path: ['confirm_password'],
        }
    )

const PasswordOption = ({ onSave }: Props) => {
    const form = useForm<z.infer<typeof contactOptionSchema>>({
        resolver: zodResolver(contactOptionSchema),
        reValidateMode: 'onChange',
        defaultValues: {
            ConfirmPassword: '',
            NewPassword: '',
            PreviousPassword: '',
        },
    })

    const { isPending, mutate: updatePassword } = useUpdateAccountPassword({
        onSuccess: onSave,
    })

    const hasChanges = form.formState.isDirty

    const firstError = Object.values(form.formState.errors)[0]?.message

    const handleReset = useCallback(() => {
        form.reset()
    }, [form])

    return (
        <>
            <Form {...form}>
                <form
                    className="w-full space-y-2"
                    onSubmit={form.handleSubmit((data) => updatePassword(data))}
                >
                    <div className="space-y-1">
                        <FormLabel
                            htmlFor="PreviousPassword"
                            className="font-normal text-foreground/80"
                        >
                            Password
                        </FormLabel>
                        <FormDescription className="text-xs">
                            Update or change your password. Your password is at
                            least 8 characters
                        </FormDescription>
                    </div>
                    <fieldset
                        disabled={isPending}
                        className="grid gap-x-2 gap-y-4 pt-4 sm:grid-cols-3"
                    >
                        <FormField
                            control={form.control}
                            name="PreviousPassword"
                            render={({ field }) => (
                                <FormItem className="grid w-full gap-y-0 sm:gap-y-2">
                                    <FormLabel
                                        htmlFor={field.name}
                                        className="text-sm font-normal text-foreground/80"
                                    >
                                        Previous Password
                                    </FormLabel>
                                    <FormControl>
                                        <PasswordInput
                                            {...field}
                                            data-1p-ignore
                                            id={field.name}
                                            autoComplete="off"
                                            data-lpignore="true"
                                            placeholder="Previous Password"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="NewPassword"
                            render={({ field }) => (
                                <FormItem className="grid w-full gap-y-0 sm:gap-y-2">
                                    <FormLabel
                                        htmlFor={field.name}
                                        className="text-sm font-normal text-foreground/80"
                                    >
                                        New Password
                                    </FormLabel>
                                    <FormControl>
                                        <PasswordInput
                                            {...field}
                                            id={field.name}
                                            placeholder="New Password"
                                            autoComplete="new-password"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="ConfirmPassword"
                            render={({ field }) => (
                                <FormItem className="grid w-full gap-y-0 sm:gap-y-2">
                                    <FormLabel
                                        htmlFor={field.name}
                                        className="text-sm font-normal text-foreground/80"
                                    >
                                        Confirm Password
                                    </FormLabel>
                                    <FormControl>
                                        <PasswordInput
                                            {...field}
                                            id={field.name}
                                            placeholder="Confirm Password"
                                            autoComplete="new-password"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </fieldset>
                    <FormErrorMessage errorMessage={firstError} />
                    <div className="flex items-center justify-end gap-x-1">
                        {hasChanges && !isPending && (
                            <>
                                <Button
                                    size="sm"
                                    type="reset"
                                    variant="secondary"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        handleReset()
                                    }}
                                >
                                    <CloseIcon />
                                </Button>
                                <Button type="submit" size="sm">
                                    <CheckIcon />
                                </Button>
                            </>
                        )}
                        {isPending && (
                            <span className="text-xs text-foreground/70">
                                <LoadingSpinner className="mr-1 inline-block size-3" />{' '}
                                Saving...
                            </span>
                        )}
                    </div>
                </form>
            </Form>
        </>
    )
}

export default PasswordOption
