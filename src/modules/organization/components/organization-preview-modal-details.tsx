import { BuildingIcon, CalendarIcon, PhoneIcon, StarIcon } from 'lucide-react'

import {
    EmailIcon,
    InfoIcon,
    PinLocationIcon as LocationIcon,
    PhoneOutlineIcon,
} from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
} from '@/components/ui/empty'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import TruncatedText from '@/components/ui/truncated-text'

import { IOrganization } from '../organization.types'

interface OrganizationDetailsProps {
    organization: IOrganization
    showActions?: boolean
    onJoin?: () => void
    onCreateBranch?: () => void
}

const OrganizationPreviewModalDetails = ({
    organization,
}: OrganizationDetailsProps) => {
    return (
        <div className="space-y-6 py-6 px-8 w-full bg-card/50 rounded-lg">
            {/* Header */}
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">
                    {organization.name}
                </h2>
                <div className="flex items-center gap-2">
                    <Button
                        className="text-xs size-fit p-1.5"
                        size="icon"
                        variant="secondary"
                    >
                        <BuildingIcon className="size-4" />
                        {organization.organization_key}
                    </Button>
                    {organization.subscription_plan && (
                        <Badge className="text-xs px-2 py-1" variant="default">
                            <StarIcon className="h-3 w-3 mr-1" />
                            {organization.subscription_plan.name}
                        </Badge>
                    )}
                </div>
            </div>
            {/* Contact Information */}
            <div className="flex w-full gap-x-3">
                <Card className="bg-card flex-1">
                    <CardHeader className="">
                        <CardTitle className="flex items-center gap-x-2">
                            <Button
                                className=" size-fit bg-primary/40 border border-primary"
                                size="icon"
                            >
                                <InfoIcon className=" size-5 text-primary " />
                            </Button>
                            <h3 className="font-semibold text-[min(16px,2.5vw)] text-foreground">
                                Details
                            </h3>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {organization.description ? (
                            <div className="space-y-2">
                                <TruncatedText
                                    className="text-sm h-fit overflow-y-auto max-h-16 ecoop-scroll"
                                    text={organization.description}
                                />
                            </div>
                        ) : (
                            <Empty className="h-[10vh] border ">
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <InfoIcon />
                                    </EmptyMedia>
                                    <EmptyDescription>
                                        No description available.
                                    </EmptyDescription>
                                </EmptyHeader>
                            </Empty>
                        )}
                    </CardContent>
                </Card>
                <Card className="bg-card flex-1 min-w-0">
                    <CardHeader className="">
                        <CardTitle className="flex items-center gap-x-2">
                            <Button
                                className=" size-fit p-1 bg-primary/40 border border-primary"
                                size="icon"
                            >
                                <PhoneOutlineIcon className=" size-3 text-primary " />
                            </Button>
                            <h3 className="font-semibold text-[min(16px,2.5vw)] text-foreground">
                                Contact Information
                            </h3>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
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
                                <div className="flex items-start gap-2 min-w-0 max-w-full">
                                    <LocationIcon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                    <Tooltip delayDuration={800}>
                                        <TooltipTrigger className="truncate text-sm">
                                            {organization.address}
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            {organization.address}
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="flex-center">
                {organization.created_at && (
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-primary" />
                        <span>
                            Established{' '}
                            {new Date(
                                organization.created_at
                            ).toLocaleDateString()}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default OrganizationPreviewModalDetails
