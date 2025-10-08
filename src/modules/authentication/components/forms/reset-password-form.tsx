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
    FormLabel,
} from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import PasswordInput from '@/components/ui/password-input'

import { useFormHelper } from '@/hooks/use-form-helper'

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

const ResetPasswordForm = ({ resetId, className, ...formProps }: Props) => {
    const form = useForm<TResetPasswordForm>({
        resolver: standardSchemaResolver(ResetPasswordSchema),
        reValidateMode: 'onChange',
        mode: 'onChange',
        defaultValues: {
            new_password: '',
            confirm_password: '',
            ...formProps.defaultValues,
        },
    })

    const {
        mutate: changePassword,
        isPending,
        error: responseError,
    } = useChangePassword({
        options: {
            onError: formProps.onError,
            onSuccess: formProps.onSuccess,
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TResetPasswordForm>({
            form,
            ...formProps,
            autoSave: false,
            preventExitOnDirty: true,
        })

    const onSubmit = form.handleSubmit(
        (data) => changePassword({ ...data, resetId: resetId }),
        handleFocusError
    )

    const firstError = Object.values(form.formState.errors)[0]?.message
    const error = serverRequestErrExtractor({ error: responseError })

    return (
        <Form {...form}>
            <form
                autoComplete="off"
                className={cn(
                    'flex w-full flex-col gap-y-4 sm:w-[390px]',
                    className
                )}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <div className="flex flex-col items-center gap-y-4 py-4 text-center">
                    <div className="relative p-8">
                        <KeyIcon className="size-[53px] text-primary" />
                        <div className="absolute inset-0 rounded-full bg-primary/20" />
                        <div className="absolute inset-5 rounded-full bg-primary/20" />
                    </div>
                    <p className="text-xl font-medium">Set new password</p>
                    <p className="px-10 text-sm text-foreground/70">
                        Set a new password for your account, make sure to use a
                        strong password.
                    </p>
                </div>
                <fieldset
                    className="space-y-4"
                    disabled={isPending || formProps.readOnly}
                >
                    <FormFieldWrapper
                        control={form.control}
                        name="new_password"
                        render={({ field }) => (
                            <FormItem>
                                <PasswordInput
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="+8 Character Password"
                                />
                                <ValueChecklistMeter
                                    checkList={ChecklistTemplate[
                                        'password-checklist'
                                    ].concat([
                                        {
                                            regex: /^.{0,50}$/,
                                            text: 'No more than 50 characters',
                                        },
                                    ])}
                                    hideOnComplete
                                    value={field.value}
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
                                    className="font-medium"
                                    htmlFor={field.name}
                                >
                                    Confirm Password
                                </FormLabel>
                                <FormControl>
                                    <PasswordInput
                                        {...field}
                                        disabled={isDisabled(field.name)}
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
                        disabled={isPending || formProps.readOnly}
                        size="sm"
                        type="submit"
                    >
                        {isPending ? <LoadingSpinner /> : 'Save Password'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default ResetPasswordForm
