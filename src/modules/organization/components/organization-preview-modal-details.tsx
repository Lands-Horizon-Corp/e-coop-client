import { cn } from '@/helpers'
import {
    BuildingIcon,
    CalendarIcon,
    PhoneIcon,
    StarIcon,
    TagIcon,
} from 'lucide-react'

import { EmailIcon, PinLocationIcon as LocationIcon } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface OrganizationDetailsProps {
    organization: any
    categories?: any[]
    showActions?: boolean
    onJoin?: () => void
    onCreateBranch?: () => void
}

const OrganizationPreviewModalDetails = ({
    organization,
    categories = [],
}: OrganizationDetailsProps) => {
    return (
        <div className="space-y-6 py-6 px-8 w-full">
            {/* Header */}
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">
                    {organization.name}
                </h2>

                <div className="flex items-center gap-2">
                    <Badge className="text-xs px-2 py-1" variant="secondary">
                        <BuildingIcon className="h-3 w-3 mr-1" />
                        {organization.organization_key}
                    </Badge>

                    {organization.subscription_plan && (
                        <Badge className="text-xs px-2 py-1" variant="default">
                            <StarIcon className="h-3 w-3 mr-1" />
                            {organization.subscription_plan.name}
                        </Badge>
                    )}
                </div>
            </div>
            <Separator />
            {/* Organization Details */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Organization Details</h3>

                {/* Description */}
                {organization.description && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">
                            About
                        </h4>
                        <p className="text-sm leading-relaxed">
                            {organization.description}
                        </p>
                    </div>
                )}

                {/* Categories */}
                {categories.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                            <TagIcon className="h-3 w-3" />
                            Categories
                        </h4>
                        <div className="flex flex-wrap gap-1">
                            {categories.map((catItem) => (
                                <Badge
                                    className="text-xs"
                                    key={catItem.id}
                                    variant="outline"
                                >
                                    {catItem.category?.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Contact Information */}
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-muted-foreground">
                        Contact Information
                    </h4>

                    <div className="space-y-2">
                        {organization.email && (
                            <div className="flex items-center gap-2">
                                <EmailIcon className="h-4 w-4 text-muted-foreground" />
                                <a
                                    className="text-sm text-primary hover:underline"
                                    href={`mailto:${organization.email}`}
                                >
                                    {organization.email}
                                </a>
                            </div>
                        )}

                        {organization.contact_number && (
                            <div className="flex items-center gap-2">
                                <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                                <a
                                    className="text-sm text-primary hover:underline"
                                    href={`tel:${organization.contact_number}`}
                                >
                                    {organization.contact_number}
                                </a>
                            </div>
                        )}

                        {organization.address && (
                            <div className="flex items-start gap-2">
                                <LocationIcon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <span className="text-sm">
                                    {organization.address}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Organization Stats */}
                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                        Information
                    </h4>

                    <div className="grid grid-cols-1 gap-2 text-sm">
                        {organization.created_at && (
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                <span>
                                    Established{' '}
                                    {new Date(
                                        organization.created_at
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                        )}

                        {organization.database_migration_status && (
                            <div className="flex items-center gap-2">
                                <div
                                    className={cn(
                                        'h-2 w-2 rounded-full',
                                        organization.database_migration_status ===
                                            'completed' && 'bg-green-500',
                                        organization.database_migration_status ===
                                            'pending' && 'bg-yellow-500',
                                        organization.database_migration_status ===
                                            'migrating' && 'bg-blue-500',
                                        organization.database_migration_status ===
                                            'error' && 'bg-red-500'
                                    )}
                                />
                                <span className="capitalize">
                                    {organization.database_migration_status}{' '}
                                    Status
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrganizationPreviewModalDetails
