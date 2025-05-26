import { GradientBackground } from '@/components/gradient-background/gradient-background'
import { Button } from '@/components/ui/button'

import { ScrollArea } from '@/components/ui/scroll-area'

import {
    useDeleteBranch,
    useGetBranchesByOrganizationId,
} from '@/hooks/api-hooks/use-branch'
import CreateBranchForm from '@/components/forms/onboarding-forms/create-branch-form'

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import PlainTextEditor from '@/components/plain-text-editor'
import SafeImage from '@/components/safe-image'
import {
    AddressCardIcon,
    BranchIcon,
    EditPencilIcon,
    LandmarkIcon,
    PhoneIcon,
    PlusIcon,
    PushPinIcon,
    TrashIcon,
} from '@/components/icons'
import { useGetOrganizationById } from '@/hooks/api-hooks/use-organization'
import { useSeedOrganization } from '@/hooks/api-hooks/use-user-organization'
import { toast } from 'sonner'
import { orgBannerList } from '@/assets/pre-organization-banner-background'
import { IBranch, TEntityId } from '@/types'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { cn } from '@/lib'

export const Route = createFileRoute(
    '/onboarding/create-branch/$user_organization_id/$organization_id'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate()

    const { onOpen } = useConfirmModalStore()

    const { user_organization_id, organization_id } = Route.useParams()
    const [onOpenCreateBranchModal, setOpenCreateBranchModal] = useState(false)
    const { data: organization } = useGetOrganizationById(organization_id)
    const { data: branches } = useGetBranchesByOrganizationId(organization_id)
    const { mutateAsync: seed } = useSeedOrganization()
    const [branch, setBranch] = useState<IBranch>()

    const { mutate: deleteBranch } = useDeleteBranch({
        onSuccess: () => {
            toast.success(`Successfully deleted Branch!`)
        },
    })

    const handleSeedOrganizationWithBranch = async () => {
        if (organization?.id) {
            const response = await seed(organization_id)
            if (response) {
                toast.success(`Successfully seed the Organization with Branch!`)
                navigate({ to: '/onboarding' })
            }
        }
    }

    const handleDeleteBranch = async (
        branchId: TEntityId,
        userOrganizationId: TEntityId
    ) => {
        onOpen({
            title: 'Delete Branch',
            description: `You are about delete this branch, are you sure you want to proceed?`,
            onConfirm: () => {
                deleteBranch({ branchId, userOrganizationId })
            },
            confirmString: 'Proceed',
        })
    }

    const handleOpenCreateEditModal = (branch?: IBranch) => {
        if (branch) {
            setBranch(branch)
        } else {
            setBranch(undefined)
        }
        setOpenCreateBranchModal(true)
    }

    const isNoBranches = branches?.length === 0

    const defaultValues = {
        name: branch?.name ?? '',
        media_id: branch?.media.url ?? '',
        type: branch?.type ?? 'cooperative branch',
        email: branch?.email ?? '',
        description: branch?.description ?? '',
        contact_number: branch?.contact_number ?? '',
        address: branch?.address ?? '',
        province: branch?.province ?? '',
        country_code: branch?.country_code ?? '',
        city: branch?.city ?? '',
        region: branch?.region ?? '',
        barangay: branch?.barangay ?? '',
        postal_code: branch?.postal_code ?? '',
        latitude: branch?.latitude ?? 0,
        longitude: branch?.longitude ?? 0,
        is_main_branch: !!branch?.is_main_branch,
    }

    return (
        <div className="w-full">
            <CreateBranchForm
                open={onOpenCreateBranchModal}
                onOpenChange={setOpenCreateBranchModal}
                setOpenCreateBranchModal={setOpenCreateBranchModal}
                userOrganizationId={user_organization_id}
                branch={branch}
                defaultValues={defaultValues}
            />
            <div className="min-h-full w-full min-w-full rounded-none border-none bg-transparent">
                <div className="flex gap-x-5 px-2 py-5">
                    <SafeImage
                        className="size-24"
                        src={organization?.media?.id}
                    />
                    <div className="flex grow flex-col gap-y-2">
                        <h1 className="flex items-center gap-x-2 text-xl font-semibold">
                            <span>
                                <LandmarkIcon className="z-50" size={24} />
                            </span>
                            {organization?.name}
                        </h1>
                        <PlainTextEditor
                            className="text-sm"
                            content={organization?.description}
                        />
                        <div className="flex items-center gap-x-2">
                            <PushPinIcon className="text-red-400" />
                            <p className="text-xs">{organization?.address}</p>
                        </div>
                        <div className="flex items-center gap-x-2">
                            <PhoneIcon className="text-blue-400" />
                            <p className="text-xs">
                                {organization?.contact_number}
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={() => handleOpenCreateEditModal()}
                        variant={'secondary'}
                    >
                        <PlusIcon className="mr-2" />
                        Add Branch
                    </Button>
                </div>
                <p className="flex items-center gap-x-1 py-2">
                    <BranchIcon className="mr-2" />
                    List of Branches
                </p>
                <ScrollArea className="ecoop-scroll mb-10">
                    <div className="flex max-h-96 flex-col gap-y-3 overflow-y-auto">
                        {branches?.map((branch) => {
                            const mediaUrl =
                                branch?.media?.download_url ?? orgBannerList[0]
                            return (
                                <div key={branch.id}>
                                    <GradientBackground mediaUrl={mediaUrl}>
                                        <div className="relative flex min-h-10 w-full cursor-pointer items-center gap-x-2 rounded-2xl border-0 p-5 hover:bg-secondary/50 hover:no-underline">
                                            <SafeImage
                                                className="size-16"
                                                fallbackSrc={mediaUrl}
                                                src={mediaUrl}
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
                                                <div className="absolute bottom-7 right-2 z-50 flex gap-1 text-xs">
                                                    <Button
                                                        size={'sm'}
                                                        onClick={() => {
                                                            handleOpenCreateEditModal(
                                                                branch
                                                            )
                                                        }}
                                                        variant={'secondary'}
                                                        className={cn(
                                                            'flex max-h-7 space-x-2 text-xs'
                                                        )}
                                                    >
                                                        <span>edit</span>
                                                        <EditPencilIcon />
                                                    </Button>
                                                    <Button
                                                        size={'sm'}
                                                        onClick={() => {
                                                            handleDeleteBranch(
                                                                branch.id,
                                                                user_organization_id
                                                            )
                                                        }}
                                                        variant={'destructive'}
                                                        className={cn(
                                                            'flex max-h-7 space-x-2 text-xs'
                                                        )}
                                                    >
                                                        <span> delete</span>
                                                        <TrashIcon />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </GradientBackground>
                                </div>
                            )
                        })}
                    </div>
                    {isNoBranches && (
                        <div className="flex h-44 w-full items-center justify-center">
                            <p className="text-sm font-thin">
                                No branches to show
                            </p>{' '}
                            🍃
                        </div>
                    )}
                </ScrollArea>
                <div className="flex w-full items-center justify-end py-2">
                    <Button
                        variant={'outline'}
                        disabled={isNoBranches}
                        className="w-28"
                        onClick={async () => {
                            handleSeedOrganizationWithBranch()
                        }}
                    >
                        seed
                    </Button>
                </div>
            </div>
        </div>
    )
}
