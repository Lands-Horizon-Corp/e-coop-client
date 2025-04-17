import z from 'zod'
import { useForm } from 'react-hook-form'
import { useCallback, useState } from 'react'

import {
    CheckIcon,
    CloseIcon,
    BadgeCheckFillIcon,
    BadgeMinusFillIcon,
} from '@/components/icons'
import {
    Form,
    FormItem,
    FormField,
    FormLabel,
    FormControl,
    FormDescription,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import PasswordInputModal from './password-input-modal'
import FormErrorMessage from '@/components/ui/form-error-message'
import VerifyContactBar from '../verify-notice/verify-contact-bar'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { PhoneInput } from '@/components/contact-input/contact-input'

import { cn } from '@/lib'
import { IUserData } from '@/server/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactNumberSchema } from '@/validations/common'
import { useUpdateAccountContactNumber } from '@/hooks/api-hooks/use-account'

interface Props {
    contact: string
    verified: boolean
    onSave: (newUserData: IUserData) => void
}

const contactOptionSchema = z.object({
    contactNumber: contactNumberSchema,
})

const ContactOption = ({ contact, verified, onSave }: Props) => {
    const [pwdModalState, setPwdModalState] = useState(false)
    const { isPending, mutate: saveContact } = useUpdateAccountContactNumber({
        onSuccess: onSave,
    })

    const form = useForm<z.infer<typeof contactOptionSchema>>({
        resolver: zodResolver(contactOptionSchema),
        reValidateMode: 'onChange',
        values: { contactNumber: contact },
    })

    const hasChanges = form.formState.isDirty

    const firstError = Object.values(form.formState.errors)[0]?.message

    const handleReset = useCallback(() => {
        if (!contact) return

        form.reset()
        form.setValue('contactNumber', contact)
    }, [contact, form])

    return (
        <div className={cn('space-y-0', hasChanges && 'space-y-2')}>
            <PasswordInputModal
                state={pwdModalState}
                payloadData={form.getValues()}
                onClose={(state) => setPwdModalState(state)}
                onSubmit={(newPayload) => {
                    setPwdModalState(false)
                    saveContact(newPayload)
                }}
            />
            <Form {...form}>
                <form
                    className="w-full"
                    onSubmit={form.handleSubmit(() => {
                        if (!hasChanges) return
                        setPwdModalState(true)
                    })}
                >
                    <fieldset disabled={isPending}>
                        <FormField
                            control={form.control}
                            name="contactNumber"
                            render={({ field }) => (
                                <FormItem className="grid w-full gap-y-2">
                                    <div>
                                        <FormLabel
                                            htmlFor="contact-input"
                                            className="text-right text-sm font-normal text-foreground/80"
                                        >
                                            Contact Number{' '}
                                            <span className="inline-flex items-center text-xs text-foreground/50">
                                                {!verified ? (
                                                    <>
                                                        <BadgeMinusFillIcon className="mr-1 inline-block text-orange-500" />{' '}
                                                        Not verified
                                                    </>
                                                ) : (
                                                    <>
                                                        <BadgeCheckFillIcon className="mr-1 inline-block text-primary" />{' '}
                                                        Verified
                                                    </>
                                                )}
                                            </span>
                                        </FormLabel>
                                        <FormDescription className="text-xs">
                                            Will be used to contact you.
                                            Verification is needed after
                                            updating.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <PhoneInput
                                            {...field}
                                            id="contact-input"
                                            name="contact-input"
                                            defaultCountry="PH"
                                        />
                                    </FormControl>
                                    <FormErrorMessage
                                        errorMessage={firstError}
                                    />
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
                                </FormItem>
                            )}
                        />
                    </fieldset>
                </form>
            </Form>
            {!verified && (
                <VerifyContactBar
                    verifyMode="mobile"
                    key="verify-bar-mobile"
                    onSuccess={onSave}
                />
            )}
        </div>
    )
}

export default ContactOption
