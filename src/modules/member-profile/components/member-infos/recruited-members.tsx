import { ReactNode, forwardRef } from 'react'

import { cn } from '@/helpers'
import { toReadableDate } from '@/helpers/date-utils'
import {
    Calendar,
    CheckCircle,
    Clock,
    CreditCard,
    Tag,
    User,
    Users,
    XCircle,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import { TEntityId, TGeneralStatus } from '@/types'

import { useGetMemberProfileById } from '../../member-profile.service'
import { IMemberProfile } from '../../member-profile.types'

interface Props {
    className?: string
    profileId: TEntityId
    defaultData?: IMemberProfile
}

const getStatusConfig = (status?: TGeneralStatus) => {
    switch (status?.toLowerCase()) {
        case 'active':
            return {
                label: 'Active',
                variant: 'default' as const,
                icon: CheckCircle,
                className:
                    'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30',
            }
        case 'inactive':
            return {
                label: 'Inactive',
                variant: 'secondary' as const,
                icon: XCircle,
                className: 'bg-muted text-muted-foreground border-muted',
            }
        case 'pending':
            return {
                label: 'Pending',
                variant: 'outline' as const,
                icon: Clock,
                className:
                    'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30',
            }
        case 'closed':
            return {
                label: 'Closed',
                variant: 'destructive' as const,
                icon: XCircle,
                className:
                    'bg-destructive/10 text-destructive border-destructive/30',
            }
        default:
            return {
                label: status || 'Unknown',
                variant: 'outline' as const,
                icon: Clock,
                className: '',
            }
    }
}

const SectionCard = ({
    icon,
    title,
    subtitle,
    children,
    action,
}: {
    icon: ReactNode
    title: string
    subtitle?: string
    children: ReactNode
    action?: ReactNode
}) => {
    return (
        <Card className="border-border bg-card">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                            {icon}
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold text-foreground">
                                {title}
                            </CardTitle>
                            {subtitle && (
                                <p className="text-sm text-muted-foreground mt-0.5">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>
                    {action}
                </div>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    )
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

const RecruitCard = ({ recruit }: { recruit: IMemberProfile }) => {
    const statusConfig = getStatusConfig(recruit.status)
    const StatusIcon = statusConfig.icon

    return (
        <div className="group rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/20">
                <div className="flex items-center gap-3">
                    {/* Profile Image */}
                    <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-primary/20 bg-muted flex-shrink-0">
                        {recruit.media?.download_url ? (
                            <img
                                alt={recruit.full_name}
                                className="h-full w-full object-cover"
                                src={recruit.media.download_url}
                            />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center bg-primary/10">
                                <User className="h-6 w-6 text-primary" />
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground">
                            {recruit.full_name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            Recruited Member
                        </p>
                    </div>
                </div>
                <Badge
                    className={cn(
                        'flex items-center gap-1',
                        statusConfig.className
                    )}
                    variant={statusConfig.variant}
                >
                    <StatusIcon className="h-3 w-3" />
                    {statusConfig.label}
                </Badge>
            </div>

            <div className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <InfoItem
                        icon={CreditCard}
                        label="Passbook Number"
                        value={recruit.passbook || 'N/A'}
                    />
                    <InfoItem
                        icon={Tag}
                        label="Member Type"
                        value={recruit.member_type?.name || 'N/A'}
                    />
                    <InfoItem
                        icon={Calendar}
                        label="Date Joined"
                        value={
                            recruit.created_at
                                ? toReadableDate(recruit.created_at)
                                : '-'
                        }
                    />
                </div>
            </div>
        </div>
    )
}

const LoadingSkeleton = () => {
    return (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <div
                    className="rounded-xl border border-border bg-card overflow-hidden"
                    key={i}
                >
                    <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/20">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </div>
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                    <div className="p-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {[...Array(3)].map((_, j) => (
                                <div
                                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
                                    key={j}
                                >
                                    <Skeleton className="h-8 w-8 rounded-md" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-3 w-16" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

const MemberRecruits = forwardRef<HTMLDivElement, Props>(
    ({ className, profileId, defaultData }, ref) => {
        const { data, isPending } = useGetMemberProfileById({
            id: profileId,
            options: { initialData: defaultData },
        })

        const recruits = data?.recruited_members || []

        return (
            <div
                className={cn(
                    'flex flex-1 flex-col gap-y-4 rounded-xl bg-background',
                    className
                )}
                ref={ref}
            >
                <SectionCard
                    action={
                        recruits.length > 0 && (
                            <Badge className="text-xs" variant="secondary">
                                {recruits.length}{' '}
                                {recruits.length === 1 ? 'Recruit' : 'Recruits'}
                            </Badge>
                        )
                    }
                    icon={<Users className="h-5 w-5" />}
                    subtitle="View all members recruited by this member."
                    title="Recruited Members"
                >
                    {isPending ? (
                        <LoadingSkeleton />
                    ) : recruits.length > 0 ? (
                        <div className="space-y-4">
                            {recruits.map((recruit, index) => (
                                <div
                                    className="animate-fade-in"
                                    key={recruit.id}
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                    }}
                                >
                                    <RecruitCard recruit={recruit} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="rounded-full bg-muted p-4 mb-4">
                                <Users className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="font-medium text-foreground mb-1">
                                No Recruited Members
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                This member hasn't recruited any members yet.
                            </p>
                        </div>
                    )}
                </SectionCard>
            </div>
        )
    }
)

MemberRecruits.displayName = 'MemberRecruits'

export default MemberRecruits
