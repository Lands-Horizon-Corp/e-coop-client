import { RefObject, useCallback, useRef } from 'react'

import { useInfiniteQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { withCatchAsync } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { useScrollContainer } from '@/providers/scroll-parent-provider'
import { Loader2 } from 'lucide-react'

import { useElementInView } from '@/hooks/use-element-in-view'

import { getPaginatedFeed } from '../feed.service'
import { IFeed } from '../feed.types'
import FeedPostCard from './feed-post-card'
import PostSkeleton from './feed-post-skeleton'

const SKELETON_COUNT = 5
const PAGE_SIZE = 5

const Feeds = () => {
    const parentRef = useRef<HTMLDivElement>(null)

    const { data, isPending, isFetchingNextPage, hasNextPage, fetchNextPage } =
        useInfiniteQuery({
            queryKey: ['feed', 'infinite'],
            initialPageParam: { pageIndex: 0, pageSize: PAGE_SIZE },
            retry: 0,
            queryFn: async ({ pageParam: { pageIndex, pageSize } }) => {
                const [error, result] = await withCatchAsync(
                    getPaginatedFeed<IFeed>({ query: { pageIndex, pageSize } })
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
            {feeds.map((feed) => (
                <div key={feed.id}>
                    <div className="pb-3">
                        <FeedPostCard feed={feed} />
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
