import { useState } from 'react'

import { toast } from 'sonner'

import { cn } from '@/helpers'
import { dateAgo, toReadableDateTime } from '@/helpers/date-utils'
import { hasPermissionFromAuth } from '@/modules/authentication/authgentication.store'
import { IFeedComment, useDeleteFeedCommentById } from '@/modules/feed-comment'
import { IFeedMedia } from '@/modules/feed-media'
import { ImagePreviewCarousel } from '@/modules/media/components/media-previewer'
import { Heart, MessageCircle, MoreHorizontal } from 'lucide-react'

import { PencilFillIcon, RefreshIcon, TrashFillIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { IModalProps } from '@/components/modals/modal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps } from '@/types'

import { useDeleteFeedById, useGetFeedById, useLikeFeed } from '../feed.service'
import { IFeed } from '../feed.types'
import { FeedCommentForm } from './forms/create-feed-comment-form'
import { CreateFeedPostFormModal } from './forms/create-update-feed-post-form'

interface FeedPostCardProps {
    feed: IFeed
    onClickFeedAuthor?: (feed: IFeed) => void
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
                className="grid grid-cols-2 grid-rows-2 gap-1 rounded-xl overflow-hidden"
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

                <div className="row-span-1 overflow-clip cursor-zoom-in">
                    <img
                        alt="Post media 2"
                        className="w-full h-full flex-1 object-cover"
                        loading="lazy"
                        onClick={() => previewState.onOpenChange(true)}
                        src={feedMedias[1].media?.download_url}
                    />
                </div>
                <div className="row-span-1 overflow-clip cursor-zoom-in">
                    <img
                        alt="Post media 3"
                        className="w-full h-full flex-1 object-cover"
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
            className="grid grid-cols-2 grid-rows-2 gap-2 rounded-xl overflow-hidden"
            style={{ height: 280 }}
        >
            <ImagePreviewCarousel
                {...previewState}
                images={feedMedias.map((media) => media.media)}
            />
            <img
                alt="Post media 1"
                className="w-full h-full object-cover row-span-2 cursor-zoom-in"
                loading="lazy"
                onClick={() => previewState.onOpenChange(true)}
                src={visible[0].media?.download_url}
            />
            <div className="row-span-1 overflow-clip cursor-zoom-in">
                <img
                    alt="Post media 2"
                    className="w-full h-full flex-1 object-cover"
                    loading="lazy"
                    onClick={() => previewState.onOpenChange(true)}
                    src={visible[1].media?.download_url}
                />
            </div>
            <div
                className="relative w-full row-span-1 flex-1 cursor-zoom-in overflow-clip"
                onClick={() => previewState.onOpenChange(true)}
            >
                <img
                    alt="Post media 3"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onClick={() => previewState.onOpenChange(true)}
                    src={visible[2].media?.download_url}
                />
                {extra > 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-3xl font-bold text-background dark:text-foreground">
                            +{extra}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

const UserFeedBar = ({
    feed,
    onClickFeedAuthor,
}: {
    feed: IFeed
    onClickFeedAuthor?: (feed: IFeed) => void
}) => {
    return (
        <div className="flex items-center gap-3">
            <ImageDisplay
                className="size-9"
                src={feed.created_by?.media?.download_url}
            />
            <div>
                <p
                    className="cursor-pointer font-semibold text-sm text-card-foreground leading-tight"
                    onClick={() => onClickFeedAuthor?.(feed)}
                >
                    {feed.created_by?.user_name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                    {toReadableDateTime(feed.created_at)}
                </p>
            </div>
        </div>
    )
}

const FeedHeader = ({
    feed,
    className,
    onClickFeedAuthor,
    handleRefresh,
}: {
    feed: IFeed
    isRefreshing?: boolean
    onClickFeedAuthor?: (feed: IFeed) => void
    handleRefresh?: () => void
} & IClassProps) => {
    const deleteMutation = useDeleteFeedById()
    const editModalState = useModalState()

    return (
        <div
            className={cn(
                'flex items-start justify-between px-4 pt-4 pb-3',
                className
            )}
        >
            <UserFeedBar feed={feed} onClickFeedAuthor={onClickFeedAuthor} />
            <CreateFeedPostFormModal
                {...editModalState}
                formProps={{
                    defaultValues: feed,
                    feedId: feed.id,
                }}
                title="Update Post"
            />
            <div className="flex items-center gap-x-1">
                {handleRefresh && (
                    <Button
                        className="h-8 w-8 text-muted-foreground rounded-full hover:bg-muted"
                        onClick={handleRefresh}
                        size="icon"
                        variant="ghost"
                    >
                        <RefreshIcon className="size-4" />
                    </Button>
                )}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            className="h-8 w-8 text-muted-foreground rounded-full hover:bg-muted"
                            size="icon"
                            variant="ghost"
                        >
                            <MoreHorizontal className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuGroup className="space-y-1">
                            <DropdownMenuLabel>Post Menu</DropdownMenuLabel>
                            <DropdownMenuItem
                                disabled={
                                    !hasPermissionFromAuth({
                                        action: ['Update', 'OwnUpdate'],
                                        resourceType: 'Feed',
                                        resource: feed,
                                    })
                                }
                                onClick={() =>
                                    editModalState.onOpenChange(true)
                                }
                            >
                                <PencilFillIcon className="mr-2" />
                                Edit post
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-destructive bg-destructive/5 focus:bg-destructive focus:text-destructive-foreground"
                                disabled={
                                    !hasPermissionFromAuth({
                                        action: ['Delete', 'OwnDelete'],
                                        resourceType: 'Feed',
                                        resource: feed,
                                    }) || deleteMutation.isPending
                                }
                                onClick={() => {
                                    toast.promise(
                                        deleteMutation.mutateAsync(feed.id),
                                        {
                                            loading: 'Deleting',
                                            success: 'Post deleted',
                                            error: 'Failed to delete post',
                                        }
                                    )
                                }}
                            >
                                <TrashFillIcon className="mr-2" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
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

const FeedLikers = ({ feed }: { feed: IFeed }) => {
    return (
        <div className="p-4">
            {feed.user_likes?.map((liker) => (
                <div className="flex px-4 items-center gap-3" key={liker.id}>
                    <ImageDisplay
                        className="size-9"
                        src={liker?.user?.media?.download_url}
                    />
                    <div>
                        <p className="font-semibold text-sm text-card-foreground leading-tight">
                            {liker?.user?.user_name}
                        </p>
                        <p className="text-xs text-muted-foreground leading-tight">
                            {dateAgo(liker?.created_at)}
                        </p>
                    </div>
                    <Heart className="inline ml-auto stroke-destructive size-4 fill-destructive" />
                </div>
            ))}
        </div>
    )
}

const FeedLikersDialog = ({
    feed,
    className,
    ...props
}: IModalProps & { feed: IFeed }) => {
    return (
        <Dialog {...props}>
            <DialogContent
                className={cn(
                    '!max-w-xl rounded-2xl p-0 gap-0 overflow-hidden !max-h-[80vh] ecoop-scroll overflow-y-auto bg-card border-border/60 shadow-2xl',
                    className
                )}
                closeButtonClassName="hidden sr-only"
            >
                <DialogHeader className="px-6 py-4 border-b border-border/60">
                    <DialogTitle className="text-center text-sm font-semibold text-card-foreground">
                        {`${feed.created_by?.user_name} post's likes`}{' '}
                        <Heart className="inline stroke-destructive size-4 fill-destructive" />
                    </DialogTitle>
                </DialogHeader>
                <FeedLikers feed={feed} />
            </DialogContent>
        </Dialog>
    )
}

const FeedLikesCommentsBar = ({
    feed,
    onCommentClick,
}: {
    feed: IFeed
    onCommentClick?: () => void
}) => {
    const viewFeedLikersModal = useModalState()
    const [liked, setLiked] = useState(feed.is_liked)

    const totalLikes = (feed.user_likes ? feed.user_likes : []).length
    const totalComments = (feed.feed_comments ? feed.feed_comments : []).length

    const { mutateAsync: likeAsync, isPending } = useLikeFeed()

    return (
        <>
            <FeedLikersDialog {...viewFeedLikersModal} feed={feed} />

            <div className="px-4 -mt-1 pb-2 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                    {totalLikes > 0 && (
                        <span
                            className="cursor-pointer"
                            onClick={() =>
                                viewFeedLikersModal.onOpenChange(true)
                            }
                        >
                            {formatCount(totalLikes)} Like
                            {totalLikes > 1 ? 's' : ''}
                        </span>
                    )}
                </div>
                {/* <div className="flex items-center gap-3">
                    {totalComments > 0 && (
                        <span>{formatCount(totalComments)} Comments</span>
                    )}
                </div> */}
            </div>

            <div className="h-px bg-border dark:bg-border/15" />

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

const FeedPostCard = ({ feed, onClickFeedAuthor }: FeedPostCardProps) => {
    const postModalState = useModalState()

    return (
        <article className="bg-popover rounded-xl w-full shadow-xs">
            <FeedHeader feed={feed} onClickFeedAuthor={onClickFeedAuthor} />
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

    const deleteCommentMutation = useDeleteFeedCommentById()
    const viewMediaModal = useModalState()

    return (
        <div className="px-4 py-1 flex items-start gap-x-2">
            <ImageDisplay
                className="size-8 mt-2"
                src={comment.user?.media?.download_url}
            />
            {media && (
                <ImagePreviewCarousel
                    {...viewMediaModal}
                    images={media ? [media] : []}
                />
            )}
            <div className="max-w-full">
                <div className="bg-muted dark:bg-secondary/40 rounded-2xl space-y-2 p-4">
                    <div className="flex text-xs gap-x-2 items-center">
                        <div className="flex items-center gap-x-2">
                            <p className="text-xs truncate font-bold">
                                {comment.user?.full_name}
                            </p>
                            {comment.user && (
                                <p className="text-muted-foreground dark:text-muted-foreground/40 text-xs">
                                    @{comment.user.user_name}
                                </p>
                            )}
                        </div>
                        <span className="text-muted-foreground dark:text-muted-foreground/40 text-xs">
                            ·
                        </span>
                        <time
                            className="text-muted-foreground dark:text-muted-foreground/40 text-xs"
                            dateTime={comment.created_at}
                        >
                            {dateAgo(comment.created_at)}
                        </time>
                    </div>
                    <p className="text-sm">{comment.comment}</p>
                </div>
                {comment.media && (
                    <div className="">
                        <div className="flex items-center justify-start w-full h-full py-2">
                            <img
                                alt={`comment-${comment.id}-image-attachment`}
                                className="object-contain rounded-xl cursor-pointer select-none"
                                draggable={false}
                                onClick={() =>
                                    viewMediaModal.onOpenChange(true)
                                }
                                src={media?.download_url}
                                style={{
                                    maxWidth: 'min(100%, 1200px)',
                                    maxHeight: 'calc(180px)',
                                    width: 'auto',
                                    height: 'auto',
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        className="h-8 w-8 text-muted-foreground rounded-full hover:bg-muted"
                        size="icon"
                        variant="ghost"
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuGroup className="space-y-1">
                        <DropdownMenuItem
                            className="text-destructive bg-destructive/5 focus:bg-destructive focus:text-destructive-foreground"
                            disabled={
                                !hasPermissionFromAuth({
                                    action: ['Delete', 'OwnDelete'],
                                    resourceType: 'FeedComment',
                                    resource: comment,
                                }) || deleteCommentMutation.isPending
                            }
                            onClick={() => {
                                toast.promise(
                                    deleteCommentMutation.mutateAsync(
                                        comment.id
                                    ),
                                    {
                                        loading: 'Deleting comment...',
                                        success: 'Comment deleted',
                                        error: 'Failed to delete comment',
                                    }
                                )
                            }}
                        >
                            <TrashFillIcon className="mr-2" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
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
                    'flex items-center justify-center gap-2 py-4 px-1 text-muted-foreground/60 dark:text-muted-foreground/40 text-xs',
                    className
                )}
            >
                <span>Be the first to comment</span>
            </div>
        )
    }

    return (
        <div className={cn('flex flex-col', className)}>
            <p className="text-lg font-bold px-4">
                Comments{' '}
                <Badge className="inline py-0.5" variant="secondary">
                    {comments.length}
                </Badge>
            </p>
            {comments.map((comment) => (
                <CommentItem comment={comment} key={comment.id} />
            ))}
        </div>
    )
}

const FeedPostCardModal = ({
    feed: initialFeed,
    className,
    ...props
}: FeedPostCardProps & Omit<IModalProps, 'title'>) => {
    const { data: feed, refetch } = useGetFeedById({
        id: initialFeed.id,
        options: { initialData: initialFeed },
    })
    const canComment = hasPermissionFromAuth({
        action: 'Create',
        resourceType: 'FeedComment',
        resource: feed,
    })

    return (
        <Dialog {...props}>
            <DialogContent
                className={cn(
                    '!max-w-2xl rounded-2xl p-0 gap-0 overflow-hidden !max-h-[95vh] ecoop-scroll overflow-y-auto bg-card border-border/60 shadow-2xl',
                    className
                )}
                closeButtonClassName="hidden sr-only"
            >
                <DialogHeader className="px-6 py-4 border-b border-border/60 sr-only hidden">
                    <DialogTitle className="text-center text-sm font-semibold text-card-foreground">
                        {`${feed?.created_by?.user_name} post`}
                    </DialogTitle>
                </DialogHeader>
                <article className="bg-popover rounded-xl w-full shadow-xs">
                    <div className="sticky top-0 bg-popover/95 backdrop-blur-xs">
                        <FeedHeader feed={feed!} handleRefresh={refetch} />
                        <FeedDescription feed={feed!} />
                    </div>
                    <FeedMediaSection feed={feed!} />
                    <FeedLikesCommentsBar feed={feed!} />
                    <FeedComments feed={feed!} />
                    {canComment ? (
                        <FeedCommentForm
                            className="w-full max-w-full bg-popover sticky bottom-0"
                            feedId={feed!.id}
                        />
                    ) : (
                        <p className="text-xs text-center w-full my-4 text-muted-foreground/70">
                            you are not allowed to comment
                        </p>
                    )}
                </article>
            </DialogContent>
        </Dialog>
    )
}

export default FeedPostCard
