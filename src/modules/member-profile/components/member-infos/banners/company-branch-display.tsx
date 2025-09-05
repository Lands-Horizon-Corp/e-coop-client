import { cn } from '@/helpers'
import { IBranch } from '@/modules/branch'
import { IOrganization } from '@/modules/organization'

import { MapMarkedIcon, OpenExternalLinkIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import OpenExternalMap from '@/components/map/open-external-map'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { IClassProps } from '@/types'

interface Props extends IClassProps {
    branch?: IBranch
    organization?: IOrganization
}

const OrganizationBranchDisplay = ({
    branch,
    organization,
    className,
}: Props) => {
    return (
        <div className={cn('flex gap-x-2', className)}>
            <div className="flex min-w-64 items-end gap-x-2">
                <PreviewMediaWrapper media={branch?.media}>
                    <ImageDisplay
                        src={organization?.media?.download_url}
                        className="size-16 rounded-xl"
                        fallbackClassName="rounded-xl size-16"
                    />
                </PreviewMediaWrapper>
                <div className="space-y-1">
                    <p>{organization?.name ?? '-'}</p>
                    <p className="text-xs text-muted-foreground/70">
                        organization
                    </p>
                </div>
            </div>
            <div className="flex min-w-64 items-end gap-x-2">
                <PreviewMediaWrapper media={branch?.media}>
                    <ImageDisplay
                        src={branch?.media?.download_url}
                        className="size-16 rounded-xl"
                        fallbackClassName="rounded-xl size-16"
                    />
                </PreviewMediaWrapper>
                <div className="space-y-1">
                    <p>{branch?.name ?? '-'}</p>
                    <p className="text-xs text-muted-foreground/70">Branch</p>
                </div>
            </div>
            <div className="flex min-w-64 items-end gap-x-2">
                <span className="size-16 rounded-xl bg-secondary p-2">
                    <MapMarkedIcon className="size-full" />
                </span>

                <div className="space-y-1">
                    <p>{branch?.name ? `${branch?.name} Location` : '-'}</p>
                    <p className="text-xs text-muted-foreground/70">
                        Open Branch Location on Google Map
                    </p>
                    {branch?.latitude && branch?.longitude && (
                        <OpenExternalMap
                            lat={branch?.latitude}
                            lon={branch?.longitude}
                            className="text-xs text-muted-foreground/40 duration-300 ease-out hover:text-muted-foreground hover:underline"
                        >
                            Open External
                            <OpenExternalLinkIcon className="ml-1 inline" />
                        </OpenExternalMap>
                    )}
                </div>
            </div>
        </div>
    )
}

export default OrganizationBranchDisplay
