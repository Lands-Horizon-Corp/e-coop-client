import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp'

import {
    Form,
    FormItem,
    FormField,
    FormControl,
    FormMessage,
} from '@/components/ui/form'
import {
    InputOTP,
    InputOTPSlot,
    InputOTPGroup,
    InputOTPSeparator,
} from '@/components/ui/input-otp'
import { Button } from '@/components/ui/button'
import FormErrorMessage from '@/components/ui/form-error-message'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import ResendVerifyContactButton from '../../../pages/auth/components/resend-verify-contact-button'

import { cn } from '@/lib/utils'
import { otpSchema } from '@/validations'

import { IUserData } from '@/server/types'
import { IForm } from '@/types/components'
import { useVerify } from '@/hooks/api-hooks/use-auth'

type TVerifyForm = z.infer<typeof otpSchema>

interface Props extends IForm<TVerifyForm, IUserData> {
    verifyMode: 'mobile' | 'email'
    onSkip?: () => void
}

const VerifyForm = ({
    className,
    readOnly = false,
    verifyMode = 'mobile',
    defaultValues = { otp: '' },
    onSkip,
    onError,
    onSuccess,
}: Props) => {
    const form = useForm({
        resolver: zodResolver(otpSchema),
        reValidateMode: 'onChange',
        defaultValues,
    })

    const {
        mutate: handleVerify,
        isPending,
        error,
    } = useVerify({
        verifyMode,
        onSuccess,
        onError,
    })

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit((data) => handleVerify(data))}
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
                        disabled={readOnly || isPending}
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
                                            onComplete={() =>
                                                form.handleSubmit((data) =>
                                                    handleVerify(data)
                                                )()
                                            }
                                            pattern={
                                                REGEXP_ONLY_DIGITS_AND_CHARS
                                            }
                                            containerClassName="mx-auto capitalize w-fit"
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
                                    disabled={readOnly}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        onSkip()
                                    }}
                                >
                                    Skip
                                </Button>
                            )}
                            <Button type="submit">
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
