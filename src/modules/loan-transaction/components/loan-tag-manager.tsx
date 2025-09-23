import { useMemo } from 'react'

import { toast } from 'sonner'

import { cn } from '@/helpers'
import { dateAgo, toReadableDateTime } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import {
    ILoanTag,
    useCreateLoanTag,
    useDeleteLoanTagById,
    useGetAllLoanTag,
} from '@/modules/loan-tag'
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

export const LoanTagsManagerPopover = ({
    loanTransactionId,
    defaultLoanTags,
    size = 'default',
    readOnly,
    className,
    children,
}: {
    loanTransactionId: TEntityId
    defaultLoanTags?: ILoanTag[]
    size?: LoanTagManagerSize
    readOnly?: boolean
} & IBaseProps) => {
    const { data: loanTags = [], isPending } = useGetAllLoanTag({
        mode: 'loan-transaction',
        loanTransactionId,
        options: {
            initialData: defaultLoanTags,
            retry: 0,
            enabled: !!loanTransactionId,
        },
    })

    const tagCount = useMemo(() => loanTags.length, [loanTags])

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
                <LoanTagsManager
                    loanTransactionId={loanTransactionId}
                    defaultLoanTags={defaultLoanTags}
                    size={size}
                    readOnly={readOnly}
                />
            </PopoverContent>
        </Popover>
    )
}

type LoanTagManagerSize = 'sm' | 'default' | 'lg'

export function LoanTagsManager({
    readOnly,
    className,
    loanTransactionId,
    defaultLoanTags,
    size = 'default',
}: {
    readOnly?: boolean
    loanTransactionId: TEntityId
    defaultLoanTags?: ILoanTag[]
    onSuccess?: () => void
    size?: LoanTagManagerSize
} & IClassProps) {
    const tagPickerModal = useModalState()

    const {
        data: loanTags = [],
        isPending,
        refetch,
    } = useGetAllLoanTag({
        mode: 'loan-transaction',
        loanTransactionId,
        options: { initialData: defaultLoanTags, retry: 0 },
    })

    const createLoanTagMutation = useCreateLoanTag()

    return (
        <div className={cn('space-y-2', className)}>
            <TagTemplatePicker
                modalState={tagPickerModal}
                triggerClassName="hidden"
                onSelect={({ color, name, description, icon }) => {
                    toast.promise(
                        createLoanTagMutation.mutateAsync({
                            name,
                            icon,
                            color,
                            description,
                            loan_transaction_id: loanTransactionId,
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
                    <p className="text-sm">Loan Tags</p>
                    {isPending && (
                        <LoadingSpinner className="size-3 mt-2 text-muted-foreground/70 inline" />
                    )}
                </div>
                <p className="text-xs text-muted-foreground">
                    Tags provide a quick context about this loan.
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
                {loanTags.map((tag) => (
                    <LoanTagChip
                        key={tag.id}
                        tag={tag}
                        size={size}
                        onRemove={readOnly ? undefined : refetch}
                    />
                ))}
            </div>
            <p className="text-xs block text-muted-foreground">
                {loanTags.length} tag{loanTags.length > 1 && 's'}
            </p>
        </div>
    )
}

const loanTagChipVariants = cva(
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

type LoanTagChipProps = {
    tag: ILoanTag
    onRemove?: () => void
    size?: LoanTagManagerSize
} & VariantProps<typeof loanTagChipVariants>

export const LoanTagChip = ({
    tag,
    onRemove,
    size = 'default',
}: LoanTagChipProps) => {
    const { onOpen } = useConfirmModalStore()
    const deleteMutation = useDeleteLoanTagById({
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
            <div className={loanTagChipVariants({ size })}>
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
                                    'Are you sure to remove this loan tag from this loan?',
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
