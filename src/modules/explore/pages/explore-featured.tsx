import { useMemo } from 'react'

import Fuse from 'fuse.js'

import {
    IOrganization,
    useGetAllOrganizationsExplore,
} from '@/modules/organization'
import { OrganizationCardWithToolTip } from '@/modules/organization/pages/organization'

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
        <div className="">
            <div className={`flex items-center gap-2 my-2 justify-between`}>
                <div className="flex items-center gap-2">
                    {mode === 'featured' ? (
                        <StarIcon className="text-primary" />
                    ) : (
                        <TrendingDownIcon className="text-pr" />
                    )}
                    <h2 className="text-xl font-semibold">
                        {mode === 'featured'
                            ? 'Featured Organizations'
                            : 'Recently Viewed Organizations'}
                    </h2>
                    <Badge className="ml-2">
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
                                className="md:basis-1/2 pl-2 lg:basis-1/6"
                                key={index}
                            >
                                <OrganizationCardWithToolTip
                                    handleOpenModalPreview={(org) => {
                                        handleSelectedOrganization?.(org)
                                    }}
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
                className={`-left-10 border-0 rounded-none rounded-tl-xs rounded-bl-xs h-full  from-background/20 !opacity-80 to-background bg-gradient-to-r`}
            />
            <ImagePreviewNext
                className={`-right-5 ease-in-out duration-300 h-full px-2 w-[3.5rem] -translate-x-5 rounded-none rounded-tr-xs !opacity-80 rounded-br-xs border-0 !bg-background/50 dark:from-background dark:to-background/0 dark:via-background via-10% dark:bg-gradient-to-l`}
            />
        </div>
    )
}
