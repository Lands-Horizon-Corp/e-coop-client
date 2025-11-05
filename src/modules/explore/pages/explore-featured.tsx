import { useMemo } from 'react'

import Fuse from 'fuse.js'

import {
    IOrganization,
    useGetAllOrganizationsExplore,
} from '@/modules/organization'
import { OrganizationMiniCard } from '@/modules/organization/components/cards/organization-mini-card'

import RefreshButton from '@/components/buttons/refresh-button'
import { CompassIcon, StarIcon, TrendingDownIcon } from '@/components/icons'
import {
    ImagePreviewNext,
    ImagePreviewPrevious,
} from '@/components/image-preview/image-preview'
import { Badge } from '@/components/ui/badge'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '@/components/ui/carousel'

import EmptyState from '../components/empty-state'
import LoadingSkeleton from '../components/loading-skeleton'
import { organizationFuseOptions } from '../utils/data-grouping'

type ExploreFeaturedProps = {
    searchTerm?: string
    mode: 'featured' | 'recently'
    handleSelectedOrganization?: (org: IOrganization) => void
}

const ExploreFeatured = ({
    searchTerm,
    mode,
    handleSelectedOrganization,
}: ExploreFeaturedProps) => {
    const {
        data: organizations,
        isLoading,
        refetch,
    } = useGetAllOrganizationsExplore({
        mode: mode,
    })

    const workingOrganizations = useMemo(
        () => organizations ?? [],
        [organizations]
    )

    const fuse = useMemo(() => {
        return new Fuse<IOrganization>(
            workingOrganizations,
            organizationFuseOptions
        )
    }, [workingOrganizations])

    const filteredOrganizations = useMemo(() => {
        if (!searchTerm?.trim()) {
            return workingOrganizations
        }

        return fuse.search(searchTerm).map((result) => result.item)
    }, [searchTerm, fuse, workingOrganizations])

    return (
        <div>
            <div className={`flex items-center gap-2 my-2 justify-between`}>
                <div className="flex items-center gap-2">
                    {mode === 'featured' ? <StarIcon /> : <TrendingDownIcon />}
                    <h2 className="text-xl font-semibold">
                        {mode === 'featured'
                            ? 'Featured Organizations'
                            : 'Recently Viewed Organizations'}
                    </h2>
                    <Badge className="ml-2" variant="secondary">
                        {filteredOrganizations.length}
                    </Badge>
                </div>
                <RefreshButton
                    className="bg-transparent"
                    isLoading={isLoading}
                    onClick={() => refetch()}
                />
            </div>
            <Carousel
                className="w-full"
                opts={{
                    align: 'start',
                }}
            >
                <CarouselContent>
                    {isLoading ? (
                        <LoadingSkeleton />
                    ) : filteredOrganizations.length === 0 ? (
                        <div className="w-full">
                            <EmptyState
                                icon={
                                    <CompassIcon className="h-16 w-16 text-muted-foreground" />
                                }
                                type={
                                    mode === 'featured'
                                        ? 'Featured Organizations'
                                        : 'Recent Organizations'
                                }
                            />
                        </div>
                    ) : (
                        filteredOrganizations.map((item, index) => (
                            <CarouselItem
                                className="md:basis-1/2 lg:basis-1/5"
                                key={index}
                            >
                                <OrganizationMiniCard
                                    handleOpenOrgPreview={(org) => {
                                        handleSelectedOrganization?.(org)
                                    }}
                                    onCardClick={() =>
                                        handleSelectedOrganization?.(item)
                                    }
                                    showActions={false}
                                    organization={item}
                                    searchTerm={searchTerm}
                                />
                            </CarouselItem>
                        ))
                    )}
                </CarouselContent>
                <ExplorePageCardPreviewController />
            </Carousel>
        </div>
    )
}

export default ExploreFeatured

export const ExplorePageCardPreviewController = () => {
    return (
        <div>
            <ImagePreviewPrevious
                className={`-left-10 border-0  rounded-none rounded-tl-xs rounded-bl-xs h-full bg-background/80 dark:!bg-black/20`}
            />
            <ImagePreviewNext
                className={`right-0 h-full rounded-none rounded-tr-xs rounded-br-xs border-0 !bg-background/50`}
            />
        </div>
    )
}
