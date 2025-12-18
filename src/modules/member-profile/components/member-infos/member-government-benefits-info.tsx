import { ReactNode, forwardRef, useMemo } from 'react'

import { cn } from '@/helpers'
import { IMemberGovernmentBenefit } from '@/modules/member-government-benefit'
import { addDays, isAfter, isBefore, isPast } from 'date-fns'

import {
    BadgeExclamationFillIcon,
    CalendarNumberIcon,
    ClockIcon,
    GlobeIcon,
    HashIcon,
    ImageIcon,
    ShieldIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { Badge } from '@/components/ui/badge'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { IClassProps, TEntityId } from '@/types'

import { IMemberProfile } from '../..'
import { useGetMemberProfileById } from '../../member-profile.service'
import { SectionCard } from './section-card'

interface Props extends IClassProps {
    profileId: TEntityId
    defaultData?: IMemberProfile
}

const InfoItem = ({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType
    label: string
    value: ReactNode
}) => {
    return (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="rounded-md bg-primary/10 p-2 text-primary">
                <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground font-medium">
                    {label}
                </p>
                <p className="text-sm font-semibold text-foreground truncate">
                    {value}
                </p>
            </div>
        </div>
    )
}

export const isExpiringIn30Days = (expiryDate?: Date | string | number) => {
    if (!expiryDate) return false

    const today = new Date()
    const in30Days = addDays(today, 30)

    return isAfter(expiryDate, today) && isBefore(expiryDate, in30Days)
}

const GovernmentBenefitCard = ({
    benefit,
}: {
    benefit: IMemberGovernmentBenefit
}) => {
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
        })
    }

    const isExpired = !benefit.expiry_date || isPast(benefit.expiry_date)
    const isExpiringSoon = isExpiringIn30Days(benefit.expiry_date)

    return (
        <div className="group rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/20">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2.5">
                        <ShieldIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground">
                            {benefit.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            Government ID
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {benefit.expiry_date && (
                        <Badge
                            className={cn(
                                'flex items-center gap-1',
                                !isExpired &&
                                    !isExpiringSoon &&
                                    'border-green-500/30 text-green-600 dark:text-green-400'
                            )}
                            variant={
                                isExpired
                                    ? 'destructive'
                                    : isExpiringSoon
                                      ? 'secondary'
                                      : 'outline'
                            }
                        >
                            {isExpired ? (
                                <>
                                    <BadgeExclamationFillIcon className="h-3 w-3" />{' '}
                                    Expired
                                </>
                            ) : isExpiringSoon ? (
                                <>
                                    <ClockIcon className="h-3 w-3" /> Expiring
                                    Soon
                                </>
                            ) : (
                                <>
                                    <ClockIcon className="h-3 w-3" /> Valid
                                </>
                            )}
                        </Badge>
                    )}
                </div>
            </div>

            <div className="p-5 space-y-5">
                {/* ID Photos */}
                <div className="flex flex-wrap gap-4">
                    <div className="group relative flex-1 min-w-[200px]">
                        <div className="aspect-[3/1] rounded-xl border border-border bg-gradient-to-br from-muted/50 to-muted overflow-hidden transition-all duration-300 group-hover:border-primary/30 ">
                            {benefit.front_media ? (
                                <PreviewMediaWrapper
                                    media={benefit?.front_media}
                                >
                                    <ImageDisplay
                                        className="h-full w-full rounded-md"
                                        fallbackClassName="h-full w-full rounded-md"
                                        src={benefit?.front_media?.download_url}
                                    />
                                </PreviewMediaWrapper>
                            ) : (
                                <div className="h-full w-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                    <div className="rounded-full bg-muted-foreground/10 p-3">
                                        <ImageIcon className="h-6 w-6" />
                                    </div>
                                    <span className="text-xs font-medium">
                                        No Image
                                    </span>
                                </div>
                            )}
                        </div>
                        <p className="mt-2 text-xs font-medium text-muted-foreground text-center">
                            ID Front
                        </p>
                    </div>
                    <div className="group relative flex-1 min-w-[200px]">
                        <div className="aspect-[3/1] rounded-xl border border-border bg-gradient-to-br from-muted/50 to-muted overflow-hidden transition-all duration-300 group-hover:border-primary/30">
                            {benefit.back_media ? (
                                <PreviewMediaWrapper
                                    media={benefit?.back_media}
                                >
                                    <ImageDisplay
                                        className="h-full w-full rounded-md"
                                        fallbackClassName="h-full w-full rounded-md"
                                        src={benefit?.back_media?.download_url}
                                    />
                                </PreviewMediaWrapper>
                            ) : (
                                <div className="h-full w-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                    <div className="rounded-full bg-muted-foreground/10 p-3">
                                        <ImageIcon className="h-6 w-6" />
                                    </div>
                                    <span className="text-xs font-medium">
                                        No Image
                                    </span>
                                </div>
                            )}
                        </div>
                        <p className="mt-2 text-xs font-medium text-muted-foreground text-center">
                            ID Back
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <InfoItem
                        icon={HashIcon}
                        label="ID Number"
                        value={benefit.value || 'N/A'}
                    />
                    <InfoItem
                        icon={GlobeIcon}
                        label="Country"
                        value={<span>{benefit.country_code}</span>}
                    />
                    {benefit.expiry_date && (
                        <InfoItem
                            icon={CalendarNumberIcon}
                            label="Expiry Date"
                            value={formatDate(benefit.expiry_date)}
                        />
                    )}
                    <InfoItem
                        icon={ClockIcon}
                        label="Last Updated"
                        value={formatDate(benefit.updated_at)}
                    />
                </div>

                {benefit.description && (
                    <Collapsible>
                        <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                            Show Description
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-3 animate-fade-in">
                            <div className="rounded-lg bg-muted/50 border border-border/50 p-4">
                                <p className="text-sm text-foreground leading-relaxed">
                                    {benefit.description}
                                </p>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                )}
            </div>
        </div>
    )
}

const MemberGovernmentBenefits = forwardRef<HTMLDivElement, Props>(
    ({ profileId, className, defaultData }, ref) => {
        const { data } = useGetMemberProfileById({
            id: profileId,
            options: { initialData: defaultData },
        })

        const governmentBenefits = useMemo(() => {
            return data?.member_government_benefits || []
        }, [data])

        return (
            <div
                className={cn(
                    'flex flex-1 flex-col gap-y-4 rounded-xl bg-background',
                    className
                )}
                ref={ref}
            >
                <SectionCard
                    icon={<ShieldIcon className="h-5 w-5" />}
                    subtitle="View all government benefits and ID this member have."
                    title="Government Benefits"
                >
                    {governmentBenefits.length > 0 ? (
                        <div className="space-y-4">
                            {governmentBenefits.map((benefit, index) => (
                                <div
                                    className="animate-fade-in"
                                    key={benefit.id}
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                    }}
                                >
                                    <GovernmentBenefitCard benefit={benefit} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="rounded-full bg-muted p-4 mb-4">
                                <ShieldIcon className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="font-medium text-foreground mb-1">
                                No Government IDs
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                No government benefits or IDs have been recorded
                                for this member.
                            </p>
                        </div>
                    )}
                </SectionCard>
            </div>
        )
    }
)

MemberGovernmentBenefits.displayName = 'MemberGovernmentBenefits'

export default MemberGovernmentBenefits
