import { useState } from 'react'

import { toast } from 'sonner'

import { cn } from '@/helpers'
import { toReadableDateTime } from '@/helpers/date-utils'
import { IFeedMedia } from '@/modules/feed-media'
import { Heart, MessageCircle, MoreHorizontal } from 'lucide-react'

import ImageDisplay from '@/components/image-display'
import { Button } from '@/components/ui/button'

import { useLikeFeed } from '../feed.service'
import { IFeed } from '../feed.types'
import { FeedCommentForm } from './forms/create-feed-comment-form'

interface FeedPostCardProps {
    feed: IFeed
}

function formatCount(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
    return String(n)
}

const ImageGrid = ({ feedMedias }: { feedMedias: IFeedMedia[] }) => {
    const count = feedMedias.length

    if (count === 1) {
        return (
            <div className="w-full overflow-hidden rounded-xl">
                <img
                    alt="Post media"
                    className="w-full object-cover max-h-[420px]"
                    loading="lazy"
                    src={feedMedias[0].media?.download_url}
                />
            </div>
        )
    }

    if (count === 2) {
        return (
            <div className="grid grid-cols-2 gap-1 rounded-xl overflow-hidden">
                {feedMedias.map((src, idx) => (
                    <img
                        alt={`Post media ${idx + 1}`}
                        className="w-full h-52 object-cover"
                        key={idx}
                        loading="lazy"
                        src={src.media?.download_url}
                    />
                ))}
            </div>
        )
    }

    if (count === 3) {
        return (
            <div
                className="grid grid-cols-2 gap-1 rounded-xl overflow-hidden"
                style={{ height: 280 }}
            >
                {/* Left: tall image */}
                <img
                    alt="Post media 1"
                    className="w-full h-full object-cover row-span-2"
                    loading="lazy"
                    src={feedMedias[0].media?.download_url}
                />
                {/* Right: two stacked */}
                <div className="flex flex-col gap-1 h-full">
                    <img
                        alt="Post media 2"
                        className="w-full flex-1 object-cover"
                        loading="lazy"
                        src={feedMedias[1].media?.download_url}
                    />
                    <img
                        alt="Post media 3"
                        className="w-full flex-1 object-cover"
                        loading="lazy"
                        src={feedMedias[2].media?.download_url}
                    />
                </div>
            </div>
        )
    }

    // 4+ images: show 3, last slot has +N overlay
    const visible = feedMedias.slice(0, 3)
    const extra = count - 3

    return (
        <div
            className="grid grid-cols-2 gap-1 rounded-xl overflow-hidden"
            style={{ height: 280 }}
        >
            <img
                alt="Post media 1"
                className="w-full h-full object-cover row-span-2"
                loading="lazy"
                src={visible[0].media?.download_url}
            />
            <div className="flex flex-col gap-1 h-full">
                <img
                    alt="Post media 2"
                    className="w-full flex-1 object-cover"
                    loading="lazy"
                    src={visible[1].media?.download_url}
                />
                {/* Third slot with overlay */}
                <div className="relative w-full flex-1 overflow-hidden">
                    <img
                        alt="Post media 3"
                        className="w-full h-full object-cover"
                        loading="lazy"
                        src={visible[2].media?.download_url}
                    />
                    {extra > 0 && (
                        <div className="absolute inset-0 bg-foreground/55 flex items-center justify-center">
                            <span className="text-2xl font-bold text-primary-foreground">
                                +{extra}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const FeedPostCard = ({ feed }: FeedPostCardProps) => {
    const [liked, setLiked] = useState(feed.is_liked)

    const totalLikes = (feed.user_likes ? feed.user_likes : []).length
    const totalComments = (feed.feed_comments ? feed.feed_comments : []).length

    const { mutateAsync: likeAsync, isPending } = useLikeFeed()

    return (
        <article className="bg-popover rounded-xl w-full shadow-xs">
            <div className="flex items-start justify-between px-4 pt-4 pb-3">
                <div className="flex items-center gap-3">
                    <ImageDisplay
                        className="size-9"
                        src={feed.created_by?.media?.download_url}
                    />
                    <div>
                        <p className="font-semibold text-sm text-card-foreground leading-tight">
                            {feed.created_by?.user_name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {toReadableDateTime(feed.created_at)}
                        </p>
                    </div>
                </div>
                <Button
                    className="h-8 w-8 text-muted-foreground rounded-full hover:bg-muted"
                    size="icon"
                    variant="ghost"
                >
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </div>

            <div className="px-4 pb-3">
                <p className="text-sm text-card-foreground leading-relaxed whitespace-pre-line">
                    {feed.description}
                </p>
            </div>

            {feed.feed_medias && feed.feed_medias.length > 0 && (
                <div className="px-4 pb-3">
                    <ImageGrid feedMedias={feed.feed_medias} />
                </div>
            )}

            <div className="px-4 pb-2 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                    {totalLikes > 0 && (
                        <span>
                            {formatCount(totalLikes)} Like
                            {totalLikes > 1 ? 's' : ''}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {totalComments > 0 && (
                        <span>{formatCount(totalComments)} Comments</span>
                    )}
                </div>
            </div>

            <div className="h-px bg-border/15" />

            <div className="flex items-center px-2 py-1 gap-1">
                <Button
                    className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg text-xs font-medium text-muted-foreground hover:text-card-foreground hover:bg-muted/70"
                    variant="ghost"
                >
                    <MessageCircle className="h-4 w-4 shrink-0" />
                    <span>{formatCount(totalComments)} Comments</span>
                </Button>

                <Button
                    className={cn(
                        'flex-1 flex items-center justify-center gap-2 h-9 rounded-lg text-xs font-medium transition-colors',
                        liked
                            ? 'text-destructive hover:text-destructive/80 hover:bg-destructive/10'
                            : 'text-muted-foreground hover:text-card-foreground hover:bg-muted/70'
                    )}
                    disabled={isPending}
                    onClick={() =>
                        toast.promise(
                            likeAsync({
                                feedId: feed.id,
                            }),
                            {
                                success: () => {
                                    setLiked((v) => !v)
                                    return `You ${liked ? 'Unliked' : 'Liked'} this post`
                                },
                                error: 'Sorry, Failed to like post',
                            }
                        )
                    }
                    variant="ghost"
                >
                    <Heart
                        className={cn(
                            'h-4 w-4 shrink-0 transition-transform',
                            liked && 'fill-destructive scale-110'
                        )}
                    />
                    <span>
                        {formatCount(totalLikes)} Like
                        {totalLikes > 1 ? 's' : ''}
                    </span>
                </Button>
            </div>

            <div className="h-px bg-border/15" />

            <FeedCommentForm feedId={feed.id} />
        </article>
    )
}

export default FeedPostCard
