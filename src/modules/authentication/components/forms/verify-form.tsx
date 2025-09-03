import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { IUserBase } from '@/modules/user'
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp'

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
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from '@/components/ui/input-otp'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IForm } from '@/types'

import { useVerify } from '../../authentication.service'
import { OTPSchema, TOTPSchema } from '../../authentication.validation'
import ResendVerifyContactButton from '../resend-verify-button'

type TVerifyForm = TOTPSchema

interface Props extends IForm<TVerifyForm, IUserBase> {
    verifyMode: 'mobile' | 'email'
    onSkip?: () => void
}

const VerifyForm = ({
    className,
    verifyMode = 'mobile',
    onSkip,
    ...formProps
}: Props) => {
    const form = useForm<TVerifyForm>({
        resolver: standardSchemaResolver(OTPSchema),
        reValidateMode: 'onChange',
        defaultValues: {
            otp: '',
            ...formProps.defaultValues,
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TVerifyForm>({
            form,
            ...formProps,
            autoSave: false,
            preventExitOnDirty: true,
        })

    const {
        mutate: handleVerify,
        isPending,
        error: rawError,
    } = useVerify({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const onSubmit = form.handleSubmit(
        (data) => handleVerify({ ...data, verifyMode }),
        handleFocusError
    )

    const error = serverRequestErrExtractor({ error: rawError })

    return (
        <>
            <Form {...form}>
                <form
                    ref={formRef}
                    onSubmit={onSubmit}
                    className={cn(
                        'flex min-w-[380px] flex-col gap-y-4',
                        className
                    )}
                >
                    <div className="flex flex-col items-center justify-center gap-y-4 pt-4">
                        <p className="text-xl font-medium">
                            Verify your{' '}
                            {verifyMode === 'mobile'
                                ? 'OTP Account'
                                : 'Email Address'}
                        </p>
                        <p className="max-w-[320px] text-center text-foreground/80">
                            Enter the one time password sent to your{' '}
                            {verifyMode === 'mobile'
                                ? 'Mobile Number'
                                : 'Email'}
                        </p>
                    </div>
                    <fieldset
                        disabled={formProps.readOnly || isPending}
                        className="flex flex-col gap-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem className="flex flex-col items-center">
                                    <FormControl>
                                        <InputOTP
                                            autoFocus
                                            maxLength={6}
                                            onComplete={() => onSubmit()}
                                            pattern={
                                                REGEXP_ONLY_DIGITS_AND_CHARS
                                            }
                                            containerClassName="mx-auto capitalize w-fit"
                                            disabled={isDisabled(field.name)}
                                            {...field}
                                        >
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup>
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormErrorMessage errorMessage={error} />
                        <ResendVerifyContactButton
                            interval={1000}
                            duration={20}
                            verifyMode={verifyMode}
                        />
                        <div className="flex flex-col gap-y-2">
                            {onSkip && (
                                <Button
                                    variant={'outline'}
                                    disabled={formProps.readOnly}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        onSkip()
                                    }}
                                >
                                    Skip
                                </Button>
                            )}
                            <Button
                                type="submit"
                                disabled={isPending || formProps.readOnly}
                            >
                                {isPending ? <LoadingSpinner /> : 'Submit'}
                            </Button>
                        </div>
                    </fieldset>
                </form>
            </Form>
        </>
    )
}

export default VerifyForm
