import { useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import qs from 'query-string'
import { toast } from 'sonner'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { useVerifyInvitationCode } from '@/modules/invitation-code'
import { IOrganizationWithPolicies } from '@/modules/organization'
import { useJoinWithInvitationCode } from '@/modules/user-organization'

import { GradientBackground } from '@/components/gradient-background/gradient-background'
import {
    AddressCardIcon,
    BarcodeScanIcon,
    KeySharpIcon,
    PinLocationIcon,
    XIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import Modal, { IModalProps } from '@/components/modals/modal'
import OrganizationPolicies from '@/components/policies'
import { QrCodeScannerModal } from '@/components/qrcode-scanner'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import ActionTooltip from '@/components/tooltips/action-tooltip'
import { Button } from '@/components/ui/button'
import FormErrorMessage from '@/components/ui/form-error-message'
import { Input } from '@/components/ui/input'
import { PlainTextEditor } from '@/components/ui/text-editor'

import { useModalState } from '@/hooks/use-modal-state'

const JoinBranchWithCodeFormModal = ({
    title,
    className,
    defaultCode,
    description,
    onOpenChange,
    ...props
}: IModalProps & { defaultCode?: string }) => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [val, setVal] = useState<string | undefined>(defaultCode)
    const [code, setCode] = useState<string | undefined>(defaultCode)
    const [isAllChecked, setIsAllChecked] = useState(false)
    const scanModal = useModalState()

    const {
        data,
        isPending,
        error: codeSearchError,
    } = useVerifyInvitationCode(code as string)

    const {
        mutate: joinWithCode,
        isPending: IsLoadingJoining,
        error: joinError,
    } = useJoinWithInvitationCode({
        options: {
            onSuccess: () => {
                navigate({ to: '/onboarding' as string })
            },
        },
    })

    const handleSubmit = async () => {
        if (!data || !code) return

        try {
            joinWithCode(code)
        } catch (error) {
            toast.error(`Verification failed: ${error || 'Unknown error'}`)
        }
    }

    const handleScanComplete = (invitationUrl: string) => {
        const {
            query: { invitation_code },
        } = qs.parseUrl(invitationUrl, { types: { invitation_code: 'string' } })

        if (!invitation_code) toast.warning('Invalid Invitation URL')

        setCode(invitation_code as string)
    }

    const isLoading = (isPending && !!code) || IsLoadingJoining
    const errorMessage = serverRequestErrExtractor({
        error: codeSearchError || joinError,
    })

    const handleInvalidateSearch = () => {
        queryClient.invalidateQueries({ queryKey: ['invitation-code', code] })
        setCode(undefined)
    }

    return (
        <Modal
            className={cn('w-[44rem]', className)}
            description={description}
            onOpenChange={onOpenChange}
            title={title}
            titleClassName="text-2xl"
            {...props}
        >
            <QrCodeScannerModal
                {...scanModal}
                qrScannerProps={{
                    disableDecode: true,
                    onScan: (data) => {
                        if (data.length === 0)
                            return toast.error('No data scanned')
                        handleScanComplete(data[0].rawValue)
                    },
                }}
            />
            <div className="grid grid-cols-1 gap-y-2">
                <fieldset
                    className="relative flex w-full items-center gap-x-2"
                    disabled={isLoading}
                >
                    <div className="relative w-full">
                        <div className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-muted-foreground/70">
                            {isLoading && !!code ? (
                                <LoadingSpinner />
                            ) : (
                                <KeySharpIcon />
                            )}
                        </div>
                        <Input
                            className="w-full rounded-2xl bg-secondary/50 text-primary"
                            onChange={(e) => {
                                setVal(e.target.value)
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setCode(val)
                                }
                            }}
                            placeholder="Enter Invitation Code"
                            value={val}
                        />
                    </div>
                    <ActionTooltip
                        align="end"
                        side="bottom"
                        tooltipContent="Scan QR Code instead"
                    >
                        <Button
                            className="rounded-xl"
                            onClick={() => scanModal.onOpenChange(true)}
                            size="icon"
                            variant="outline"
                        >
                            <BarcodeScanIcon />
                        </Button>
                    </ActionTooltip>
                </fieldset>
                {data && data.branch && data.organization && (
                    <GradientBackground
                        imageBackgroundOpacity={0.1}
                        mediaUrl={data.organization.media?.download_url}
                    >
                        <div className="relative z-50 flex min-h-16 w-full cursor-pointer items-center gap-x-4 rounded-2xl border-0 p-4 hover:bg-secondary/50 hover:no-underline">
                            <div className="flex grow flex-col gap-y-2">
                                <div className="flex">
                                    <ImageDisplay
                                        className="aspect-square size-16 rounded-lg"
                                        src={
                                            data.organization.media
                                                ?.download_url
                                        }
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
                                                    data.branch?.media
                                                        ?.download_url
                                                }
                                            />
                                            <div className="flex grow items-center px-2">
                                                <div className="flex w-full grow flex-col">
                                                    <h1>{data.branch.name}</h1>
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
                                                        {data.branch.address}
                                                    </p>
                                                </div>
                                                <Button
                                                    className="h-fit w-fit bg-primary/50 px-2 py-2 text-xs capitalize"
                                                    disabled={
                                                        isLoading ||
                                                        IsLoadingJoining ||
                                                        !isAllChecked
                                                    }
                                                    onClick={() =>
                                                        handleSubmit()
                                                    }
                                                    size="sm"
                                                >
                                                    Joining as {data.user_type}
                                                </Button>
                                            </div>
                                        </div>
                                    </GradientBackground>
                                </div>
                            </div>

                            <Button
                                className="absolute right-2 top-2 size-fit rounded-full p-1"
                                onClick={() => handleInvalidateSearch()}
                                size="icon"
                                variant="secondary"
                            >
                                <XIcon className="size-4" />
                            </Button>
                        </div>
                        <div className="my-5">
                            <OrganizationPolicies
                                classNamePolicyItem="z-50"
                                isIncludeIAccept={true}
                                onPolicyChange={(isAllChecked) => {
                                    setIsAllChecked(isAllChecked)
                                }}
                                organization={
                                    data.organization as IOrganizationWithPolicies
                                }
                            />
                        </div>
                    </GradientBackground>
                )}
                <FormErrorMessage errorMessage={errorMessage} />
            </div>
        </Modal>
    )
}

export default JoinBranchWithCodeFormModal
