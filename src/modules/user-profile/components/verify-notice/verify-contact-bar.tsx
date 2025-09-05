import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers/tw-utils'
import {
    OTPSchema,
    useSendOTPVerification,
    useVerify,
} from '@/modules/authentication'
import { IUserBase } from '@/modules/user/user.types'
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp'

import { BadgeQuestionFillIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from '@/components/ui/input-otp'

import UseCooldown from '@/hooks/use-cooldown'
import { useFormHelper } from '@/hooks/use-form-helper'

type TVerifyMode = 'email' | 'mobile'
type TVerifyFormValues = z.infer<typeof OTPSchema>

interface Props {
    autoFocus?: boolean
    verifyMode: TVerifyMode
    onSuccess?: (newUserData: IUserBase) => void
}

const VerifyContactBar = ({
    autoFocus = false,
    verifyMode,
    onSuccess,
}: Props) => {
    const form = useForm<TVerifyFormValues>({
        resolver: standardSchemaResolver(OTPSchema),
        reValidateMode: 'onChange',
        defaultValues: {
            otp: '',
        },
    })

    const { mutate: handleVerify, isPending } = useVerify({
        options: {
            onSuccess,
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TVerifyFormValues>({
            form,
            autoSave: false,
            preventExitOnDirty: false,
        })

    return (
        <div className="flex flex-col justify-between gap-y-4 rounded-xl border border-border bg-secondary/70 p-3 lg:flex-row">
            <div className="space-y-2 text-center text-xs sm:text-left sm:text-sm">
                <p className="text-sm font-medium capitalize">
                    Verify {verifyMode}
                    <BadgeQuestionFillIcon className="ml-1 inline text-amber-600" />
                </p>
                <p className="text-sm text-foreground/50">
                    Please verify {verifyMode} to enable other features/actions.{' '}
                    <ResendCode
                        verifyMode={verifyMode}
                        duration={10}
                        interval={1_000}
                    />
                </p>
            </div>
            <Form {...form}>
                <form
                    ref={formRef}
                    onSubmit={form.handleSubmit(
                        (data) => handleVerify({ ...data, verifyMode }),
                        handleFocusError
                    )}
                >
                    <fieldset
                        disabled={isPending}
                        className="flex flex-col gap-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem className="flex flex-col items-center">
                                    <FormControl>
                                        <InputOTP
                                            {...field}
                                            maxLength={6}
                                            autoFocus={autoFocus}
                                            pattern={
                                                REGEXP_ONLY_DIGITS_AND_CHARS
                                            }
                                            containerClassName="mx-auto capitalize w-fit"
                                            disabled={isDisabled(field.name)}
                                            onComplete={() =>
                                                form.handleSubmit((data) =>
                                                    handleVerify({
                                                        ...data,
                                                        verifyMode,
                                                    })
                                                )()
                                            }
                                        >
                                            <InputOTPGroup>
                                                <InputOTPSlot
                                                    index={0}
                                                    className="sm:size-8"
                                                />
                                                <InputOTPSlot
                                                    index={1}
                                                    className="sm:size-8"
                                                />
                                                <InputOTPSlot
                                                    index={2}
                                                    className="sm:size-8"
                                                />
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup>
                                                <InputOTPSlot
                                                    index={3}
                                                    className="sm:size-8"
                                                />
                                                <InputOTPSlot
                                                    index={4}
                                                    className="sm:size-8"
                                                />
                                                <InputOTPSlot
                                                    index={5}
                                                    className="sm:size-8"
                                                />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormMessage className="text-xs text-rose-500" />
                                </FormItem>
                            )}
                        />
                    </fieldset>
                </form>
            </Form>
        </div>
    )
}

const ResendCode = ({
    disabled = false,
    verifyMode,
    duration,
    interval,
}: {
    disabled?: boolean
    verifyMode: TVerifyMode
    duration: number
    interval: number
}) => {
    const { cooldownCount, startCooldown } = UseCooldown({
        cooldownDuration: duration,
        counterInterval: interval,
    })

    const { mutate: resendOtpVerification, isPending: isResending } =
        useSendOTPVerification({
            verifyMode,
            options: {
                onSuccess: () => startCooldown(),
                onError: () => toast.error('Failed to resend'),
            },
        })

    return (
        <span
            className={cn(
                'cursor-pointer underline',
                cooldownCount > 0 && 'cursor-not-allowed no-underline',
                disabled && 'cursor-not-allowed opacity-30'
            )}
            onClick={(e) => {
                if (disabled) return

                e.preventDefault()
                resendOtpVerification()
            }}
        >
            {isResending && <LoadingSpinner className="inline-block size-3" />}
            {!isResending && cooldownCount <= 0 && "Didn't get the code?"}
            {cooldownCount > 0 && `Resend again in ${cooldownCount}s`}
        </span>
    )
}

export default VerifyContactBar
