import { useCallback, useMemo, useState } from 'react'

import { dateAgo } from '@/helpers/date-utils'
import { cn } from '@/helpers/tw-utils'
import KanbanContainer from '@/modules/approvals/components/kanban/kanban-container'
import KanbanItemsContainer from '@/modules/approvals/components/kanban/kanban-items-container'
import KanbanTitle from '@/modules/approvals/components/kanban/kanban-title'
import {
    IJournalVoucher,
    useGetAllJournalVoucher,
} from '@/modules/journal-voucher'
import {
    JournalVoucherTagChip,
    JournalVoucherTagsManagerPopover,
} from '@/modules/journal-voucher-tag/components/journal-voucher-tag-management'
import JournalVoucherApproveReleaseDisplayModal, {
    TJournalVoucherApproveReleaseDisplayMode,
} from '@/modules/journal-voucher/components/forms/journal-voucher-approve-release-modal'
import JournalVoucherPrintFormModal from '@/modules/journal-voucher/components/forms/journal-voucher-create-print-modal'
import JournalVoucherCreateUpdateFormModal from '@/modules/journal-voucher/components/forms/journal-voucher-create-update-modal'
import { JournalVoucherSkeletonCard } from '@/modules/journal-voucher/components/journal-voucher-skeleton-card'
import JournalVoucherStatusIndicator from '@/modules/journal-voucher/components/journal-voucher-status-indicator'
import JournalVoucherOtherAction from '@/modules/journal-voucher/components/tables/journal-voucher-other-action'
import { CheckCircle2Icon, PrinterIcon } from 'lucide-react'

import {
    BadgeCheckFillIcon,
    CollapseIcon,
    DraftIcon,
    EyeIcon,
    IdCardIcon,
    PencilFillIcon,
    TicketIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import InfoTooltip from '@/components/tooltips/info-tooltip'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps } from '@/types'

// --- Type and Hook Definitions ---
type UseCardKanbanActionsProps = {
    journalVoucher: IJournalVoucher
    onDeleteSuccess?: () => void
    refetch?: () => void
}

const useCardKanbanActions = ({
    journalVoucher,
    refetch,
}: UseCardKanbanActionsProps) => {
    const journalVoucherModalState = useModalState(false)

    const handleOpenViewModal = () => {
        journalVoucherModalState.onOpenChange(true)
    }

    return {
        handleOpenViewModal,
        journalVoucherModalState,
        journalVoucher,
        refetch,
    }
}
type TJournalVoucherMode = 'draft' | 'printed' | 'approved' | 'released'

type JournalVoucherKanbanProps = {
    mode: TJournalVoucherMode
    icon: React.ReactNode
    isExpanded?: boolean
    handleExpand: (name: TJournalVoucherMode) => void
    expandedState?: Record<TJournalVoucherMode, boolean>
}
interface UseJournalVoucherActionsProps {
    journalVoucher: IJournalVoucher
    onDeleteSuccess?: () => void
    refetch?: () => void
}

interface ICJournalVoucherStatusDates {
    printed_date?: string | null
    approved_date?: string | null
    released_date?: string | null
}

interface IJournalVoucherCardProps extends IClassProps {
    journalVoucher: IJournalVoucher
    refetch: () => void
}

const useJournalVoucherActions = ({
    journalVoucher,
}: UseJournalVoucherActionsProps) => {
    const printModal = useModalState()
    const approveModal = useModalState()
    const releaseModal = useModalState()

    const handleOpenPrintModal = () => {
        printModal.onOpenChange(true)
    }
    const handleApproveModal = () => {
        approveModal.onOpenChange(true)
    }
    const handleReleaseModal = () => {
        releaseModal.onOpenChange(true)
    }

    return {
        journalVoucher,
        printModal,
        handleOpenPrintModal,
        approveModal,
        handleApproveModal,
        releaseModal,
        handleReleaseModal,
    }
}
// --- Component: JournalVoucherCardActions (Top right action group) ---
const JournalVoucherCardActions = ({
    journalVoucher,
    refetch,
}: Pick<IJournalVoucherCardProps, 'journalVoucher' | 'refetch'> & {
    jvDates: ICJournalVoucherStatusDates
}) => {
    const {
        printModal,
        handleOpenPrintModal,
        approveModal,
        handleApproveModal,
        releaseModal,
        handleReleaseModal,
    } = useJournalVoucherActions({ journalVoucher, refetch })

    const isReleased = !!journalVoucher.released_date

    const { handleOpenViewModal, journalVoucherModalState } =
        useCardKanbanActions({ journalVoucher, refetch })

    return (
        <>
            <JournalVoucherCreateUpdateFormModal
                {...journalVoucherModalState}
                formProps={{
                    defaultValues: journalVoucher,
                    readOnly: true,
                }}
            />
            <JournalVoucherPrintFormModal
                {...printModal}
                formProps={{
                    defaultValues: { ...journalVoucher },
                    journalVoucherId: journalVoucher.id,
                    onSuccess: () => {
                        refetch?.()
                    },
                }}
            />
            {['approve', 'undo-approve', 'release'].map((mode) => {
                const modalState =
                    mode === 'approve' ? approveModal : releaseModal
                return (
                    <div key={mode}>
                        <JournalVoucherApproveReleaseDisplayModal
                            {...modalState}
                            journalVoucher={journalVoucher}
                            mode={
                                mode as TJournalVoucherApproveReleaseDisplayMode
                            }
                            onSuccess={() => {
                                refetch?.()
                            }}
                        />
                    </div>
                )
            })}
            <div className="w-full flex items-center space-x-1 justify-start flex-shrink-0">
                <JournalVoucherTagsManagerPopover
                    journalVoucherId={journalVoucher.id}
                    size="sm"
                />
                <Button
                    aria-label="View Journal Voucher"
                    onClick={handleOpenViewModal}
                    size={'icon'}
                    variant="ghost"
                >
                    <EyeIcon />
                </Button>
                {!isReleased && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size={'icon'} variant="ghost">
                                {<PencilFillIcon className="size-4" />}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <JournalVoucherOtherAction
                                onApprove={handleApproveModal}
                                onPrint={handleOpenPrintModal}
                                onRefetch={refetch}
                                onRelease={handleReleaseModal}
                                row={journalVoucher}
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </>
    )
}

// --- Component: JournalVoucherCardCreatorInfo (Bottom row with amounts and user) ---
export const JournalVoucherCardCreatorInfo = ({
    journalVoucher,
}: Pick<IJournalVoucherCardProps, 'journalVoucher'>) => {
    return (
        <div className="flex items-center justify-end gap-x-2">
            <div className=" inline-flex items-center gap-2">
                <InfoTooltip
                    content={`created by ${journalVoucher.created_by?.full_name}`}
                >
                    <div className="text-right max-w-[200px] shrink">
                        <p className="truncate font-medium text-sm text-foreground/90">
                            {journalVoucher.created_by?.full_name}
                        </p>
                        <p className="text-xs text-end text-muted-foreground/70 truncate">
                            created by
                        </p>
                    </div>
                </InfoTooltip>
                <ImageDisplay
                    className="size-8 rounded-full"
                    src={journalVoucher?.created_by?.media?.download_url}
                />
            </div>
        </div>
    )
}
export const JournalKanbanInfoItem = ({
    className,
    title,
    infoTitle,
    content,
    icon,
}: {
    className?: string
    title?: string
    infoTitle?: string
    content?: string | number | React.ReactNode
    icon?: React.ReactNode
}) => {
    return (
        <InfoTooltip content={infoTitle}>
            <div
                className={cn(
                    'px-1 max-w-full mx-auto min-w-0 grow flex items-center gap-x-4 rounded bg-secondary/40 ring-2 ring-secondary/60 ',
                    className
                )}
            >
                <span className="text-muted-foreground/70 text-xs shrink-0">
                    {icon}
                    {title}
                </span>
                <Separator className="min-h-8" orientation="vertical" />
                <p className="font-mono text-xs text-nowrap overflow-x-scroll ecoop-scroll tracking-wider max-w-full">
                    {content}
                </p>
            </div>
        </InfoTooltip>
    )
}

// --- Component: JournalVoucherCard ---
export const JournalVoucherCard = ({
    journalVoucher,
    className,
    refetch,
}: IJournalVoucherCardProps) => {
    const hasJournalEntries =
        journalVoucher.journal_voucher_tags &&
        journalVoucher?.journal_voucher_tags?.length > 0

    return (
        <div
            className={cn(
                'group space-y-2 relative transition-shadow ',
                className
            )}
        >
            {journalVoucher.cash_voucher_number && (
                <JournalKanbanInfoItem
                    content={journalVoucher.cash_voucher_number}
                    icon={<TicketIcon className="inline mr-2 size-5" />}
                    infoTitle="Voucher Number"
                    title="Voucher"
                />
            )}
            <div className="flex gap-x-2 grow">
                <JournalKanbanInfoItem
                    content={journalVoucher.total_debit}
                    icon={<IdCardIcon className="inline mr-2 size-5" />}
                    infoTitle="Total Debit"
                    title="Debit"
                />
                <JournalKanbanInfoItem
                    content={journalVoucher.total_credit}
                    icon={<IdCardIcon className="inline mr-2 size-5" />}
                    infoTitle="Total Credit"
                    title="Credit"
                />
            </div>
            {hasJournalEntries && (
                <div className="w-full flex py-2 ecoop-scroll flex-wrap gap-1 max-h-16 overflow-x-auto ">
                    {journalVoucher?.journal_voucher_tags?.map((tag) => (
                        <JournalVoucherTagChip
                            key={tag.id}
                            onRemove={() => {
                                refetch()
                            }}
                            tag={tag}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

const useFilteredVouchers = (
    data: IJournalVoucher[] | undefined,
    mode: TJournalVoucherMode
) => {
    return useMemo(() => {
        if (!data) return []

        return data.filter((jv) => {
            const hasPrinted = !!jv.printed_date
            const hasApproved = !!jv.approved_date
            const hasReleased = !!jv.released_date

            switch (mode) {
                case 'draft':
                    return !hasPrinted
                case 'printed':
                    return hasPrinted && !hasApproved && !hasReleased
                case 'approved':
                    return hasPrinted && hasApproved && !hasReleased
                case 'released':
                    return hasPrinted && hasApproved && hasReleased
                default:
                    return false
            }
        })
    }, [data, mode])
}

// --- Component ---
export const JournalVoucherKanbanMain = ({
    mode,
    icon,
    handleExpand,
}: JournalVoucherKanbanProps) => {
    const { data, isLoading, refetch, isRefetching } = useGetAllJournalVoucher()
    const dataFiltered = useFilteredVouchers(data, mode)

    const allIds = useMemo(
        () => dataFiltered.map((jv) => jv.id),
        [dataFiltered]
    )
    const [openVouchers, setOpenVouchers] = useState<string[]>([])

    const handleExpandAll = useCallback(() => {
        setOpenVouchers(allIds)
    }, [allIds])

    const handleCollapseAll = useCallback(() => {
        setOpenVouchers([])
    }, [])

    const handleColumnToggle = () => {
        handleExpand(mode)
    }
    const isExpanded = openVouchers.length > 0
    const hasItem = dataFiltered.length > 0

    const handleExpandedToggle = useCallback(() => {
        if (isExpanded) {
            handleCollapseAll()
        } else {
            handleExpandAll()
        }
    }, [isExpanded])

    if (isLoading) return <JournalVoucherSkeletonCard className="w-[420px]" />

    return (
        <KanbanContainer className="w-[420px] shrink-0 relative ">
            <div className="flex flex-col gap-2 p-2">
                <div
                    className="flex items-center gap-2"
                    onClick={handleColumnToggle}
                >
                    {icon}
                    <KanbanTitle
                        isLoading={isRefetching}
                        onRefresh={() => refetch()}
                        otherActions={
                            hasItem && (
                                <Button
                                    className="!size-fit !p-0.5 "
                                    onClick={handleExpandedToggle}
                                    size="sm"
                                    variant="ghost"
                                >
                                    <CollapseIcon />
                                </Button>
                            )
                        }
                        title={mode}
                        titleClassName="capitalize"
                        totalItems={dataFiltered.length}
                    />
                </div>
            </div>
            <Separator />

            <KanbanItemsContainer>
                {dataFiltered.length > 0 ? (
                    <Accordion
                        className="w-full space-y-2"
                        onValueChange={setOpenVouchers}
                        type="multiple"
                        value={openVouchers}
                    >
                        {dataFiltered.map((journalVoucher) => {
                            const jvDates: ICJournalVoucherStatusDates = {
                                printed_date: journalVoucher.printed_date,
                                approved_date: journalVoucher.approved_date,
                                released_date: journalVoucher.released_date,
                            }
                            return (
                                <div
                                    className={cn(
                                        'group space-y-2 relative bg-card rounded-xl border border-border p-4 transition-shadow hover:shadow-lg hover:shadow-accent/10'
                                    )}
                                >
                                    <div className="flex justify-between items-center">
                                        <JournalVoucherStatusIndicator
                                            className="flex-shrink-0"
                                            journalVoucher={journalVoucher}
                                        />
                                        <p className="text-xs  right-3 top-1 text-end text-muted-foreground/70 truncate">
                                            {dateAgo(journalVoucher.date)}
                                        </p>
                                    </div>

                                    <AccordionItem
                                        className=" border-b-0  "
                                        key={journalVoucher.id}
                                        value={journalVoucher.id}
                                    >
                                        <InfoTooltip
                                            content={journalVoucher.name}
                                        >
                                            <AccordionTrigger className="truncate h-10">
                                                <p className="truncate text-lg font-bold text-foreground/95">
                                                    {journalVoucher.name
                                                        ? journalVoucher.name
                                                        : '-'}
                                                </p>
                                            </AccordionTrigger>
                                        </InfoTooltip>

                                        <AccordionContent className="px-2 py-2 text-muted-foreground">
                                            <JournalVoucherCard
                                                journalVoucher={journalVoucher}
                                                refetch={refetch}
                                            />
                                        </AccordionContent>
                                    </AccordionItem>
                                    <JournalVoucherCardActions
                                        journalVoucher={journalVoucher}
                                        jvDates={jvDates}
                                        refetch={refetch}
                                    />
                                    <JournalVoucherCardCreatorInfo
                                        journalVoucher={journalVoucher}
                                    />
                                </div>
                            )
                        })}
                    </Accordion>
                ) : (
                    <p className="text-center text-xs text-muted-foreground/60 p-4">
                        No {mode} requests.
                    </p>
                )}
            </KanbanItemsContainer>
        </KanbanContainer>
    )
}

type TJournalVoucherKanbanItem = {
    name: string
    value: TJournalVoucherMode
    icon: React.ReactNode
}

type TJournalVoucherKanbanState = Record<TJournalVoucherMode, boolean>

const JournalVoucherKanban = ({ className }: { className?: string }) => {
    const JournalVoucherMenu: TJournalVoucherKanbanItem[] = useMemo(
        () => [
            {
                name: 'Draft',
                value: 'draft',
                icon: <DraftIcon className="mr-2 size-4 text-primary" />,
            },
            {
                name: 'Printed',
                value: 'printed',
                icon: <PrinterIcon className="mr-2 size-4 text-blue-500" />,
            },
            {
                name: 'Approved',
                value: 'approved',
                icon: (
                    <CheckCircle2Icon className="mr-2 size-4 text-success-foreground" />
                ),
            },
            {
                name: 'Released',
                value: 'released',
                icon: (
                    <BadgeCheckFillIcon className="mr-2 size-4 text-purple-500" />
                ),
            },
        ],
        []
    )

    const initialKanbanState: TJournalVoucherKanbanState = useMemo(() => {
        return JournalVoucherMenu.reduce((acc, item) => {
            acc[item.value] = true
            return acc
        }, {} as TJournalVoucherKanbanState)
    }, [JournalVoucherMenu])

    const [expandedState, setExpandedState] =
        useState<TJournalVoucherKanbanState>(initialKanbanState)

    const handleSetItemExpanded = (name: TJournalVoucherMode) => {
        setExpandedState((prev) => ({
            ...prev,
            [name]: !prev[name],
        }))
    }

    return (
        <div
            className={cn(
                'w-full flex space-x-5 p-2 ecoop-scroll overflow-auto',
                className
            )}
        >
            {JournalVoucherMenu.map((item) => (
                <JournalVoucherKanbanMain
                    expandedState={expandedState}
                    handleExpand={handleSetItemExpanded}
                    icon={item.icon}
                    isExpanded={expandedState[item.value]}
                    key={item.value}
                    // handleIndividualExpand={handleIndividualExpand}
                    mode={item.value}
                />
            ))}
        </div>
    )
}

export default JournalVoucherKanban
