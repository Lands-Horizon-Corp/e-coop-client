import { useState } from 'react'

import { toast } from 'sonner'

import { cn } from '@/helpers'
import { dateAgo, toReadableDateTime } from '@/helpers/date-utils'
import { IFeedComment } from '@/modules/feed-comment'
import { IFeedMedia } from '@/modules/feed-media'
import { ImagePreviewCarousel } from '@/modules/media/components/media-previewer'
import { Heart, MessageCircle, MoreHorizontal } from 'lucide-react'

import { CommentDashedIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { useModalState } from '@/hooks/use-modal-state'

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

const FeedImageGrid = ({ feedMedias }: { feedMedias: IFeedMedia[] }) => {
    const count = feedMedias.length

    const previewState = useModalState()

    if (count === 1) {
        return (
            <div className="w-full overflow-hidden rounded-xl cursor-zoom-in">
                <ImagePreviewCarousel
                    {...previewState}
                    images={[feedMedias[0].media]}
                />
                <img
                    alt="Post media"
                    className="w-full object-cover max-h-[420px]"
                    loading="lazy"
                    onClick={() => previewState.onOpenChange(true)}
                    src={feedMedias[0].media?.download_url}
                />
            </div>
        )
    }

    if (count === 2) {
        return (
            <div className="grid grid-cols-2 gap-1 rounded-xl overflow-hidden">
                <ImagePreviewCarousel
                    {...previewState}
                    images={feedMedias.map((media) => media.media)}
                />
                {feedMedias.map((src, idx) => (
                    <img
                        alt={`Post media ${idx + 1}`}
                        className="w-full h-52 object-cover"
                        key={idx}
                        loading="lazy"
                        onClick={() => previewState.onOpenChange(true)}
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
                <ImagePreviewCarousel
                    {...previewState}
                    images={feedMedias.map((media) => media.media)}
                />
                <img
                    alt="Post media 1"
                    className="w-full h-full object-cover row-span-2"
                    loading="lazy"
                    onClick={() => previewState.onOpenChange(true)}
                    src={feedMedias[0].media?.download_url}
                />
                <div className="flex flex-col gap-1 h-full">
                    <img
                        alt="Post media 2"
                        className="w-full flex-1 object-cover"
                        loading="lazy"
                        onClick={() => previewState.onOpenChange(true)}
                        src={feedMedias[1].media?.download_url}
                    />
                    <img
                        alt="Post media 3"
                        className="w-full flex-1 object-cover"
                        loading="lazy"
                        onClick={() => previewState.onOpenChange(true)}
                        src={feedMedias[2].media?.download_url}
                    />
                </div>
            </div>
        )
    }

    const visible = feedMedias.slice(0, 3)
    const extra = count - 3

    return (
        <div
            className="grid grid-cols-2 gap-1 rounded-xl overflow-hidden"
            style={{ height: 280 }}
        >
            <ImagePreviewCarousel
                {...previewState}
                images={feedMedias.map((media) => media.media)}
            />
            <img
                alt="Post media 1"
                className="w-full h-full object-cover row-span-2"
                loading="lazy"
                onClick={() => previewState.onOpenChange(true)}
                src={visible[0].media?.download_url}
            />
            <div className="flex flex-col gap-1 h-full">
                <img
                    alt="Post media 2"
                    className="w-full flex-1 object-cover"
                    loading="lazy"
                    onClick={() => previewState.onOpenChange(true)}
                    src={visible[1].media?.download_url}
                />
                <div className="relative w-full flex-1 overflow-hidden">
                    <img
                        alt="Post media 3"
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onClick={() => previewState.onOpenChange(true)}
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

const UserFeedBar = ({ feed }: { feed: IFeed }) => {
    return (
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
    )
}

const FeedHeader = ({ feed }: { feed: IFeed }) => {
    return (
        <div className="flex items-start justify-between px-4 pt-4 pb-3">
            <UserFeedBar feed={feed} />
            <Button
                className="h-8 w-8 text-muted-foreground rounded-full hover:bg-muted"
                size="icon"
                variant="ghost"
            >
                <MoreHorizontal className="h-4 w-4" />
            </Button>
        </div>
    )
}

const FeedDescription = ({ feed }: { feed: IFeed }) => {
    return (
        <div className="px-4 py-2">
            <p className="text-sm text-card-foreground leading-relaxed whitespace-pre-line">
                {feed.description}
            </p>
        </div>
    )
}

const FeedLikesCommentsBar = ({
    feed,
    onCommentClick,
}: {
    feed: IFeed
    onCommentClick?: () => void
}) => {
    const [liked, setLiked] = useState(feed.is_liked)

    const totalLikes = (feed.user_likes ? feed.user_likes : []).length
    const totalComments = (feed.feed_comments ? feed.feed_comments : []).length

    const { mutateAsync: likeAsync, isPending } = useLikeFeed()

    return (
        <>
            <div className="px-4 -mt-1 pb-2 flexx items-center justify-between text-xs text-muted-foreground hidden">
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
                    onClick={() => onCommentClick?.()}
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
        </>
    )
}

const FeedMediaSection = ({ feed }: { feed: IFeed }) => {
    if (!(feed.feed_medias && feed.feed_medias.length > 0)) return null

    return (
        <div className="px-4 pb-3">
            <FeedImageGrid feedMedias={feed.feed_medias} />
        </div>
    )
}

const FeedPostCard = ({ feed }: FeedPostCardProps) => {
    const postModalState = useModalState()

    return (
        <article className="bg-popover rounded-xl w-full shadow-xs">
            <FeedHeader feed={feed} />
            <FeedDescription feed={feed} />

            <FeedMediaSection feed={feed} />

            <FeedLikesCommentsBar
                feed={feed}
                onCommentClick={() => {
                    postModalState.onOpenChange(true)
                }}
            />

            <FeedPostCardModal feed={feed} {...postModalState} />
            {/* <FeedCommentForm feedId={feed.id} /> */}
        </article>
    )
}

const CommentItem = ({ comment }: { comment: IFeedComment }) => {
    const media = comment.media

    return (
        <div className="comment-item">
            <ImageDisplay
                className="size-9"
                src={comment.created_by?.media?.download_url}
            />
            <div className="comment-body">
                <div className="comment-header">
                    <span className="comment-author">
                        {comment.created_by?.full_name}
                    </span>
                    {comment.created_by && (
                        <span className="comment-username">
                            @{comment.created_by.user_name}
                        </span>
                    )}
                    <span className="comment-dot">·</span>
                    <time
                        className="comment-time"
                        dateTime={comment.created_at}
                    >
                        {dateAgo(comment.created_at)}
                    </time>
                </div>
                <p className="comment-text">{comment.comment}</p>
                {comment.media && (
                    <div className="comment-media">
                        <a
                            className="comment-media-image-wrap"
                            href={comment.media.download_url}
                            rel="noopener noreferrer"
                            target="_blank"
                            title={media?.description ?? media?.file_name}
                        >
                            <img
                                alt={media?.description ?? media?.file_name}
                                className="comment-media-image"
                                src={media?.download_url}
                            />
                            {media?.description && (
                                <p className="comment-media-caption">
                                    {media?.description}
                                </p>
                            )}
                        </a>
                    </div>
                )}
            </div>
        </div>
    )
}

const FeedComments = ({
    feed,
    className,
}: {
    feed: IFeed
    className?: string
}) => {
    const comments = feed.feed_comments || []

    if (comments.length === 0) {
        return (
            <div
                className={cn(
                    'flex items-center justify-center gap-2 py-4 px-1 text-muted-foreground/40 text-xs',
                    className
                )}
            >
                <CommentDashedIcon size={16} />
                <span>No comments yet</span>
            </div>
        )
    }

    return (
        <div className={cn('flex flex-col divide-y divide-border', className)}>
            {comments.map((comment) => (
                <CommentItem comment={comment} key={comment.id} />
            ))}
        </div>
    )
}

const FeedPostCardModal = ({
    feed,
    className,
    ...props
}: FeedPostCardProps & Omit<IModalProps, 'title'>) => {
    return (
        <Dialog {...props}>
            <DialogContent
                className={cn(
                    '!max-w-xl rounded-xl p-0 gap-0 overflow-hidden bg-card border-border/60 shadow-2xl',
                    className
                )}
                closeButtonClassName="hidden sr-only"
            >
                <DialogHeader className="px-6 py-4 border-b border-border/60 sr-only hidden">
                    <DialogTitle className="text-center text-sm font-semibold text-card-foreground">
                        {`${feed.created_by?.user_name} post`}
                    </DialogTitle>
                </DialogHeader>
                <article className="bg-popover rounded-xl w-full shadow-xs">
                    <FeedHeader feed={feed} />
                    <FeedDescription feed={feed} />
                    <FeedMediaSection feed={feed} />
                    <FeedLikesCommentsBar feed={feed} />
                    <FeedComments feed={feed} />
                    <FeedCommentForm
                        className="w-full max-w-full sticky bottom"
                        feedId={feed.id}
                    />
                </article>
            </DialogContent>
        </Dialog>
    )
}

export default FeedPostCard
