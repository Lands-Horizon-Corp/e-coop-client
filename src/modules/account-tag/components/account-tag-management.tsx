import { ReactNode, useMemo } from 'react'

import { toast } from 'sonner'

import { cn } from '@/helpers'
import { dateAgo, toReadableDateTime } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { TTagCategory } from '@/modules/tag-template'
import TagTemplatePicker from '@/modules/tag-template/components/tag-template-picker'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { VariantProps, cva } from 'class-variance-authority'

import { PlusIcon, RenderIcon, TIcon, TagIcon, XIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import InfoTooltip from '@/components/tooltips/info-tooltip'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'

import { useModalState } from '@/hooks/use-modal-state'

import { IBaseProps, IClassProps, TEntityId } from '@/types'

import {
    useCreateAccountTag,
    useDeleteAccountTagById,
    useGetAllAccountTag,
} from '../account-tag.service'
import { IAccountTag } from '../account-tag.types'

type AccountTagManagerSize = 'sm' | 'default' | 'lg'

const accountTagChipVariants = cva(
    'flex items-center gap-x-1 rounded border bg-accent/50 text-accent-foreground transition-all duration-200',
    {
        variants: {
            size: {
                sm: 'px-2 py-1 text-xs',
                default: 'px-2 py-px text-sm',
                lg: 'px-3 py-1.5 text-base',
            },
        },
        defaultVariants: {
            size: 'default',
        },
    }
)

type AccountTagChipProps = {
    tag: IAccountTag
    onRemove?: () => void
    size?: AccountTagManagerSize
} & VariantProps<typeof accountTagChipVariants>

export const AccountTagChip = ({
    tag,
    onRemove,
    size = 'default',
}: AccountTagChipProps) => {
    const { onOpen } = useConfirmModalStore()

    const deleteMutation = useDeleteAccountTagById({
        options: { onSuccess: onRemove },
    })

    const handleDelete = () => {
        onOpen({
            title: 'Remove Tag',
            description: `Are you sure you want to remove the tag "${tag.name}" from this account?`,
            confirmString: 'Remove',
            onConfirm: () =>
                toast.promise(deleteMutation.mutateAsync(tag.id), {
                    loading: 'Deleting tag...',
                    success: 'Tag deleted successfully',
                    error: (error) =>
                        serverRequestErrExtractor({
                            error,
                        }),
                }),
        })
    }

    const tooltipContent = (
        <p className="text-pretty text-foreground max-w-[400px]">
            {tag.description}

            {tag.created_at && (
                <span className="text-[12px] block mt-2 text-muted-foreground">
                    {toReadableDateTime(tag.created_at)} (
                    {dateAgo(tag.created_at)})
                </span>
            )}
        </p>
    )

    return (
        <InfoTooltip content={tooltipContent} delayDuration={700}>
            <div className={accountTagChipVariants({ size })}>
                {tag.icon && (
                    <RenderIcon
                        icon={tag.icon as TIcon}
                        style={{ color: tag.color }}
                    />
                )}
                <span>{tag.name}</span>
                {onRemove && (
                    <Button
                        className="size-fit cursor-pointer text-xs p-0 hover:text-red-600 disabled:opacity-50"
                        disabled={deleteMutation.isPending}
                        onClick={handleDelete}
                        size="icon"
                        type="button"
                        variant="ghost"
                    >
                        <XIcon className="size-4" />
                    </Button>
                )}
            </div>
        </InfoTooltip>
    )
}

export function AccountTagsManager({
    readOnly,
    className,
    accountId,
    defaultTags,
    onSuccess,
    size = 'default',
}: {
    readOnly?: boolean
    accountId: TEntityId
    defaultTags?: IAccountTag[]
    onSuccess?: () => void
    size?: AccountTagManagerSize
} & IClassProps) {
    const tagPickerModal = useModalState()

    const {
        data: accountTags = [],
        isPending,
        refetch,
    } = useGetAllAccountTag({
        accountId,
        options: { initialData: defaultTags, retry: 0, enabled: !!accountId },
        mode: 'account-tag',
    })

    const createTagMutation = useCreateAccountTag({
        options: {
            onSuccess:
                onSuccess ??
                (() => {
                    refetch()
                }),
        },
    })

    const handleTagSelect = ({
        color,
        name,
        description,
        icon,
        category,
    }: {
        color: string
        name: string
        description: string
        icon: string
        category: TTagCategory
    }) => {
        toast.promise(
            createTagMutation.mutateAsync({
                account_id: accountId,
                name,
                icon,
                color,
                description,
                category,
            }),
            {
                loading: 'Adding tag...',
                success: 'Tag Added successfully',
                error: (error) => serverRequestErrExtractor({ error }),
            }
        )
    }

    return (
        <div className={cn('space-y-2', className)}>
            <TagTemplatePicker
                modalState={tagPickerModal}
                onSelect={handleTagSelect}
                triggerClassName="hidden"
            />
            <div className="w-full space-y-1">
                <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold">Account Tags</p>
                    {isPending && (
                        <LoadingSpinner className="size-4 text-primary" />
                    )}
                </div>
                <p className="text-xs text-muted-foreground">
                    Tags provide quick context and categorization for this
                    account.
                </p>
            </div>
            <Separator />
            <div className="flex gap-1.5 flex-wrap ">
                {!readOnly && (
                    <Button
                        className="border-dashed rounded !size-fit py-1 !px-1 text-xs"
                        disabled={createTagMutation.isPending}
                        onClick={() => tagPickerModal.onOpenChange(true)}
                        type="button"
                        variant="outline"
                    >
                        <PlusIcon className="inline size-3 mr-1 text-accent-foreground" />{' '}
                        Add Tag
                    </Button>
                )}
                {/* Render existing tags */}
                {accountTags?.map((tag) => (
                    <AccountTagChip
                        key={tag.id}
                        onRemove={readOnly ? undefined : refetch}
                        size={size}
                        tag={tag}
                    />
                ))}
            </div>
            <p className="text-xs block text-muted-foreground pt-1">
                {accountTags.length} tag{accountTags.length !== 1 && 's'}{' '}
                currently applied.
            </p>
        </div>
    )
}

export const AccountTagsManagerPopover = ({
    accountId,
    defaultTags,
    size = 'default',
    readOnly,
    className,
    children,
    onSuccess,
}: {
    accountId: TEntityId
    defaultTags?: IAccountTag[]
    size?: AccountTagManagerSize
    readOnly?: boolean
    onSuccess?: () => void
} & IBaseProps & { children?: ReactNode }) => {
    const { data: accountTags = [], isPending } = useGetAllAccountTag({
        accountId,
        options: {
            initialData: defaultTags,
            retry: 0,
            enabled: !!accountId,
        },
        mode: 'account-tag',
    })

    const tagCount = useMemo(() => accountTags.length, [accountTags])

    const defaultTrigger = (
        <Button
            className={cn(
                'size-fit !p-0 border-accent rounded-full !py-0.5 !px-2 ',
                className
            )}
            disabled={isPending}
            size="sm"
            type="button"
            variant="outline"
        >
            <TagIcon /> <span>{isPending ? '...' : tagCount} Tags</span>
        </Button>
    )

    return (
        <Popover modal>
            <PopoverTrigger asChild>
                {children ? children : defaultTrigger}
            </PopoverTrigger>
            <PopoverContent className="w-auto min-w-[220px] rounded-xl max-w-[340px]  ">
                <AccountTagsManager
                    accountId={accountId}
                    defaultTags={defaultTags}
                    onSuccess={onSuccess}
                    readOnly={readOnly}
                    size={size}
                />
            </PopoverContent>
        </Popover>
    )
}
