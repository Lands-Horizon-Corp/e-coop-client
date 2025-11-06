import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { cn } from '@/helpers/tw-utils'
import { highlightMatch } from '@/modules/approvals/components/kanbans/journal-voucher/journal-voucher-kanban-main'
import { useGetBranchesByOrganizationId } from '@/modules/branch'
import {
    IOrganization,
    UpdateOrganizationFormModal,
} from '@/modules/organization'

import { ArrowChevronUpIcon, BadgeCheckFillIcon } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import CardTopImage from '@/components/ui/card-top-image'

import { useModalState } from '@/hooks/use-modal-state'

import { CustomOrganizationCardHeader } from './organization-card-header'
import { OrganizationCardLabel } from './organization-card-label'
import { CustomFooter } from './organization-footer-card'
import { OrganizationMiniCardToolTip } from './organization-mini-card-tooltip'

interface OrganizationMiniCardProps {
    organization: IOrganization
    isSeeding?: boolean
    className?: string
    onCardClick?: (organization: IOrganization) => void
    showActions?: boolean
    searchTerm?: string
    handleOpenOrgPreview?: (organization: IOrganization) => void
}

export const OrganizationMiniCard = ({
    organization,
    isSeeding = false,
    className,
    onCardClick,
    showActions = true,
    searchTerm,
    handleOpenOrgPreview,
}: OrganizationMiniCardProps) => {
    const updateModal = useModalState()
    const queryClient = useQueryClient()

    if (!organization || !organization.id) {
        return (
            <div
                className={cn(
                    'opacity-50 border border-dashed rounded-lg p-4',
                    className
                )}
            >
                <div className="text-center text-muted-foreground text-sm">
                    Invalid organization data
                </div>
            </div>
        )
    }

    const organizationName = organization?.name || 'Unnamed Organization'

    const handleEdit = (e?: React.MouseEvent) => {
        e?.stopPropagation()
        updateModal.onOpenChange(true)
    }

    const handleCardClick = () => {
        if (onCardClick && !isSeeding) {
            onCardClick(organization)
        }
    }

    const getImageSrc = () => {
        return (
            organization.media?.download_url ?? '/placeholder-organization.jpg'
        )
    }

    const handleSearchTerm = ({
        searchTerm,
        name,
    }: {
        searchTerm: string
        name: string
    }) => {
        return searchTerm
            ? highlightMatch(name || '-', searchTerm)
            : name || '-'
    }

    return (
        <OrganizationMiniCardToolTip
            content={
                <>
                    <UpdateOrganizationFormModal
                        {...updateModal}
                        className="w-full min-w-[80rem] max-w-[80rem]"
                        description="Update organization information"
                        formProps={{
                            organizationId: organization.id,
                            defaultValues: organization,
                            onSuccess: () => {
                                updateModal.onOpenChange(false)
                                queryClient.invalidateQueries({
                                    queryKey: ['get-all-organizations'],
                                })
                                toast.success(
                                    'Organization updated successfully!'
                                )
                            },
                        }}
                        title={`Update ${organizationName}`}
                    />
                    <CardTopImage
                        className={cn(
                            'transition-all duration-200',
                            onCardClick && 'cursor-pointer hover:shadow-lg',
                            className
                        )}
                        customFooter={
                            showActions ? (
                                <CustomFooter
                                    handleEdit={handleEdit}
                                    isSeeding={isSeeding}
                                    organization={organization}
                                />
                            ) : null
                        }
                        customHeader={CustomOrganizationCardHeader({
                            organization,
                            organizationName,
                            searchTerm,
                            handleSearchTerm,
                        })}
                        customLabel={OrganizationCardLabel({
                            organization,
                        })}
                        imageAlt={`${organizationName} organization`}
                        imageSrc={getImageSrc()}
                        onCardClick={handleCardClick}
                        onImageClick={
                            onCardClick
                                ? () => onCardClick(organization)
                                : undefined
                        }
                    />
                </>
            }
            customToolTipContent={
                <CustomOrganizationToolTipContent
                    handleOpenOrgPreview={handleOpenOrgPreview}
                    organization={organization}
                />
            }
        />
    )
}

type CustomOrganizationToolTipConentProps = {
    organization: IOrganization
    handleOpenOrgPreview?: (org: IOrganization) => void
}

export const CustomOrganizationToolTipContent = ({
    organization,
    handleOpenOrgPreview,
}: CustomOrganizationToolTipConentProps) => {
    const { data: branches, isPending: isPendingBranches } =
        useGetBranchesByOrganizationId({ organizationId: organization.id })
    const organizationName = organization.name ?? ''
    return (
        <div className="h-[300px] rounded-xl overflow-hidden bg-background shadow-2xl shadow-black/10">
            <div
                className="h-1/2 w-full rounded-t-xl"
                style={{
                    background: `url(${organization?.media?.download_url}) center center / cover no-repeat`,
                }}
            />
            <div className="h-1/2 p-2 px-5 space-y-1">
                <div className="flex items-center justify-between gap-2">
                    <h1 className=" truncate min-w-0 text-lg text-foreground">
                        {organizationName}
                    </h1>
                    <Button
                        className="rounded-full"
                        onClick={() => {
                            handleOpenOrgPreview?.(organization)
                        }}
                        size={'icon'}
                        variant={'outline'}
                    >
                        <ArrowChevronUpIcon
                            className="text-primary"
                            size={25}
                        />
                    </Button>
                </div>
                <div>
                    <Badge className="mb-2 text-[10px]" variant={'outline'}>
                        <BadgeCheckFillIcon className="text-primary mr-1" />
                        {isPendingBranches
                            ? 'Loading...'
                            : (branches?.length ?? 0)}{' '}
                        Branches
                    </Badge>
                </div>
                <div className="flex ecoop-scroll overflow-x-auto flex-wrap gap-1">
                    {organization.organization_categories?.map(
                        (catItem, index) => {
                            if (index > 3) return null
                            return (
                                <Badge
                                    className="mb-1 border-0 p-0 text-[10px]"
                                    key={catItem.id}
                                    variant="outline"
                                >
                                    • {catItem.category?.name}
                                </Badge>
                            )
                        }
                    )}
                    {organization?.organization_categories && (
                        <>
                            {organization?.organization_categories?.length - 3 >
                                0 && (
                                <Badge className="mb-1 border-0 px-1 py-0.2 text-[10px]">
                                    {organization?.organization_categories
                                        ?.length - 3}{' '}
                                    more
                                </Badge>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
