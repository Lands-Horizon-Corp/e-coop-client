import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import Modal from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import PasswordInput from '../ui/password-input'
import { Separator } from '@/components/ui/separator'
import FormErrorMessage from '../ui/form-error-message'
import FormFieldWrapper from '../ui/form-field-wrapper'
import LoadingSpinner from '../spinners/loading-spinner'
import { Form, FormControl, FormItem, FormMessage } from '../ui/form'

import useActionSecurityStore from '@/store/action-security-store'
import { useVerifyPassword } from '@/hooks/api-hooks/use-verification'

const actionSecurityFormSchema = z.object({
    password: z.string().min(1, 'Password is required'),
})

type TFormType = z.infer<typeof actionSecurityFormSchema>

const ActionSecurityModal = () => {
    const {
        isOpen,
        modalData: { title, description, onSuccess },
        onClose,
    } = useActionSecurityStore()

    const form = useForm<TFormType>({
        resolver: zodResolver(actionSecurityFormSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            password: '',
        },
    })

    const {
        mutate: verifyPassword,
        isPending,
        error,
    } = useVerifyPassword({
        onSuccess: () => {
            onClose()
            onSuccess()
            form.reset({ password: '' })
        },
    })

    return (
        <Modal
            open={isOpen}
            onOpenChange={onClose}
            title={title}
            description={description}
        >
            <Separator className="bg-muted/70" />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit((data) => verifyPassword(data))}
                >
                    <fieldset
                        disabled={isPending}
                        className="flex w-full flex-col gap-y-4"
                    >
                        <FormFieldWrapper
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormControl>
                                        <PasswordInput
                                            {...field}
                                            id="password-field"
                                            autoComplete="off"
                                            placeholder="Password"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                        <FormErrorMessage errorMessage={error} />

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
        </Modal>
    )
}

export default ActionSecurityModal
