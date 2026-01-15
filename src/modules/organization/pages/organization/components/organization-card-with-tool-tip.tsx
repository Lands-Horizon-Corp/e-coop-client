import { CustomOrganizationToolTipContent } from '@/modules/organization/components/cards/organization-mini-card'
import { OrganizationMiniCardToolTip } from '@/modules/organization/components/cards/organization-mini-card-tooltip'
import { IOrganization } from '@/modules/organization/organization.types'

import { highlightMatch } from '@/components/hightlight-match'
import { OrganizationIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'

type TOrganizationCardWithTooltipProps = {
    organization: IOrganization
    handleOpenModalPreview: (org: IOrganization) => void
    searchTerm?: string
}

const OrganizationWithToopTip = ({
    organization: org,
    handleOpenModalPreview,
    searchTerm,
}: TOrganizationCardWithTooltipProps) => {
    return (
        <OrganizationMiniCardToolTip
            content={
                <div className="flex flex-col gap-y-2 h-[200px] ">
                    <ImageDisplay
                        className="flex-5 size-full rounded-lg hover:scale-102 duration-800 ease-in-out transition"
                        src={org.cover_media?.download_url}
                    />
                    <div className="flex-1 inline-flex items-center px-2 border-[0.5px] border-primary/30 bg-sidebar/80 rounded-lg">
                        <OrganizationIcon className="text-primary" />
                        <h1 className="p-1 px-2 font-semibold truncate text-foreground text-sm">
                            {highlightMatch(org.name, searchTerm ?? '')}
                        </h1>
                    </div>
                </div>
            }
            customToolTipContent={
                <CustomOrganizationToolTipContent
                    handleOpenOrgPreview={(org) => {
                        handleOpenModalPreview(org)
                    }}
                    organization={org}
                />
            }
        />
    )
}

export default OrganizationWithToopTip
