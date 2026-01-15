import { ReactNode, useMemo, useState } from 'react'

import Fuse from 'fuse.js'

import { cn } from '@/helpers'
import { toReadableDate } from '@/helpers/date-utils'
import { useMemberProfileComakers } from '@/modules/comaker-member-profile'
import { currencyFormat } from '@/modules/currency'
import { IMedia } from '@/modules/media'
import {
    Calendar,
    Clock,
    CreditCard,
    DollarSign,
    FileText,
    RefreshCw,
    Search,
    User,
    Users,
} from 'lucide-react'

import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

import { TEntityId } from '@/types'

import { IMemberProfile } from '../../member-profile.types'

// Types
interface IComakerMemberProfile {
    id: TEntityId
    first_name?: string
    middle_name?: string
    last_name?: string
    suffix?: string
    passbook?: string
    media?: IMedia
}

interface IComaker {
    id: TEntityId
    member_profile_id: TEntityId
    member_profile?: IComakerMemberProfile
    amount?: number
    year_count: number
    months_count: number
    description?: string
    created_at?: string
}

interface Props {
    profileId: TEntityId
    defaultData?: IMemberProfile
    className?: string
}

const SectionCard = ({
    icon,
    title,
    subtitle,
    headerRight,
    children,
}: {
    icon: ReactNode
    title: string
    subtitle: string
    headerRight?: ReactNode
    children: ReactNode
}) => (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-muted/20">
            <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-3">{icon}</div>
                <div>
                    <h2 className="text-lg font-semibold text-foreground">
                        {title}
                    </h2>
                    <p className="text-sm text-muted-foreground">{subtitle}</p>
                </div>
            </div>
            {headerRight}
        </div>
        <div className="p-6">{children}</div>
    </div>
)

const InfoItem = ({
    icon: Icon,
    label,
    value,
    valueClassName,
}: {
    icon: React.ElementType
    label: string
    value: ReactNode
    valueClassName?: string
}) => (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
        <div className="rounded-md bg-primary/10 p-2 text-primary">
            <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground font-medium">{label}</p>
            <p
                className={cn(
                    'text-sm font-semibold text-foreground truncate',
                    valueClassName
                )}
            >
                {value}
            </p>
        </div>
    </div>
)

const EmptyState = ({
    icon,
    title,
    description,
}: {
    icon: ReactNode
    title: string
    description: string
}) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">{icon}</div>
        <h3 className="font-medium text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
    </div>
)

const LoadingSkeleton = () => (
    <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
            <div
                className="rounded-xl border border-border bg-card overflow-hidden p-5"
                key={i}
            >
                <div className="flex gap-4">
                    <Skeleton className="h-16 w-16 rounded-full shrink-0" />
                    <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        </div>
                        <Skeleton className="h-4 w-full" />
                    </div>
                </div>
            </div>
        ))}
    </div>
)

const ComakerCard = ({ comaker }: { comaker: IComaker }) => {
    const fullName = `${comaker.member_profile?.first_name || ''} ${comaker.member_profile?.middle_name || ''} ${comaker.member_profile?.last_name || ''} ${comaker.member_profile?.suffix || ''}`

    return (
        <div className="group rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/20">
                <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-full border-2 border-primary/20 bg-gradient-to-br from-muted/50 to-muted overflow-hidden">
                        {comaker.member_profile?.media?.download_url ? (
                            <img
                                alt={fullName}
                                className="h-full w-full object-cover"
                                src={comaker.member_profile.media.download_url}
                            />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center">
                                <User className="h-6 w-6 text-muted-foreground" />
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground">
                            {fullName}
                        </h3>
                        <p className="text-xs text-muted-foreground">Comaker</p>
                    </div>
                </div>
                <Badge
                    className="border-amber-500/30 text-amber-600 dark:text-amber-400"
                    variant="outline"
                >
                    <DollarSign className="h-3 w-3 mr-1" />
                    {currencyFormat(comaker.amount, { showSymbol: false })}
                </Badge>
            </div>

            <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <InfoItem icon={User} label="Full Name" value={fullName} />
                    <InfoItem
                        icon={CreditCard}
                        label="Passbook Number"
                        value={comaker.member_profile?.passbook || 'N/A'}
                    />
                    <InfoItem
                        icon={Clock}
                        label="Duration"
                        value={
                            <p className="text-sm">
                                {comaker.year_count > 0 && (
                                    <span>
                                        {comaker.year_count}{' '}
                                        {comaker.year_count === 1
                                            ? 'year'
                                            : 'years'}
                                    </span>
                                )}
                                {comaker.year_count > 0 &&
                                    comaker.months_count > 0 && <span> </span>}
                                {comaker.months_count > 0 && (
                                    <span>
                                        {comaker.months_count}{' '}
                                        {comaker.months_count === 1
                                            ? 'month'
                                            : 'months'}
                                    </span>
                                )}
                                {!comaker.year_count &&
                                    !comaker.months_count &&
                                    '-'}
                            </p>
                        }
                    />
                    <InfoItem
                        icon={Calendar}
                        label="Created"
                        value={
                            comaker.created_at
                                ? toReadableDate(comaker.created_at)
                                : '-'
                        }
                    />
                </div>

                {comaker.description && (
                    <Collapsible>
                        <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                            <FileText className="h-4 w-4" />
                            Show Description
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-3 animate-fade-in">
                            <div className="rounded-lg bg-muted/50 border border-border/50 p-4">
                                <p className="text-sm text-foreground leading-relaxed">
                                    {comaker.description}
                                </p>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                )}
            </div>
        </div>
    )
}

const MemberComakers = ({ profileId, className }: Props) => {
    const [searchQuery, setSearchQuery] = useState('')

    const {
        data: comakers,
        isRefetching,
        isPending,
        refetch,
    } = useMemberProfileComakers({
        id: profileId,
    })

    const fuse = useMemo(() => {
        if (!comakers) return null

        return new Fuse(comakers, {
            keys: [
                'member_profile.first_name',
                'member_profile.middle_name',
                'member_profile.last_name',
                'member_profile.passbook',
                'description',
            ],
            threshold: 0.3,
            includeScore: true,
        })
    }, [comakers])

    const filteredComakers = useMemo(() => {
        if (!comakers) return []
        if (!searchQuery.trim()) return comakers

        if (!fuse) return comakers

        const results = fuse.search(searchQuery)
        return results.map((result) => result.item)
    }, [comakers, searchQuery, fuse])

    return (
        <div className={cn('flex flex-col gap-y-4', className)}>
            <SectionCard
                headerRight={
                    <div className="flex items-center gap-3">
                        <Badge variant="secondary">
                            {filteredComakers.length} Comaker
                            {filteredComakers.length !== 1 ? 's' : ''}
                        </Badge>
                        {refetch && (
                            <Button
                                disabled={isRefetching}
                                onClick={() => refetch()}
                                size="icon"
                                variant="outline"
                            >
                                {isRefetching || isPending ? (
                                    <LoadingSpinner />
                                ) : (
                                    <RefreshCw className={'h-4 w-4'} />
                                )}
                            </Button>
                        )}
                    </div>
                }
                icon={<Users className="h-5 w-5 text-primary" />}
                subtitle="View all comakers associated with this member."
                title="Comakers"
            >
                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        className="pl-10"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search comakers by name, passbook, or description..."
                        value={searchQuery}
                    />
                </div>

                {isPending && <LoadingSkeleton />}

                {!isPending && filteredComakers.length === 0 && (
                    <EmptyState
                        description={
                            searchQuery
                                ? 'Try adjusting your search query.'
                                : 'No comakers have been recorded for this member.'
                        }
                        icon={
                            <Users className="h-8 w-8 text-muted-foreground" />
                        }
                        title={searchQuery ? 'No Results Found' : 'No Comakers'}
                    />
                )}

                {!isPending && filteredComakers.length > 0 && (
                    <div className="space-y-4">
                        {filteredComakers.map((comaker, index) => (
                            <div
                                className="animate-fade-in"
                                key={comaker.id}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <ComakerCard comaker={comaker} />
                            </div>
                        ))}
                    </div>
                )}
            </SectionCard>
        </div>
    )
}

export default MemberComakers
