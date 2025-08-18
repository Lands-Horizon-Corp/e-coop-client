import { toast } from 'sonner'
import z from 'zod'

import { cn } from '@/helpers/tw-utils'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { CreateUpdateBranchFormModal } from '@/components/forms/onboarding-forms/create-branch-form'
import UpdateOrganizationFormModal from '@/components/forms/onboarding-forms/update-organization-form'
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
import PlainTextEditor from '@/components/plain-text-editor'
import RawDescription from '@/components/raw-description'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'

import { entityIdSchema } from '@/validations/common'

import {
    useDeleteBranch,
    useGetBranchesByOrganizationId,
} from '@/hooks/api-hooks/use-branch'
import { useGetOrganizationById } from '@/hooks/api-hooks/use-organization'
import { useSeedOrganization } from '@/hooks/api-hooks/use-user-organization'
import { useLocationInfo } from '@/hooks/use-location-info'
import { useModalState } from '@/hooks/use-modal-state'

import { IBranch, TEntityId } from '@/types'

const routeSchema = z.object({
    organization_id: entityIdSchema,
})

export const Route = createFileRoute(
    '/onboarding/create-branch/$organization_id'
)({
    component: RouteComponent,
    params: {
        parse: (params) => {
            const data = routeSchema.parse(params)
            return data
        },
    },
})

function RouteComponent() {
    const navigate = useNavigate()

    const { countryCode } = useLocationInfo()
    const { organization_id } = Route.useParams()

    const { data: organization, isPending: isPendingOrganization } =
        useGetOrganizationById(organization_id)

    const { data: branches, isPending: isPendingBranches } =
        useGetBranchesByOrganizationId(organization_id)

    const { mutateAsync: seed, isPending: isSeeding } = useSeedOrganization()

    const handleSeedOrganizationWithBranch = async () => {
        if (organization?.id) {
            const response = await seed(organization_id)
            if (response) {
                toast.success(`Successfully seed the Organization with Branch!`)
                navigate({ to: '/onboarding' })
            }
        }
    }

    const createModal = useModalState()
    const updateOrganization = useModalState()

    const isNoBranches = branches?.length === 0
    return (
        <div className="w-full">
            <CreateUpdateBranchFormModal
                {...createModal}
                formProps={{
                    organizationId: organization_id,
                    defaultValues: {
                        country_code: countryCode,
                    },
                    hiddenFields: ['is_main_branch'],
                }}
            />
            <UpdateOrganizationFormModal
                formProps={{
                    organizationId: organization_id,
                    defaultValues: organization,
                    coverMedia: organization?.cover_media,
                    media: organization?.media,
                }}
                {...updateOrganization}
            />
            <div className="min-h-full w-full min-w-full rounded-none border-none bg-transparent py-5">
                {isPendingOrganization ? (
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
                ) : (
                    <div className="flex gap-x-5 px-2 py-5">
                        <ImageDisplay
                            className="size-24 rounded-lg"
                            src={organization?.media?.url}
                        />
                        <div className="flex grow flex-col gap-y-2">
                            <h1 className="flex items-center gap-x-2 text-xl font-semibold">
                                <span>
                                    <LandmarkIcon className="z-50" size={24} />
                                </span>
                                {organization?.name}
                            </h1>
                            <RawDescription
                                className="text-sm"
                                content={organization?.description ?? ''}
                            />
                            <div className="flex items-center gap-x-2">
                                <PushPinIcon className="text-red-400" />
                                <p className="text-xs">
                                    {organization?.address}
                                </p>
                            </div>
                            <div className="flex items-center gap-x-2">
                                <PhoneIcon className="text-blue-400" />
                                <p className="text-xs">
                                    {organization?.contact_number}
                                </p>
                            </div>
                        </div>
                        <div className="flex  items-start flex-col space-y-2">
                            <Button
                                variant={'secondary'}
                                disabled={isSeeding}
                                onClick={() => createModal.onOpenChange(true)}
                            >
                                <PlusIcon className="mr-2" />
                                Add Branch
                            </Button>
                            <Button
                                variant={'secondary'}
                                onClick={() =>
                                    updateOrganization.onOpenChange(true)
                                }
                                className="w-full"
                            >
                                <EditPencilIcon className="mr-2" />
                                edit
                            </Button>
                        </div>
                    </div>
                )}
                <p className="flex items-center gap-x-1 py-2">
                    <BranchIcon className="mr-2" />
                    List of Branches
                </p>
                <ScrollArea className="ecoop-scroll mb-10">
                    <div className="flex max-h-96 flex-col gap-y-3 overflow-y-auto">
                        {isPendingBranches &&
                            Array.from({
                                length: 2,
                            }).map(() => {
                                const key = Math.random()
                                return (
                                    <div
                                        key={key}
                                        className="flex gap-x-5 px-2 py-5"
                                    >
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
                                )
                            })}
                        {isNoBranches ? (
                            <div className="flex h-44 w-full items-center justify-center">
                                <p className="text-sm font-thin">
                                    No branches to show
                                </p>{' '}
                                🍃
                            </div>
                        ) : (
                            branches?.map((branch) => {
                                return (
                                    <BranchBar
                                        key={branch.id}
                                        branch={branch}
                                        isSeeding={isSeeding}
                                        organizationId={organization_id}
                                    />
                                )
                            })
                        )}
                    </div>
                </ScrollArea>
                <div className="flex w-full items-center justify-end py-2">
                    <Button
                        disabled={isNoBranches || isSeeding}
                        onClick={async () => {
                            handleSeedOrganizationWithBranch()
                        }}
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
        </div>
    )
}

export const BranchBar = ({
    branch,
    isSeeding,
    organizationId,
}: {
    branch: IBranch
    isSeeding: boolean
    organizationId: TEntityId
}) => {
    const updateModal = useModalState()
    const { onOpen } = useConfirmModalStore()

    const { mutate: deleteBranch } = useDeleteBranch({
        onSuccess: () => {
            toast.success(`Successfully deleted Branch!`)
        },
    })

    return (
        <>
            <CreateUpdateBranchFormModal
                {...updateModal}
                formProps={{
                    organizationId,
                    branchId: branch.id,
                    hiddenFields: ['is_main_branch'],
                    defaultValues: {
                        ...branch,
                    },
                }}
            />
            <div>
                <GradientBackground mediaUrl={branch.media?.url ?? ''}>
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
                            <div className="absolute bottom-7 right-2 z-50 flex gap-1 text-xs">
                                <Button
                                    size={'sm'}
                                    onClick={() => {
                                        updateModal.onOpenChange(true)
                                    }}
                                    variant={'secondary'}
                                    disabled={isSeeding}
                                    className={cn(
                                        'flex max-h-7 space-x-2 text-xs'
                                    )}
                                >
                                    <span>edit</span>
                                    <EditPencilIcon />
                                </Button>
                                <Button
                                    size={'sm'}
                                    disabled={isSeeding}
                                    onClick={() =>
                                        onOpen({
                                            title: 'Delete Branch',
                                            description: `You are about delete this branch, are you sure you want to proceed?`,
                                            onConfirm: () => {
                                                deleteBranch(branch.id)
                                            },
                                            confirmString: 'Proceed',
                                        })
                                    }
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
        </>
    )
}
