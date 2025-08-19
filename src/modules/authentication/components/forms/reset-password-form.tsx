import z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { useForm } from 'react-hook-form'

import { KeyIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import PasswordInput from '@/components/ui/password-input'

import { IForm } from '@/types'

import { useChangePassword } from '../../authentication.service'
import { ResetPasswordSchema } from '../../authentication.validation'
import {
    ChecklistTemplate,
    ValueChecklistMeter,
} from '../value-checklist-indicator'

type TResetPasswordForm = z.infer<typeof ResetPasswordSchema>

interface Props extends IForm<TResetPasswordForm, void> {
    resetId: string
}

const ResetPasswordForm = ({
    resetId,
    readOnly,
    className,
    defaultValues = { new_password: '', confirm_password: '' },
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
        error: responseError,
    } = useChangePassword({
        options: {
            onError,
            onSuccess,
        },
    })

    const firstError = Object.values(form.formState.errors)[0]?.message
    const error = serverRequestErrExtractor({ error: responseError })

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((data) =>
                    changePassword({ ...data, resetId: resetId })
                )}
                className={cn(
                    'flex w-full flex-col gap-y-4 sm:w-[390px]',
                    className
                )}
                autoComplete="off"
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
                    <FormFieldWrapper
                        control={form.control}
                        name="new_password"
                        render={({ field }) => (
                            <FormItem>
                                <PasswordInput
                                    {...field}
                                    id={field.name}
                                    placeholder="+8 Character Password"
                                />
                                <ValueChecklistMeter
                                    value={field.value}
                                    hideOnComplete
                                    checkList={ChecklistTemplate[
                                        'password-checklist'
                                    ].concat([
                                        {
                                            regex: /^.{0,50}$/,
                                            text: 'No more than 50 characters',
                                        },
                                    ])}
                                />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirm_password"
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
                                        placeholder="Confirm Password"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </fieldset>

                <div className="mt-4 flex flex-col space-y-2">
                    <FormErrorMessage errorMessage={firstError || error} />
                    <Button
                        size="sm"
                        type="submit"
                        disabled={isPending || readOnly}
                    >
                        {isPending ? <LoadingSpinner /> : 'Save Password'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default ResetPasswordForm
