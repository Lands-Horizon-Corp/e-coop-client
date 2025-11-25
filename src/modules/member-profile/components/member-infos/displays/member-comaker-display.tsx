import { useMemo, useState } from 'react'

import Fuse from 'fuse.js'

import { cn } from '@/helpers'
import { toReadableDate } from '@/helpers/date-utils'
import { useMemberProfileComakers } from '@/modules/comaker-member-profile'
import { currencyFormat } from '@/modules/currency'

import { RefreshIcon, UserIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { Button } from '@/components/ui/button'
import EmptyState from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import useDebounce from '@/hooks/use-debounce'

import { TEntityId } from '@/types'

import SectionTitle from '../section-title'

interface MemberComakerDisplayProps {
    profileId: TEntityId
}

const DebouncedSearchInput = ({
    value,
    onChange,
}: {
    value: string
    onChange: (value: string) => void
}) => {
    const [localValue, setLocalValue] = useState(value)
    const debouncedValue = useDebounce(localValue, 300)

    // Update parent when debounced value changes
    useMemo(() => {
        onChange(debouncedValue)
    }, [debouncedValue, onChange])

    return (
        <Input
            className="max-w-sm"
            onChange={(e) => setLocalValue(e.target.value)}
            placeholder="Search comakers..."
            type="text"
            value={localValue}
        />
    )
}

const MemberComakerDisplay = ({ profileId }: MemberComakerDisplayProps) => {
    const [searchQuery, setSearchQuery] = useState('')

    const {
        data: comakers,
        status,
        isRefetching,
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
        <div className="space-y-4">
            <div className="flex justify-between">
                <SectionTitle
                    Icon={UserIcon}
                    subTitle="People who co-signed loans with this member"
                    title="Comakers"
                />

                <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground/80">
                        {filteredComakers.length} Comaker
                        {filteredComakers.length !== 1 ? 's' : ''}
                    </p>
                    <Button
                        disabled={isRefetching}
                        onClick={() => refetch()}
                        size="sm"
                        variant="outline"
                    >
                        <RefreshIcon
                            className={cn(
                                'size-4',
                                isRefetching && 'animate-spin'
                            )}
                        />
                    </Button>
                </div>
            </div>

            {/* Search Input */}
            <DebouncedSearchInput
                onChange={setSearchQuery}
                value={searchQuery}
            />

            {/* Loading State */}
            {status === 'pending' && (
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div
                            className="space-y-3 rounded-xl bg-secondary/20 p-4"
                            key={i}
                        >
                            <div className="flex items-start gap-4">
                                <Skeleton className="size-16 shrink-0 rounded-xl" />
                                <div className="flex-1 space-y-3">
                                    <div className="grid gap-3 md:grid-cols-3">
                                        <div className="space-y-2">
                                            <Skeleton className="h-5 w-32" />
                                            <Skeleton className="h-3 w-20" />
                                        </div>
                                        <div className="space-y-2">
                                            <Skeleton className="h-5 w-24" />
                                            <Skeleton className="h-3 w-24" />
                                        </div>
                                        <div className="space-y-2">
                                            <Skeleton className="h-5 w-28" />
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-4 w-full" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {status === 'success' && filteredComakers.length === 0 && (
                <EmptyState
                    description={
                        searchQuery
                            ? 'No comakers match your search criteria'
                            : 'This member has no comakers on record'
                    }
                    icon={<UserIcon className="size-12" />}
                    title={searchQuery ? 'No Results Found' : 'No Comakers'}
                />
            )}

            {/* Comakers List */}
            {status === 'success' && filteredComakers.length > 0 && (
                <div className="space-y-3">
                    {filteredComakers.map((comaker) => (
                        <div
                            className="space-y-3 rounded-xl border border-border/50 bg-secondary/20 p-4 transition-colors hover:bg-secondary/30"
                            key={comaker.id}
                        >
                            <div className="flex items-start gap-4">
                                {/* Profile Image */}
                                <PreviewMediaWrapper
                                    media={comaker.member_profile?.media}
                                >
                                    <ImageDisplay
                                        className="size-16 shrink-0 rounded-xl border border-border/50"
                                        src={
                                            comaker.member_profile?.media
                                                ?.download_url
                                        }
                                    />
                                </PreviewMediaWrapper>

                                {/* Comaker Details */}
                                <div className="min-w-0 flex-1 space-y-3">
                                    <div className="grid gap-3 md:grid-cols-3">
                                        {/* Full Name */}
                                        <div className="space-y-1">
                                            <p className="truncate font-medium">
                                                {`${comaker.member_profile?.first_name ?? '-'} ${comaker.member_profile?.middle_name ?? '-'} ${comaker.member_profile?.last_name ?? '-'} ${comaker.member_profile?.suffix ?? ''}`.trim()}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Full Name
                                            </p>
                                        </div>

                                        {/* Passbook */}
                                        <div className="space-y-1">
                                            <p className="font-medium">
                                                {comaker.member_profile
                                                    ?.passbook ?? '-'}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Passbook Number
                                            </p>
                                        </div>

                                        {/* Amount */}
                                        <div className="space-y-1">
                                            <p className="font-medium">
                                                {currencyFormat(
                                                    comaker.amount ?? 0
                                                )}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Amount
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid gap-3 md:grid-cols-3">
                                        {/* Duration */}
                                        <div className="space-y-1">
                                            <p className="text-sm">
                                                {comaker.year_count > 0 && (
                                                    <span>
                                                        {comaker.year_count}{' '}
                                                        {comaker.year_count ===
                                                        1
                                                            ? 'year'
                                                            : 'years'}
                                                    </span>
                                                )}
                                                {comaker.year_count > 0 &&
                                                    comaker.months_count >
                                                        0 && <span> </span>}
                                                {comaker.months_count > 0 && (
                                                    <span>
                                                        {comaker.months_count}{' '}
                                                        {comaker.months_count ===
                                                        1
                                                            ? 'month'
                                                            : 'months'}
                                                    </span>
                                                )}
                                                {!comaker.year_count &&
                                                    !comaker.months_count &&
                                                    '-'}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Duration
                                            </p>
                                        </div>

                                        {/* Created Date */}
                                        <div className="space-y-1">
                                            <p className="text-sm">
                                                {toReadableDate(
                                                    comaker.created_at
                                                )}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Created
                                            </p>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {comaker.description && (
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground">
                                                {comaker.description}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Description
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Error State (optional, handled by status !== 'pending' && !== 'success') */}
            {status === 'error' && (
                <EmptyState
                    description="Failed to load comakers. Please try again."
                    title="Error Loading Comakers"
                />
            )}
        </div>
    )
}

export default MemberComakerDisplay
