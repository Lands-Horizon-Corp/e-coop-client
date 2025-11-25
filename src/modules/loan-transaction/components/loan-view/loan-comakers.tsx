import { useMemo, useState } from 'react'

import Fuse from 'fuse.js'

import { cn } from '@/helpers'
import { useLoanComakers } from '@/modules/loan-transaction'

import {
    MagnifyingGlassIcon,
    RefreshIcon,
    Users3Icon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { Button } from '@/components/ui/button'
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

import useDebounce from '@/hooks/use-debounce'

import { IClassProps, TEntityId } from '@/types'

const ComakerSearchInput = ({
    value,
    onChange,
    className,
}: {
    value: string
    onChange: (value: string) => void
    className?: string
}) => {
    return (
        <div className={cn('relative', className)}>
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                className="h-9 bg-secondary/50 pl-9 pr-4 text-sm transition-all duration-200 focus:bg-background focus:ring-2 focus:ring-primary/20"
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search comakers..."
                type="text"
                value={value}
            />
        </div>
    )
}

const ComakerSkeleton = () => {
    return (
        <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
                <div
                    className="flex items-center gap-3 rounded-lg border border-border/50 bg-gradient-to-r from-secondary/50 to-secondary/20 p-3 transition-all"
                    key={i}
                >
                    <Skeleton className="size-10 shrink-0 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                </div>
            ))}
        </div>
    )
}

const ComakerEmpty = () => {
    return (
        <Empty className="py-12">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <Users3Icon className="size-8" />
                </EmptyMedia>
                <EmptyTitle>No Comakers Found</EmptyTitle>
                <EmptyDescription>
                    This loan transaction does not have any comakers assigned.
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    )
}

export const LoanComakersList = ({
    className,
    loanTransactionId,
}: IClassProps & {
    loanTransactionId: TEntityId
}) => {
    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearch = useDebounce(searchQuery, 300)

    const {
        data: comakers = [],
        isPending,
        isRefetching,
        refetch,
    } = useLoanComakers({
        loanTransactiionId: loanTransactionId,
        options: {
            enabled: !!loanTransactionId,
        },
    })

    const fuse = useMemo(() => {
        return new Fuse(comakers, {
            keys: [
                'member_profile.full_name',
                'member_profile.contact_number',
                'description',
            ],
            threshold: 0.3,
            includeScore: true,
        })
    }, [comakers])

    const filteredComakers = useMemo(() => {
        if (!debouncedSearch.trim()) {
            return comakers
        }
        return fuse.search(debouncedSearch).map((result) => result.item)
    }, [debouncedSearch, comakers, fuse])

    return (
        <div
            className={cn(
                'space-y-4 rounded-xl border border-border/50 bg-popover p-4 shadow-sm',
                className
            )}
        >
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-base font-semibold text-foreground">
                        Loan Comakers
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        {comakers.length}{' '}
                        {comakers.length === 1 ? 'comaker' : 'comakers'}{' '}
                        assigned to this loan
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <ComakerSearchInput
                        className="w-64"
                        onChange={setSearchQuery}
                        value={searchQuery}
                    />
                    <Button
                        className="h-9 w-9"
                        disabled={isRefetching || isPending}
                        onClick={() => refetch()}
                        size="icon"
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

            {isPending ? (
                <ComakerSkeleton />
            ) : comakers.length === 0 ? (
                <ComakerEmpty />
            ) : filteredComakers.length === 0 ? (
                <Empty className="py-8">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <MagnifyingGlassIcon className="size-6" />
                        </EmptyMedia>
                        <EmptyTitle>No Results</EmptyTitle>
                        <EmptyDescription>
                            No comakers match your search criteria.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto ecoop-scroll pr-1">
                    {filteredComakers.map((comaker) => {
                        const member = comaker.member_profile

                        return (
                            <div
                                className="group flex items-center gap-3 rounded-xl border border-border/50 bg-gradient-to-r from-primary/5 to-primary/10 p-3 transition-all duration-200 hover:border-border hover:from-primary/10 hover:to-primary/15 hover:shadow-md"
                                key={comaker.id}
                            >
                                <div className="relative shrink-0">
                                    <ImageDisplay
                                        className="size-10 rounded-full border-2 border-background shadow-sm transition-transform duration-200 group-hover:scale-105"
                                        fallback={
                                            member?.full_name?.charAt(0) ?? '?'
                                        }
                                        src={member?.media?.download_url}
                                    />
                                    <div className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-background bg-emerald-500 shadow-sm" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="truncate text-sm font-medium text-foreground">
                                        {member?.full_name || (
                                            <span className="text-muted-foreground">
                                                Unknown Member
                                            </span>
                                        )}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        {member?.contact_number && (
                                            <p className="truncate text-xs text-muted-foreground">
                                                {member.contact_number}
                                            </p>
                                        )}
                                        {comaker.description && (
                                            <>
                                                {member?.contact_number && (
                                                    <span className="text-muted-foreground">
                                                        •
                                                    </span>
                                                )}
                                                <p className="truncate text-xs text-muted-foreground italic">
                                                    {comaker.description}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="shrink-0">
                                    <div className="rounded-lg border border-border/50 bg-background/80 px-3 py-1.5 shadow-sm backdrop-blur-sm transition-all duration-200 group-hover:border-primary/30 group-hover:bg-primary/5">
                                        <p className="text-xs font-mono font-semibold text-primary">
                                            ₱
                                            {comaker.amount?.toLocaleString(
                                                'en-US',
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                }
                                            ) || '0.00'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {!isPending && filteredComakers.length > 0 && (
                <div className="flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground">
                    <span>
                        Showing {filteredComakers.length} of {comakers.length}
                    </span>
                    {debouncedSearch && (
                        <span className="text-primary">
                            Filtered by: "{debouncedSearch}"
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}
