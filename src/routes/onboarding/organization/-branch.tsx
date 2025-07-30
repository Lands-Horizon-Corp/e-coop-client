import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { orgBannerList } from '@/assets/pre-organization-banner-background'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { useNavigate } from '@tanstack/react-router'

import { GradientBackground } from '@/components/gradient-background/gradient-background'
import ImageDisplay from '@/components/image-display'
import Modal, { IModalProps } from '@/components/modals/modal'
import PlainTextEditor from '@/components/plain-text-editor'
import RawDescription from '@/components/raw-description'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

import { useJoinOrganization } from '@/hooks/api-hooks/use-user-organization'

import { IBranch, IOrganizationWithPolicies, TEntityId } from '@/types'

type PolicyKey =
    | 'terms_and_conditions'
    | 'privacy_policy'
    | 'refund_policy'
    | 'user_agreement'

type PolicyAcceptanceModalProps = IModalProps & {
    onAcceptAndProceed: (branchId: TEntityId, organizationId: TEntityId) => void
    onCancel: () => void
    organization: IOrganizationWithPolicies
    branch: IBranch
    branchId: TEntityId
    organizationId: TEntityId
}

const PolicyViewer = ({
    policyType,
    policyName,
    policyContent,
    onAcceptPolicy,
    isChecked,
}: {
    policyType: PolicyKey
    policyName: string
    policyContent: string
    onAcceptPolicy: (policyValue: string) => void
    isChecked: boolean
}) => {
    const [open, setOpen] = useState(false)

    const handleAcceptClick = () => {
        onAcceptPolicy(policyType)
        setOpen(false)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <div className="flex items-center gap-x-2">
                <span className="text-xs text-muted-foreground">
                    I accept the{' '}
                </span>
                <PopoverTrigger
                    className="text-sm text-primary/70 hover:underline"
                    disabled={isChecked}
                >
                    {policyName}
                </PopoverTrigger>
                <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => {
                        onAcceptPolicy(policyType)
                    }}
                    className="h-4 w-4"
                />
            </div>
            <PopoverContent className="w-96 p-4">
                <span className="font-semibold text-primary mb-2 block">
                    {policyName}
                </span>
                <ScrollArea className="max-h-64 text-sm overflow-y-auto pr-2">
                    <div className="p-1">
                        {policyContent ? (
                            <RawDescription content={policyContent} />
                        ) : (
                            <p>No content available for {policyName}.</p>
                        )}
                    </div>
                </ScrollArea>
                <div className="w-full flex justify-end gap-x-2 mt-4">
                    <Button
                        variant={'ghost'}
                        size={'sm'}
                        onClick={() => setOpen(false)}
                    >
                        Close
                    </Button>
                    {!isChecked && (
                        <Button
                            size={'sm'}
                            variant={'secondary'}
                            onClick={handleAcceptClick}
                        >
                            Accept
                        </Button>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}

const PolicyAcceptanceModal = ({
    onAcceptAndProceed,
    branch,
    onCancel,
    organization,
    branchId,
    organizationId,
    ...rest
}: PolicyAcceptanceModalProps) => {
    const initialTermsState = [
        {
            name: 'Terms And Condition',
            value: 'terms_and_conditions',
            isChecked: false,
            content: organization.terms_and_conditions,
        },
        {
            name: 'Privacy Policy',
            value: 'privacy_policy',
            isChecked: false,
            content: organization.privacy_policy,
        },
        {
            name: 'Refund Policy',
            value: 'refund_policy',
            isChecked: false,
            content: organization.refund_policy,
        },
        {
            name: 'User Agreement',
            value: 'user_agreement',
            isChecked: false,
            content: organization.user_agreement,
        },
    ]

    const [termsAndConditions, setTermsAndConditions] =
        useState(initialTermsState)

    useEffect(() => {
        if (rest.open) {
            setTermsAndConditions(initialTermsState)
        }
    }, [rest.open])

    const handlePolicyAcceptance = (policyValue: string) => {
        setTermsAndConditions((prev) =>
            prev.map((term) =>
                term.value === policyValue
                    ? { ...term, isChecked: !term.isChecked }
                    : term
            )
        )
    }

    const isAllChecked = termsAndConditions.every((term) => term.isChecked)

    const handleProceed = () => {
        if (!isAllChecked) {
            toast.error('Please accept all policies before proceeding.')
            return
        }
        onAcceptAndProceed(branchId, organizationId)
    }

    return (
        <Modal
            title={`Join Branch ${branch.name}`}
            description={
                <>
                    <span>
                        You are about to join this branch{' '}
                        <span className="font-semibold italic text-pretty">
                            {branch.name}
                        </span>
                        , are you sure you want to proceed?
                    </span>
                </>
            }
            {...rest}
            className="max-w-2xl"
        >
            <div>
                <p className=" text-xs text-muted-foreground mb-4">
                    To proceed, please read and accept the following policies:
                </p>
                <div className="w-full grid grid-cols-1 gap-y-3">
                    {termsAndConditions.map((term) => (
                        <PolicyViewer
                            key={term.value}
                            policyType={term.value as PolicyKey}
                            policyName={term.name}
                            policyContent={term.content}
                            onAcceptPolicy={handlePolicyAcceptance}
                            isChecked={term.isChecked}
                        />
                    ))}
                </div>
                <div className="flex justify-end col-span-2 gap-x-2 mt-6">
                    <Button
                        size={'sm'}
                        onClick={() => onCancel()}
                        variant={'ghost'}
                    >
                        Cancel
                    </Button>
                    <Button
                        size={'sm'}
                        disabled={!isAllChecked}
                        onClick={handleProceed}
                    >
                        Join
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

type BranchProps = {
    branch: IBranch
    organizationId: TEntityId
    isUserCanJoin: boolean
}

const Branch = ({ branch, organizationId, isUserCanJoin }: BranchProps) => {
    const navigate = useNavigate()
    const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false)

    const { mutate: JoinOrganization } = useJoinOrganization({
        onSuccess: () => {
            toast.success('You have successfully joined the organization')
            navigate({ to: `/onboarding` })
        },
        onError: () => {
            toast.error('Failed to join organization. Please try again.')
        },
    })

    const handleJoinClick = () => {
        if (!organizationId) {
            toast.error('Missing Organization Id. Cannot proceed.')
            return
        }
        setIsPolicyModalOpen(true)
    }

    const handleAcceptAndProceed = (branchId: TEntityId, orgId: TEntityId) => {
        JoinOrganization({ organizationId: orgId, branchId: branchId })
        setIsPolicyModalOpen(false)
    }

    const mediaUrl = branch?.media?.url ?? orgBannerList[0]

    return (
        <div className="flex max-h-96 flex-col gap-y-2 overflow-y-auto">
            <PolicyAcceptanceModal
                open={isPolicyModalOpen}
                branch={branch}
                organization={branch?.organization as IOrganizationWithPolicies}
                branchId={branch.id}
                organizationId={organizationId}
                onCancel={() => setIsPolicyModalOpen(false)}
                onAcceptAndProceed={handleAcceptAndProceed}
                onOpenChange={setIsPolicyModalOpen}
            />

            <GradientBackground gradientOnly>
                <div
                    key={branch.id}
                    className="relative flex min-h-16 w-full cursor-pointer items-center gap-x-2 rounded-2xl border-0 p-4 hover:bg-secondary/50 hover:no-underline"
                >
                    <ImageDisplay
                        className="size-10 rounded-xl"
                        src={mediaUrl}
                    />
                    <div className="flex grow flex-col">
                        <h1>{branch?.name}</h1>
                        <PlainTextEditor
                            className="text-xs"
                            content={branch.description ?? ''}
                        />
                    </div>
                    <Button
                        disabled={!isUserCanJoin}
                        onClick={handleJoinClick}
                        size={'sm'}
                        variant={'secondary'}
                    >
                        {isUserCanJoin ? 'Join' : 'Joined'}
                    </Button>
                </div>
            </GradientBackground>
        </div>
    )
}

export default Branch
