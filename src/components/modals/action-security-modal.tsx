import { useCallback, useEffect, useState } from 'react'

import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { useVerifyPassword } from '@/modules/authentication'
import useActionSecurityStore from '@/store/action-security-store'

import { ShieldCheckIcon, ShieldLockIcon } from '@/components/icons'
import Modal from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import PasswordInput from '@/components/ui/password-input'

const actionSecurityFormSchema = z.object({
    password: z.string().min(1, 'Password is required'),
})

type TFormType = z.infer<typeof actionSecurityFormSchema>

const ActionSecurityModal = () => {
    const [success, setSuccess] = useState(false)
    const {
        isOpen,
        modalData: { title, description, onSuccess },
        onClose,
    } = useActionSecurityStore()

    const form = useForm<TFormType>({
        resolver: standardSchemaResolver(actionSecurityFormSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            password: '',
        },
    })

    const onPasswordSuccess = useCallback(() => {
        setSuccess(true)
        setTimeout(() => {
            onClose()
            setTimeout(() => {
                onSuccess()
            }, 500)
        }, 1000)
    }, [onClose, onSuccess])

    const {
        mutate: verifyPassword,
        isPending,
        error,
    } = useVerifyPassword({
        options: {
            onSuccess: () => {
                // onClose()
                // onSuccess()
                onPasswordSuccess()
                form.reset({ password: '' })
            },
        },
    })

    useEffect(() => {
        if (success && !isOpen) {
            setTimeout(() => {
                setSuccess(false)
            }, 500)
        }
    }, [isOpen, success])

    const Error = serverRequestErrExtractor({ error })

    return (
        <Modal
            open={isOpen}
            titleClassName="hidden"
            descriptionClassName="hidden"
            onOpenChange={onClose}
        >
            <div className="flex flex-col items-center justify-center gap-y-2">
                {success ? (
                    <ShieldCheckIcon className="size-16 text-primary animate-in" />
                ) : (
                    <ShieldLockIcon className="size-16 text-orange-400 animate-out" />
                )}
                <p className="text-xl">{title}</p>
                <p className="text-muted-foreground/80">{description}</p>
            </div>
            {isPending && <LoadingSpinner className="mx-auto" />}
            {!success && !isPending && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((data) =>
                            verifyPassword(data)
                        )}
                    >
                        <fieldset
                            disabled={isPending}
                            className="flex w-full flex-col gap-y-4"
                        >
                            <FormFieldWrapper
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <PasswordInput
                                        {...field}
                                        id="password-field"
                                        autoComplete="off"
                                        placeholder="Password"
                                    />
                                )}
                            />
                            <FormErrorMessage errorMessage={Error} />

                            <div className="flex justify-end gap-x-2">
                                <Button
                                    size="sm"
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full px-8"
                                >
                                    {isPending ? <LoadingSpinner /> : 'Proceed'}
                                </Button>
                            </div>
                        </fieldset>
                    </form>
                </Form>
            )}
        </Modal>
    )
}

export default ActionSecurityModal
