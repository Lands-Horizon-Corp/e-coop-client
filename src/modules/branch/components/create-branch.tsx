import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { toast } from 'sonner'

import { cn } from '@/helpers/tw-utils'
import {
    IBranch,
    useDeleteBranch,
    useGetBranchesByOrganizationId,
} from '@/modules/branch'
import CreateUpdateBranchFormModal from '@/modules/branch/components/forms/create-branch-form'
import {
    IOrganization,
    UpdateOrganizationFormModal,
    useGetById,
} from '@/modules/organization'
import { useSeedOrganization } from '@/modules/user-organization/user-organization.service'
import useConfirmModalStore from '@/store/confirm-modal-store'

import { GradientBackground } from '@/components/gradient-background/gradient-background'
import {
    AddressCardIcon,
    BranchIcon,
    CheckFillIcon,
    EditPencilIcon,
    LandmarkIcon,
    LoadingCircleIcon,
    PhoneIcon,
    PlusIcon,
    PushPinIcon,
    TrashIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { PlainTextEditor } from '@/components/ui/text-editor'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { useLocationInfo } from '@/hooks/use-location-info'
import { useModalState } from '@/hooks/use-modal-state'

import { TEntityId } from '@/types'

export const CreateBranch = () => {
    const { organization_id: organizationId } = useParams({
        from: '/onboarding/create-branch/$organization_id',
    })

    const navigate = useNavigate()
    const { mutateAsync: seed, isPending: isSeeding } = useSeedOrganization()

    const { data: organization, isPending: isPendingOrganization } = useGetById(
        {
            id: organizationId,
        }
    )

    const { data: branches, isPending: isPendingBranches } =
        useGetBranchesByOrganizationId({ organizationId: organizationId })

    const isNoBranches = branches?.length === 0

    const handleSeedOrganizationWithBranch = async () => {
        if (organization?.id) {
            const response = await seed(organization.id)
            if (response) {
                toast.success(`Successfully seed the Organization with Branch!`)
                navigate({ to: '/onboarding' })
            }
        }
    }

    return (
        <div className="w-full">
            <OrganizationHeader
                organizationId={organizationId}
                isPending={isPendingOrganization}
                organization={organization}
            />
            <BranchesList
                branches={branches}
                isPending={isPendingBranches}
                isSeeding={isSeeding}
                organizationId={organizationId}
            />
            <div className="flex w-full items-center justify-end py-2">
                <Button
                    disabled={isNoBranches || isSeeding}
                    onClick={handleSeedOrganizationWithBranch}
                >
                    {' '}
                    {isSeeding ? 'Seeding' : ''}
                    {isSeeding ? (
                        <LoadingCircleIcon className="ml-2 animate-spin" />
                    ) : (
                        <>
                            <CheckFillIcon className="mr-2" />
                            Click here to finish setup
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}

type OrganizationHeaderProps = {
    organizationId: TEntityId
    isPending: boolean
    organization?: IOrganization
}

function OrganizationHeader({
    organizationId,
    isPending,
    organization,
}: OrganizationHeaderProps) {
    const createModal = useModalState()
    const updateModal = useModalState()
    const { countryCode } = useLocationInfo()
    const queryClient = useQueryClient()

    if (isPending) {
        return (
            <div className="flex gap-x-5 px-2 py-5">
                <Skeleton className="size-24 rounded-lg" />
                <div className="flex grow flex-col gap-y-2">
                    <Skeleton className="h-6 w-3/4 rounded-md" />
                    <Skeleton className="h-12 w-full rounded-md" />
                    <div className="flex items-center gap-x-2">
                        <Skeleton className="size-4 rounded-full" />
                        <Skeleton className="h-4 w-2/3 rounded-md" />
                    </div>
                    <div className="flex items-center gap-x-2">
                        <Skeleton className="size-4 rounded-full" />
                        <Skeleton className="h-4 w-1/2 rounded-md" />
                    </div>
                </div>
                <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
        )
    }

    if (!organization) return null

    return (
        <GradientBackground
            imageBackgroundClassName="size-100 !opacity-20 !-z-40"
            className="p-7  border"
            mediaUrl={organization?.cover_media?.url}
        >
            <div className="flex gap-x-5 z-[999]">
                <CreateUpdateBranchFormModal
                    {...createModal}
                    className="w-full min-w-[80rem] max-w-[80rem]"
                    title="Create Branch"
                    description="Fill out the form to add new branch"
                    formProps={{
                        organizationId,
                        defaultValues: {
                            country_code: countryCode,
                        },
                        hiddenFields: ['is_main_branch'],
                        onSuccess: () => {
                            createModal.onOpenChange(false)
                            queryClient.invalidateQueries({
                                queryKey: ['get-branches-by-organization-id'],
                            })
                        },
                    }}
                />
                <UpdateOrganizationFormModal
                    {...updateModal}
                    className="w-full min-w-[80rem] max-w-[80rem]"
                    formProps={{
                        organizationId,
                        defaultValues: organization,
                        coverMedia: organization?.cover_media,
                        media: organization?.media,
                        onSuccess: () => {
                            updateModal.onOpenChange(false)
                            queryClient.invalidateQueries({
                                queryKey: ['organization'],
                            })
                        },
                    }}
                />
                <PreviewMediaWrapper media={organization?.media?.url}>
                    <ImageDisplay
                        className="size-36 rounded-lg"
                        src={organization?.media?.url}
                    />
                </PreviewMediaWrapper>

                <div className="flex grow flex-col gap-y-2">
                    <h1 className="flex items-center gap-x-2 text-xl font-semibold">
                        <span>
                            <LandmarkIcon className="z-50" size={24} />
                        </span>
                        {organization?.name}
                    </h1>
                    <PlainTextEditor
                        className="text-sm italic rounded-xl p-2 bg-secondary/20"
                        content={organization?.description ?? ''}
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
                <div className="flex flex-col items-start space-y-2 z-50">
                    <Button
                        className="w-full"
                        onClick={() => createModal.onOpenChange(true)}
                    >
                        <PlusIcon className="mr-2" />
                        Add Branch
                    </Button>
                    <Button
                        variant={'secondary'}
                        onClick={() => updateModal.onOpenChange(true)}
                        className="w-full"
                    >
                        <EditPencilIcon className="mr-2" />
                        Edit Organization
                    </Button>
                </div>
            </div>
        </GradientBackground>
    )
}

type BranchesListProps = {
    branches: IBranch[] | undefined
    isPending: boolean
    isSeeding: boolean
    organizationId: TEntityId
}

function BranchesList({
    branches,
    isPending,
    isSeeding,
    organizationId,
}: BranchesListProps) {
    if (isPending) {
        return (
            <div className="flex flex-col gap-y-3 px-2 py-5">
                {Array.from({ length: 2 }).map((_, index) => (
                    <div key={index} className="flex gap-x-5 px-2 py-5">
                        <div className="relative flex min-h-10 w-full rounded-2xl border-0 p-5">
                            <Skeleton className="size-16 rounded-full" />
                            <div className="ml-2 flex grow flex-col">
                                <Skeleton className="mb-2 h-6 w-3/4 rounded-md" />
                                <Skeleton className="h-10 w-full rounded-md" />
                                <div className="mb-1 mt-2 flex items-center gap-y-1">
                                    <Skeleton className="mr-2 size-4 rounded-full" />
                                    <Skeleton className="h-4 w-2/3 rounded-md" />
                                </div>
                                <div className="flex items-center gap-y-1">
                                    <Skeleton className="mr-2 size-4 rounded-full" />
                                    <Skeleton className="h-4 w-1/2 rounded-md" />
                                </div>
                                <div className="absolute bottom-7 right-2 z-50 flex gap-1">
                                    <Skeleton className="h-7 w-16 rounded-md" />
                                    <Skeleton className="h-7 w-16 rounded-md" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (!branches || branches.length === 0) {
        return (
            <div className="flex h-44 w-full items-center justify-center">
                <p className="text-sm font-thin">No branches to show</p> 🍃
            </div>
        )
    }

    return (
        <>
            <p className="flex items-center gap-x-1 py-2">
                <BranchIcon className="mr-2" />
                List of Branches
            </p>
            <ScrollArea className="ecoop-scroll mb-10">
                <div className="flex max-h-96 flex-col gap-y-3 overflow-y-auto">
                    {branches.map((branch) => (
                        <BranchBar
                            key={branch.id}
                            branch={branch}
                            isSeeding={isSeeding}
                            organizationId={organizationId}
                        />
                    ))}
                </div>
            </ScrollArea>
        </>
    )
}

type BranchBarProps = {
    branch: IBranch
    isSeeding: boolean
    organizationId: TEntityId
}

export const BranchBar = ({
    branch,
    isSeeding,
    organizationId,
}: BranchBarProps) => {
    const updateModal = useModalState()
    const { onOpen } = useConfirmModalStore()
    const queryClient = useQueryClient()

    const { mutate: deleteBranch } = useDeleteBranch({
        options: {
            onSuccess: () => {
                toast.success(`Successfully deleted Branch!`)
                queryClient.invalidateQueries({
                    queryKey: [
                        'get-branches-by-organization-id',
                        organizationId,
                    ],
                })
            },
        },
    })

    const handleDelete = () => {
        onOpen({
            title: 'Delete Branch',
            description: `You are about to delete this branch. Are you sure you want to proceed?`,
            onConfirm: () => deleteBranch(branch.id),
            confirmString: 'Proceed',
        })
    }

    return (
        <>
            <CreateUpdateBranchFormModal
                {...updateModal}
                title="Update Branch"
                description="Fill out the form to update branch"
                className="w-full min-w-[80rem] max-w-[80rem]"
                formProps={{
                    organizationId,
                    branchId: branch.id,
                    hiddenFields: ['is_main_branch'],
                    defaultValues: {
                        ...branch,
                    },
                    onSuccess: () => {
                        updateModal.onOpenChange(false)
                        queryClient.invalidateQueries({
                            queryKey: [
                                'get-branches-by-organization-id',
                                organizationId,
                            ],
                        })
                    },
                }}
            />
            <GradientBackground
                mediaUrl={branch.media?.url ?? ''}
                className="border-[0.5px] border-secondary/50"
            >
                <div className="relative flex min-h-10 w-full cursor-pointer items-center gap-x-2 rounded-2xl border-0 p-5 hover:bg-secondary/50 hover:no-underline">
                    <ImageDisplay
                        className="size-16 rounded-lg"
                        src={branch?.media?.url}
                    />
                    <div className="flex grow flex-col">
                        <h1>{branch?.name}</h1>
                        {branch.description && (
                            <PlainTextEditor
                                className="text-xs"
                                content={branch?.description ?? ''}
                            />
                        )}
                        <p className="flex items-center gap-y-1 text-xs">
                            <AddressCardIcon className="mr-2" />
                            {branch.address}
                        </p>
                        <div className="absolute bottom-4 right-2 z-50 flex gap-1 text-xs">
                            <Button
                                size={'sm'}
                                onClick={() => updateModal.onOpenChange(true)}
                                variant={'secondary'}
                                disabled={isSeeding}
                                className={cn('flex max-h-7 space-x-2 text-xs')}
                            >
                                <span>edit</span>
                                <EditPencilIcon />
                            </Button>
                            <Button
                                size={'sm'}
                                disabled={isSeeding}
                                onClick={handleDelete}
                                variant={'destructive'}
                                className={cn('flex max-h-7 space-x-2 text-xs')}
                            >
                                <span> delete</span>
                                <TrashIcon />
                            </Button>
                        </div>
                    </div>
                </div>
            </GradientBackground>
        </>
    )
}

export default CreateBranch
