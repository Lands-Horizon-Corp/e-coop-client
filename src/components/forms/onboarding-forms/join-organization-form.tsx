import { toast } from 'sonner'
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Modal, { IModalProps } from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'

import {
    AddressCardIcon,
    MagnifyingGlassIcon,
    PinLocationIcon,
} from '@/components/icons'

import { useJoinWithCode } from '@/hooks/api-hooks/use-user-organization'

import { cn } from '@/lib'
import { useInvitationCodeByCode } from '@/hooks/api-hooks/use-invitation-code'
import { GradientBackground } from '@/components/gradient-background/gradient-background'
import ImageDisplay from '@/components/image-display'
import PlainTextEditor from '@/components/plain-text-editor'

const JoinBranchWithCodeFormModal = ({
    title,
    className,
    defaultCode,
    description,
    onOpenChange,
    ...props
}: IModalProps & { defaultCode?: string }) => {
    const [val, setVal] = useState<string | undefined>(defaultCode)
    const [code, setCode] = useState<string | undefined>(defaultCode)
    const navigate = useNavigate()

    const { data, isPending: isLoading } = useInvitationCodeByCode({
        code: code as string,
        enabled: !!code,
    })

    const { mutate: joinWithCode, isPending: IsLoadingJoining } =
        useJoinWithCode({
            onSuccess: () => {
                navigate({ to: '/onboarding' as string })
            },
            showMessage: true,
        })

    const handleSubmit = async () => {
        if (!data || !code) return

        try {
            joinWithCode(code)
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
            <div className="grid grid-cols-1 gap-y-2">
                <div className="relative flex w-full items-center gap-x-2">
                    <Input
                        value={val}
                        onChange={(e) => {
                            setVal(e.target.value)
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setCode(val)
                            }
                        }}
                        placeholder="Search for branches via code"
                        className="w-full rounded-2xl bg-secondary/50 text-primary"
                    />
                    <Button
                        className="rounded-2xl"
                        variant="outline"
                        onClick={() => setCode(val)}
                    >
                        <MagnifyingGlassIcon className="mr-2" /> Apply
                    </Button>
                </div>
                {isLoading && !!code && (
                    <div className="flex w-full justify-center">
                        <LoadingSpinner className="animate-spin text-primary" />
                    </div>
                )}
                {data && data.branch && data.organization && (
                    <>
                        <GradientBackground
                            imageBackgroundOpacity={0.1}
                            mediaUrl={data.organization.media?.url}
                        >
                            <div className="relative z-50 flex min-h-16 w-full cursor-pointer items-center gap-x-4 rounded-2xl border-0 p-4 hover:bg-secondary/50 hover:no-underline">
                                <div className="flex grow flex-col gap-y-2">
                                    <div className="flex">
                                        <ImageDisplay
                                            className="aspect-square size-16 rounded-lg"
                                            src={data.organization.media?.url}
                                        />
                                        <div className="p-2">
                                            <h1>{data.organization.name}</h1>
                                            <PlainTextEditor
                                                className="text-xs"
                                                content={
                                                    data.organization
                                                        ?.description ?? ''
                                                }
                                            />
                                            <p className="flex items-center gap-y-2 text-xs">
                                                {' '}
                                                <PinLocationIcon className="mr-2" />
                                                {data.organization.address}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="pl-5">
                                        <GradientBackground
                                            className="!bg-black/50"
                                            gradientOnly
                                        >
                                            <div className="relative flex min-h-10 w-full cursor-pointer items-center gap-x-2 rounded-2xl border-0 p-2 hover:bg-secondary/50 hover:no-underline">
                                                <ImageDisplay
                                                    className="size-16 rounded-lg"
                                                    src={
                                                        data.organization?.media
                                                            ?.url
                                                    }
                                                />
                                                <div className="flex grow items-center px-2">
                                                    <div className="flex w-full grow flex-col">
                                                        <h1>
                                                            {data.branch.name}
                                                        </h1>
                                                        {data.branch
                                                            .description && (
                                                            <PlainTextEditor
                                                                className="text-xs"
                                                                content={
                                                                    data.branch
                                                                        ?.description ??
                                                                    ''
                                                                }
                                                            />
                                                        )}
                                                        <p className="flex items-center gap-y-1 text-xs">
                                                            <AddressCardIcon className="mr-2" />
                                                            {
                                                                data.branch
                                                                    .address
                                                            }
                                                        </p>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        disabled={
                                                            isLoading ||
                                                            IsLoadingJoining
                                                        }
                                                        onClick={() =>
                                                            handleSubmit()
                                                        }
                                                        className="h-fit w-fit bg-primary/50 px-2 py-2 text-xs capitalize"
                                                    >
                                                        Joining as{' '}
                                                        {data.user_type}
                                                    </Button>
                                                </div>
                                            </div>
                                        </GradientBackground>
                                    </div>
                                </div>
                            </div>
                        </GradientBackground>
                    </>
                )}
            </div>
        </Modal>
    )
}

export default JoinBranchWithCodeFormModal
