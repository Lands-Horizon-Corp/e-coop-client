import { useQueryClient } from '@tanstack/react-query'

import {
    IOrganization,
    UpdateOrganizationFormModal,
} from '@/modules/organization'
import { BranchInfoItem } from '@/modules/organization/organization-forms/branch-card-info'

import { EditPencilIcon, PlusIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import TruncatedText from '@/components/ui/truncated-text'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { useModalState } from '@/hooks/use-modal-state'

type OrganizationCardProps = {
    organization?: IOrganization
    onCreateBranch?: () => void
    isLoading?: boolean
}

const OrganizationCard = ({
    organization,
    onCreateBranch,
    isLoading,
}: OrganizationCardProps) => {
    const updateModal = useModalState(false)
    const queryClient = useQueryClient()

    if (isLoading) {
        return <OrganizationCardSkeleton />
    }

    if (!organization) {
        return null
    }

    const mediaUrl = organization?.cover_media?.url
    const categories = organization?.organization_categories ?? []
    const organizationId = organization?.id || ''
    const description =
        organization?.description || 'Organization description not available.'

    return (
        <div
            className="flex relative w-full h-[80vh] max-h-screen bg-fixed bg-cover rounded-t-4xl bg-top flex-col gap-y-2 ecoop-scroll overflow-y-auto"
            style={{ backgroundImage: `url(${mediaUrl})` }}
        >
            <UpdateOrganizationFormModal
                {...updateModal}
                className="w-full min-w-[70rem] max-w-[80rem]"
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

            <div className="absolute w-full bottom-0 pb-10 overflow-auto h-fit px-8 pt-50 bg-gradient-to-t from-background via-background/90 via-30% to-transparent">
                <div>
                    <PreviewMediaWrapper media={organization?.media}>
                        <ImageDisplay
                            className="object-cover size-30 hover:border-2 hover:border-inherit"
                            src={organization?.media?.download_url || undefined}
                        />
                    </PreviewMediaWrapper>
                </div>

                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-2">
                        <h1 className="text-[min(50px,8vw)] font-sans font-black leading-tight">
                            {organization?.name}
                        </h1>
                    </div>

                    <div className="flex-1 space-y-2">
                        <BranchInfoItem
                            className=""
                            content={
                                categories.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                        {categories.map((catItem) => (
                                            <Badge
                                                className="mr-1 mb-1"
                                                key={catItem.id}
                                            >
                                                {catItem.category?.name}
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    'No categories selected'
                                )
                            }
                            contentClassName="flex items-center"
                            textAlign="left"
                            title="Categories:"
                        />

                        <BranchInfoItem
                            content={
                                <Badge variant="secondary">
                                    {organization?.subscription_plan?.name ||
                                        'No plan selected'}
                                </Badge>
                            }
                            contentClassName="translate-y-1"
                            title="Selected Plan"
                        />
                    </div>
                </div>

                <div className="pt-4 text-muted-foreground">
                    <TruncatedText
                        className="text-muted-foreground"
                        maxLength={250}
                        showLessText="Read less"
                        showMoreText="Read more"
                        text={description}
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-6">
                    {onCreateBranch && (
                        <Button onClick={onCreateBranch} size="sm">
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Add Branch
                        </Button>
                    )}

                    <Button
                        onClick={() => updateModal.onOpenChange(true)}
                        size="sm"
                        variant="secondary"
                    >
                        <EditPencilIcon className="mr-2 h-4 w-4" />
                        Edit Organization
                    </Button>
                </div>
            </div>
        </div>
    )
}

const OrganizationCardSkeleton = () => {
    return (
        <div className="flex relative w-full h-[80vh] bg-gray-200 rounded-t-4xl animate-pulse">
            <div className="absolute w-full bottom-0 pb-10 px-8 pt-50 bg-gradient-to-t from-background via-background/90 via-30% to-transparent">
                <Skeleton className="size-30 mb-4" />
                <Skeleton className="h-12 w-3/4 mb-4" />
                <div className="space-y-2 mb-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-32" />
                </div>
            </div>
        </div>
    )
}

export default OrganizationCard
