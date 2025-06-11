import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { FormItem, FormControl, Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import LoadingSpinner from '@/components/spinners/loading-spinner'

import { MagnifyingGlassIcon } from '@/components/icons'

import { useVerifyInvitationCode } from '@/hooks/api-hooks/use-invitation-code'
import { useJoinWithCode } from '@/hooks/api-hooks/use-user-organization'

import { cn } from '@/lib'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const joinOrganizationFormSchema = z.object({
    invitationCode: z.string().min(1, {
        message: 'Invitation code is required',
    }),
})

type TJoinOrganizationForm = z.infer<typeof joinOrganizationFormSchema>

const JoinBranchWithCodeFormModal = ({
    title,
    description,
    className,
    onOpenChange,
    ...props
}: IModalProps) => {
    const form = useForm<TJoinOrganizationForm>({
        resolver: zodResolver(joinOrganizationFormSchema),
        defaultValues: {
            invitationCode: '',
        },
    })
    const navigate = useNavigate()

    const { mutateAsync, isPending: isVerfiying } = useVerifyInvitationCode()

    const { mutate: joinWithCode, isPending: IsLoadingJoining } =
        useJoinWithCode({
            onSuccess: (data) => {
                navigate({ to: '/onboarding' as string })
                toast.success(
                    `Successfully Joined on ${data.branch?.name} Branch`
                )
            },
        })

    const handleSubmit = async (data: TJoinOrganizationForm) => {
        try {
            const isValid = await mutateAsync(data.invitationCode)
            if (isValid) {
                joinWithCode(data.invitationCode)
            } else {
                toast.error('The invitation code is not valid.')
            }
        } catch (error) {
            toast.error(`Verification failed: ${error || 'Unknown error'}`)
        }
    }

    return (
        <Modal
            title={title}
            description={description}
            titleClassName="text-2xl"
            className={cn('w-[44rem]', className)}
            onOpenChange={onOpenChange}
            {...props}
        >
            <Form {...form}>
                <form
                    className="grid grid-cols-1 gap-y-2"
                    onSubmit={form.handleSubmit(handleSubmit)}
                >
                    <FormFieldWrapper
                        control={form.control}
                        name="invitationCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div className="relative w-full">
                                        <span className="absolute inset-y-0 left-3 flex items-center text-primary">
                                            <MagnifyingGlassIcon className="h-5 w-5" />
                                        </span>
                                        <Input
                                            placeholder="Search for branches via code"
                                            {...field}
                                            className="w-full rounded-2xl bg-secondary/50 pl-10 text-primary"
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        disabled={IsLoadingJoining || isVerfiying}
                    >
                        {isVerfiying ? (
                            <>
                                verifying...{' '}
                                <LoadingSpinner className="ml-2 animate-spin" />
                            </>
                        ) : IsLoadingJoining ? (
                            <>
                                joining...{' '}
                                <LoadingSpinner className="ml-2 animate-spin" />
                            </>
                        ) : (
                            'join'
                        )}
                    </Button>
                </form>
            </Form>
        </Modal>
    )
}

export default JoinBranchWithCodeFormModal
