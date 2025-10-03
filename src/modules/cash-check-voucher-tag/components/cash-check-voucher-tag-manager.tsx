import { ReactNode, useMemo } from 'react'

import { toast } from 'sonner'

import { cn } from '@/helpers'
import { dateAgo, toReadableDateTime } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
// Assuming these come from the index file one level up

import TagTemplatePicker from '@/modules/tag-template/components/tag-template-picker'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { type VariantProps, cva } from 'class-variance-authority'

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
    ICashCheckVoucherTag,
    useCreateCashCheckVoucherTag,
    useDeleteCashCheckVoucherTagById,
    useGetAllCashCheckVoucherTag,
} from '..'

type CashCheckVoucherTagManagerSize = 'sm' | 'default' | 'lg'

const cashCheckVoucherTagChipVariants = cva(
    'flex items-center gap-x-1 rounded border bg-accent/50 text-accent-foreground',
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

type CashCheckVoucherTagChipProps = {
    tag: ICashCheckVoucherTag
    onRemove?: () => void
    size?: CashCheckVoucherTagManagerSize
} & VariantProps<typeof cashCheckVoucherTagChipVariants>

export const CashCheckVoucherTagChip = ({
    tag,
    onRemove,
    size = 'default',
}: CashCheckVoucherTagChipProps) => {
    const { onOpen } = useConfirmModalStore()
    const deleteMutation = useDeleteCashCheckVoucherTagById({
        options: { onSuccess: onRemove },
    })

    return (
        <InfoTooltip
            content={
                <p className="text-pretty text-foreground max-w-[400px]">
                    {tag.description}

                    {tag.created_at && (
                        <span className="text-[12px] block mt-2 text-muted-foreground">
                            {toReadableDateTime(tag.created_at)} (
                            {dateAgo(tag.created_at)})
                        </span>
                    )}
                </p>
            }
            delayDuration={700}
        >
            <div className={cashCheckVoucherTagChipVariants({ size })}>
                {tag.icon && (
                    <RenderIcon
                        icon={tag.icon as TIcon}
                        style={{ color: tag.color }}
                    />
                )}
                <span>{tag.name}</span>
                {onRemove && (
                    <Button
                        size="icon"
                        type="button"
                        variant="ghost"
                        onClick={() =>
                            onOpen({
                                title: 'Remove Tag',
                                description:
                                    'Are you sure to remove this tag from this cash check voucher?',
                                confirmString: 'Remove',
                                onConfirm: () =>
                                    toast.promise(
                                        deleteMutation.mutateAsync(tag.id),
                                        {
                                            loading: 'Deleting tag...',
                                            success: 'Tag deleted',
                                            error: (error) =>
                                                serverRequestErrExtractor({
                                                    error,
                                                }),
                                        }
                                    ),
                            })
                        }
                        className="size-fit cursor-pointer text-xs hover:text-red-600 disabled:opacity-50"
                    >
                        <XIcon className="size-4" />
                    </Button>
                )}
            </div>
        </InfoTooltip>
    )
}

export function CashCheckVoucherTagsManager({
    readOnly,
    className,
    cashCheckVoucherId,
    defaultTags,
    onSuccess,
    size = 'default',
}: {
    readOnly?: boolean
    cashCheckVoucherId: TEntityId
    defaultTags?: ICashCheckVoucherTag[]
    onSuccess?: () => void
    size?: CashCheckVoucherTagManagerSize
} & IClassProps) {
    const tagPickerModal = useModalState()

    const {
        data: voucherTags = [],
        isPending,
        refetch,
    } = useGetAllCashCheckVoucherTag({
        mode: 'all',
        cashCheckVoucherId,
        options: { initialData: defaultTags, retry: 0 },
    })

    const createTagMutation = useCreateCashCheckVoucherTag({
        options: { onSuccess: onSuccess ?? (() => refetch()) },
    })

    return (
        <div className={cn('space-y-2', className)}>
            <TagTemplatePicker
                modalState={tagPickerModal}
                triggerClassName="hidden"
                onSelect={({ color, name, description, icon }) => {
                    toast.promise(
                        createTagMutation.mutateAsync({
                            name,
                            icon,
                            color,
                            description,
                            loan_transaction_id: cashCheckVoucherId,
                        }),
                        {
                            loading: 'Adding tag...',
                            success: 'Tag Added',
                            error: (error) =>
                                serverRequestErrExtractor({ error }),
                        }
                    )
                }}
            />
            <div className="w-full space-y-1">
                <div className="flex justify-between">
                    <p className="text-sm">Voucher Tags</p>
                    {isPending && (
                        <LoadingSpinner className="size-3 mt-2 text-muted-foreground/70 inline" />
                    )}
                </div>
                <p className="text-xs text-muted-foreground">
                    Tags provide a quick context about this cash check voucher.
                </p>
            </div>
            <Separator />
            <div className="flex gap-1.5 flex-wrap ">
                {!readOnly && (
                    <Button
                        type="button"
                        variant="outline"
                        className="border-dashed rounded !size-fit py-1 !px-1 text-xs"
                        onClick={() => tagPickerModal.onOpenChange(true)}
                    >
                        <PlusIcon className="inline text-accent-foreground" />{' '}
                        Add Tag
                    </Button>
                )}
                {voucherTags.map((tag) => (
                    <CashCheckVoucherTagChip
                        key={tag.id}
                        tag={tag}
                        size={size}
                        onRemove={readOnly ? undefined : refetch}
                    />
                ))}
            </div>
            <p className="text-xs block text-muted-foreground">
                {voucherTags.length} tag{voucherTags.length !== 1 && 's'}
            </p>
        </div>
    )
}

export const CashCheckVoucherTagsManagerPopover = ({
    cashCheckVoucherId,
    defaultTags,
    size = 'default',
    readOnly,
    className,
    children,
}: {
    cashCheckVoucherId: TEntityId
    defaultTags?: ICashCheckVoucherTag[]
    size?: CashCheckVoucherTagManagerSize
    readOnly?: boolean
} & IBaseProps & { children?: ReactNode }) => {
    const { data: voucherTags = [], isPending } = useGetAllCashCheckVoucherTag({
        mode: 'all',
        cashCheckVoucherId,
        options: {
            initialData: defaultTags,
            retry: 0,
            enabled: !!cashCheckVoucherId,
        },
    })

    const tagCount = useMemo(() => voucherTags.length, [voucherTags])

    return (
        <Popover modal>
            <PopoverTrigger asChild>
                {children ? (
                    children
                ) : (
                    <Button
                        size="sm"
                        type="button"
                        variant="outline"
                        className={cn(
                            'size-fit !p-0 border-accent rounded-full !py-0.5 !px-1.5',
                            className
                        )}
                    >
                        <TagIcon />{' '}
                        <span>{isPending ? '...' : tagCount} Tags</span>
                    </Button>
                )}
            </PopoverTrigger>
            <PopoverContent className="w-auto min-w-[220px] rounded-xl max-w-[340px]">
                <CashCheckVoucherTagsManager
                    cashCheckVoucherId={cashCheckVoucherId}
                    defaultTags={defaultTags}
                    size={size}
                    readOnly={readOnly}
                />
            </PopoverContent>
        </Popover>
    )
}
