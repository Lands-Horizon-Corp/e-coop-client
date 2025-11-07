import { ReactNode } from 'react'

import { toast } from 'sonner'

import { cn } from '@/helpers'
import { dateAgo, toReadableDate } from '@/helpers/date-utils'
import { IAccount } from '@/modules/account/account.types'
import { AccountViewerModal } from '@/modules/account/components/account-viewer/account-viewer'
import useConfirmModalStore from '@/store/confirm-modal-store'

import RefreshButton from '@/components/buttons/refresh-button'
import {
    CalendarIcon,
    HistoryIcon,
    RenderIcon,
    RestoreIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'

import { useModalState } from '@/hooks/use-modal-state'

import { TEntityId } from '@/types'

import {
    useAccountHistoryRestore,
    useGetAccountHistoryByAccountId,
} from '../account-history.service'
import { IAccountHistory, THistoryChangeType } from '../account-history.types'

const getChangeTypeConfig = (changeType: THistoryChangeType) => {
    switch (changeType) {
        case 'created':
            return {
                color: 'bg-emerald-100 dark:bg-emerald-950 border-emerald-300 text-emerald-700 dark:text-emerald-300',
                badgeColor:
                    'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
                label: 'Created',
            }
        case 'updated':
            return {
                color: 'bg-blue-100 dark:bg-blue-950 border-blue-300 text-blue-700 dark:text-blue-300',
                badgeColor:
                    'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
                label: 'Updated',
            }
        case 'deleted':
            return {
                color: 'bg-red-100 dark:bg-red-950 border-red-300 text-red-700 dark:text-red-300',
                badgeColor:
                    'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800',
                label: 'Deleted',
            }
        default:
            return {
                color: 'bg-gray-100 dark:bg-gray-950 border-gray-300 text-gray-700 dark:text-gray-300',
                badgeColor:
                    'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800',
                label: 'Unknown',
            }
    }
}

type AccountHistoryCardProps = {
    history: IAccountHistory
    index: number
    isLast: boolean
    onRestore?: (account: IAccount) => void
}

const AccountHistoryCard = ({
    history,
    index,
    isLast,
    onRestore,
}: AccountHistoryCardProps) => {
    const config = getChangeTypeConfig(history.change_type)
    const viewModalState = useModalState()
    const { onOpen } = useConfirmModalStore()

    const getChangeDescription = () => {
        if (history.change_type === 'created') {
            return 'Account configuration created'
        }
        if (history.change_type === 'deleted') {
            return 'Account configuration removed'
        }
        return 'Configuration updated'
    }

    const restoreMutation = useAccountHistoryRestore({
        options: {
            onSuccess: onRestore,
        },
    })

    const historyIcon = history?.icon

    return (
        <Card className="group relative hover:shadow-md transition-all p-0 duration-200">
            <AccountViewerModal
                {...viewModalState}
                accountViewerProps={{
                    isHistoryAccount: true,
                    accountId: history.id,
                }}
            />
            <CardHeader className="px-4 py-0 space-y-0">
                <div
                    className="flex flex-col gap-2 max-w-full "
                    onClick={() => {
                        viewModalState.onOpenChange(true)
                    }}
                >
                    <div className="inline-flex pt-2 space-x-2 ">
                        <div className="flex pt-4 items-center flex-col">
                            <div
                                className={cn(
                                    'relative flex-shrink-0 size-10 rounded-full flex items-center justify-center border-2 shadow-sm',
                                    config.color
                                )}
                            >
                                {historyIcon && historyIcon !== undefined ? (
                                    <RenderIcon icon={historyIcon} />
                                ) : (
                                    <RenderIcon icon="Rocket" />
                                )}
                                {index === 0 && (
                                    <div
                                        className={cn(
                                            'absolute inset-0 rounded-full animate-ping opacity-20',
                                            config.color
                                        )}
                                    />
                                )}
                            </div>
                            {!isLast && (
                                <div className="w-px flex-1 translate-y-1 bg-gradient-to-b from-border to-transparent z-10" />
                            )}
                        </div>
                        <div className="flex flex-col py-4 font-sm max-w-62">
                            <p className="truncate w-full">
                                {getChangeDescription()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {toReadableDate(history.created_at)} -{' '}
                                {dateAgo(history.created_at)}
                            </p>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                    <div className="flex-2 flex gap-1">
                                        <span>
                                            {
                                                getChangeTypeConfig(
                                                    history.change_type
                                                ).label
                                            }{' '}
                                            by
                                        </span>
                                        <span>
                                            {history.created_by?.full_name ||
                                                ' Unknown User'}
                                        </span>
                                    </div>
                                    <ImageDisplay
                                        className=""
                                        src={
                                            history.created_by?.media
                                                ?.download_url
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Button
                    className="absolute top-2 right-2 size-fit p-1"
                    disabled={restoreMutation.isPending}
                    onClick={() => {
                        onOpen({
                            title: 'Restore Account Configuration',
                            description:
                                'Are you sure you want to restore this account configuration? This action cannot be undone.',
                            onConfirm: () => {
                                toast.promise(
                                    restoreMutation.mutateAsync({
                                        accountHistoryId: history.id,
                                    }),
                                    {
                                        loading:
                                            'Restoring account configuration...',
                                        success:
                                            'Account configuration restored successfully',
                                        error: 'Failed to restore account configuration',
                                    }
                                )
                            },
                        })
                    }}
                    size="icon"
                    variant="ghost"
                >
                    <RestoreIcon />
                </Button>
            </CardHeader>
        </Card>
    )
}

const AccountHistorySheet = ({
    accountId,
    children,
    onRestore,
}: {
    accountId: TEntityId
    children?: ReactNode
    onRestore?: (account: IAccount) => void
}) => {
    const {
        data: accountHistory,
        refetch,
        isLoading,
        error,
    } = useGetAccountHistoryByAccountId({ accountId })

    return (
        <Sheet onOpenChange={() => refetch()}>
            <SheetTrigger asChild>
                {children ? (
                    children
                ) : (
                    <Button
                        className="!p-0.9  py-1 h-fit"
                        size={'sm'}
                        variant={'secondary'}
                    >
                        History
                        <HistoryIcon />
                    </Button>
                )}
            </SheetTrigger>
            <SheetContent className="w-[500px] px-2 sm:w-[700px]">
                <SheetHeader className="space-y-3">
                    <SheetTitle className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5" />
                        Account Configuration History
                        <RefreshButton
                            className="bg-transparent"
                            isLoading={isLoading}
                            onClick={() => refetch()}
                        />
                    </SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-200px)]">
                    {isLoading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Card key={i}>
                                    <CardHeader>
                                        <div className="flex items-center space-x-4">
                                            <Skeleton className="h-10 w-10 rounded-full" />
                                            <div className="space-y-2 flex-1">
                                                <Skeleton className="h-4 w-full" />
                                                <Skeleton className="h-3 w-2/3" />
                                            </div>
                                            <Skeleton className="h-8 w-8" />
                                        </div>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center py-8 text-muted-foreground">
                            <p className="text-sm">
                                Failed to load account history
                            </p>
                        </div>
                    ) : !accountHistory?.length ? (
                        <div className="flex items-center justify-center py-8 text-muted-foreground">
                            <div className="text-center space-y-2">
                                <CalendarIcon className="h-8 w-8 mx-auto opacity-50" />
                                <p className="text-sm">
                                    No configuration history found
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {accountHistory.map((history, index) => (
                                <AccountHistoryCard
                                    history={history}
                                    index={index}
                                    isLast={index === accountHistory.length - 1}
                                    key={history.id}
                                    onRestore={onRestore}
                                />
                            ))}
                        </div>
                    )}
                </ScrollArea>
                {accountHistory && accountHistory.length > 0 && (
                    <>
                        <div className="grid grid-cols-2 gap-4 text-center text-sm">
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">
                                    Total Changes
                                </p>
                                <p className="font-semibold">
                                    {accountHistory.length}
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    )
}

export default AccountHistorySheet
