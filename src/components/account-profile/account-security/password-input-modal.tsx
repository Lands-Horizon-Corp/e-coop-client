import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
    Dialog,
    DialogTitle,
    DialogHeader,
    DialogContent,
    DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import PasswordInput from '@/components/ui/password-input'
import { Form, FormItem, FormField } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'

import { passwordSchema } from '@/validations/common'

type Props<T> = {
    state: boolean
    payloadData: T
    onClose: (newState: boolean) => void
    onSubmit: (updatedData: T & { password: string }) => void
}

const schema = z.object({
    password: passwordSchema,
})

const PasswordInputModal = <T extends object>({
    state,
    onClose,
    onSubmit,
    payloadData,
}: Props<T>) => {
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        reValidateMode: 'onChange',
        values: { password: '' },
    })

    const firstError = Object.values(form.formState.errors)[0]?.message

    return (
        <Dialog open={state} onOpenChange={onClose}>
            <DialogContent
                overlayClassName="backdrop-blur"
                className="shadow-2 !rounded-2xl border font-inter"
            >
                <DialogHeader>
                    <DialogTitle className="font-medium">
                        Password Confirm
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription className="mb-4">
                    Please enter password to proceed
                </DialogDescription>
                <Form {...form}>
                    <form
                        className="w-full space-y-4"
                        onSubmit={form.handleSubmit((data) => {
                            onSubmit({ ...payloadData, ...data })
                            form.reset()
                        })}
                        autoComplete="off"
                    >
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="grid w-full gap-y-2">
                                    <PasswordInput
                                        hidden
                                        {...field}
                                        data-1p-ignore
                                        autoComplete="off"
                                        data-lpignore="true"
                                        placeholder="Enter Password"
                                    />
                                </FormItem>
                            )}
                        />
                        <FormErrorMessage errorMessage={firstError} />
                        <div className="flex justify-end gap-x-2">
                            <Button type="submit" className="px-8">
                                Okay
                            </Button>
                        </div>
                    </form>
                </Form>
                <Separator className="bg-muted/70" />
            </DialogContent>
        </Dialog>
    )
}

export default PasswordInputModal
