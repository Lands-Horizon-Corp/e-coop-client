import { GradientBackground } from '@/components/gradient-background/gradient-background'
import Modal, { IModalProps } from '@/components/modals/modal'
import SafeImage from '@/components/safe-image'
import PlainTextEditor from '@/components/plain-text-editor'

import { Button } from '@/components/ui/button'
import { FormItem, FormControl, Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import LoadingSpinner from '@/components/spinners/loading-spinner'

import { AddressCardIcon, PinLocationIcon } from '@/components/icons'

import { useVerifyInvitationCode } from '@/hooks/api-hooks/use-invitation-code'
import { useJoinWithCode } from '@/hooks/api-hooks/use-user-organization'

import { cn } from '@/lib'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import useDebounce from '@/hooks/use-debounce'

const joinOrganizationFormSchema = z.object({
    invitationCode: z.string().min(1, {
        message: 'Invitation code is required',
    }),
})

type TJoinOrganizationForm = z.infer<typeof joinOrganizationFormSchema>

const JoinBranchWithCodeFormModal = ({
    description = 'Fill out to join branch',
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

    const invitationCode = form.watch('invitationCode')
    const debouncedCode = useDebounce(invitationCode, 2000)
    const { data: codeData, isLoading } = useVerifyInvitationCode(debouncedCode)

    const { mutate: joinWithCode, isPending: IsLoadingJoining } =
        useJoinWithCode({
            onSuccess: (data) => {
                navigate({ to: '/onboarding' })
                toast.success(
                    `Successfully Joined on ${data.branch?.name} Branch`
                )
            },
            onError: (errorMessage) => {
                toast.error(
                    `${errorMessage as string}\nYou might already have joined this branch!`
                )
            },
        })

    const handleSubmit = async (data: TJoinOrganizationForm) => {
        if (codeData) {
            joinWithCode(data.invitationCode)
        }
    }

    const branch = codeData?.branch
    const organization = codeData?.organization

    return (
        <Modal
            title="Join Branch"
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
                                    <Input
                                        placeholder="Enter your invitation code"
                                        {...field}
                                        className="h-20 w-full rounded-2xl bg-secondary/50 text-xl text-primary"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    {isLoading && (
                        <div className="flex w-full justify-center">
                            <LoadingSpinner className="animate-spin" />
                        </div>
                    )}
                    {branch && organization && (
                        <>
                            <GradientBackground
                                imageBackgroundOpacity={0.1}
                                mediaUrl={organization?.media?.url}
                            >
                                <div className="relative z-50 flex min-h-16 w-full cursor-pointer items-center gap-x-4 rounded-2xl border-0 p-4 hover:bg-secondary/50 hover:no-underline">
                                    <div className="flex grow flex-col gap-y-2">
                                        <div className="flex">
                                            <SafeImage
                                                className="aspect-square size-16"
                                                src={organization?.media?.url}
                                            />
                                            <div className="p-2">
                                                <h1>{organization?.name}</h1>
                                                <PlainTextEditor
                                                    className="text-xs"
                                                    content={
                                                        organization?.description ??
                                                        ''
                                                    }
                                                />
                                                <p className="flex items-center gap-y-2 text-xs">
                                                    {' '}
                                                    <PinLocationIcon className="mr-2" />
                                                    {organization.address}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="pl-5">
                                            <GradientBackground gradientOny>
                                                <div className="relative flex min-h-10 w-full cursor-pointer items-center gap-x-2 rounded-2xl border-0 p-2 hover:bg-secondary/50 hover:no-underline">
                                                    <SafeImage
                                                        className="size-16"
                                                        src={branch?.media?.url}
                                                    />
                                                    <div className="flex grow flex-col">
                                                        <h1>{branch?.name}</h1>
                                                        {branch.description && (
                                                            <PlainTextEditor
                                                                className="text-xs"
                                                                content={
                                                                    branch?.description ??
                                                                    ''
                                                                }
                                                            />
                                                        )}
                                                        <p className="flex items-center gap-y-1 text-xs">
                                                            <AddressCardIcon className="mr-2" />
                                                            {branch.address}
                                                        </p>
                                                    </div>
                                                </div>
                                            </GradientBackground>
                                        </div>
                                    </div>
                                </div>
                            </GradientBackground>
                        </>
                    )}
                    <div className="w-full p-2">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading || IsLoadingJoining}
                        >
                            Join
                        </Button>
                    </div>
                </form>
            </Form>
        </Modal>
    )
}

export default JoinBranchWithCodeFormModal
