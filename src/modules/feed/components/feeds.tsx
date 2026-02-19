import { RefObject, useCallback, useRef } from 'react'

import { useInfiniteQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { withCatchAsync } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { useScrollContainer } from '@/providers/scroll-parent-provider'
import { Loader2 } from 'lucide-react'

import { RefreshIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
} from '@/components/ui/empty'

import { useElementInView } from '@/hooks/use-element-in-view'

import { TEntityId } from '@/types'

import { feedAPIRoute, getPaginatedFeed } from '../feed.service'
import { IFeed } from '../feed.types'
import FeedPostCard from './feed-post-card'
import PostSkeleton from './feed-post-skeleton'

const SKELETON_COUNT = 5
const PAGE_SIZE = 5

export type TFeedInfiniteFetchMode = 'public' | 'my' | 'user'

const Feeds = ({
    mode = 'public',
    userId,
    onClickFeedAuthor,
}: {
    mode?: TFeedInfiniteFetchMode
    userId?: TEntityId
    onClickFeedAuthor?: (feed: IFeed) => void
}) => {
    const parentRef = useRef<HTMLDivElement>(null)

    const {
        data,
        isPending,
        isRefetching,
        isFetchingNextPage,
        refetch,
        hasNextPage,
        fetchNextPage,
    } = useInfiniteQuery({
        queryKey: ['feed', 'infinite', mode, userId].filter(Boolean),
        initialPageParam: { pageIndex: 0, pageSize: PAGE_SIZE },
        retry: 0,
        queryFn: async ({ pageParam: { pageIndex, pageSize } }) => {
            let url = `${feedAPIRoute}/search`

            if (mode === 'my') url = `${feedAPIRoute}/my/search`
            if (mode === 'user') url = `${feedAPIRoute}/user/${userId}/search`

            const [error, result] = await withCatchAsync(
                getPaginatedFeed<IFeed>({ query: { pageIndex, pageSize }, url })
            )
            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error('Failed to load feed, ' + errorMessage)
                throw errorMessage
            }
            return result
        },
        getNextPageParam: (lastResponseData, _all, lastPage) => {
            if (lastResponseData.data.length < lastPage.pageSize)
                return undefined
            return { ...lastPage, pageIndex: lastPage.pageIndex + 1 }
        },
    })

    const feeds = data?.pages.flatMap((page) => page.data) ?? []

    const scrollRef = useScrollContainer()
    const handleOnLoadNext = useCallback(() => {
        if (hasNextPage) {
            fetchNextPage()
        }
    }, [fetchNextPage, hasNextPage])

    const { ref } = useElementInView<HTMLDivElement>({
        scrollParent: scrollRef.current as unknown as RefObject<Element>,
        onEnterView: handleOnLoadNext,
    })

    if (isPending) {
        return (
            <div className="flex flex-col gap-3 mt-3">
                {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                    <PostSkeleton key={i} />
                ))}
            </div>
        )
    }

    return (
        <div
            className="mt-3 overflow-auto relative"
            ref={parentRef}
            style={{ height: '100%' }}
        >
            {feeds.length === 0 && !isPending && (
                <Empty className="h-full">
                    <EmptyHeader>
                        <EmptyTitle>No post yet</EmptyTitle>
                        <EmptyDescription className="max-w-xs text-pretty">
                            You&apos;re all caught up. New post will appear
                            here.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        {isRefetching ? (
                            <LoadingSpinner />
                        ) : (
                            <Button
                                className="text-muted-foreground"
                                onClick={() => refetch()}
                                size="sm"
                                variant="ghost"
                            >
                                <RefreshIcon />
                                Refresh
                            </Button>
                        )}
                    </EmptyContent>
                </Empty>
            )}

            {feeds.map((feed) => (
                <div key={feed.id}>
                    <div className="pb-3">
                        <FeedPostCard
                            feed={feed}
                            onClickFeedAuthor={onClickFeedAuthor}
                        />
                    </div>
                </div>
            ))}

            <div className="h-0 w-full" ref={ref} />

            {isFetchingNextPage && (
                <div className="flex justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
            )}

            {!hasNextPage && feeds.length > 0 && (
                <p className="text-center text-xs text-muted-foreground py-6">
                    You're all caught up! 🎉
                </p>
            )}
        </div>
    )
}

export default Feeds
