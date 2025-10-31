import { cn, formatDate } from '@/helpers'
import { dateAgo } from '@/helpers/date-utils'

import RefreshButton from '@/components/buttons/refresh-button'
import { CalendarIcon, HistoryIcon, RenderIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'

import { TEntityId } from '@/types'

import { useGetAccountHistoryByAccountId } from '../account-history.service'
import {
    HistoryChangeTypeEnum,
    IAccountHistory,
} from '../account-history.types'

const getChangeTypeConfig = (changeType: HistoryChangeTypeEnum) => {
    switch (changeType) {
        case HistoryChangeTypeEnum.Created:
            return {
                color: 'bg-emerald-100 dark:bg-emerald-950 border-emerald-300 text-emerald-700 dark:text-emerald-300',
                badgeColor:
                    'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
                label: 'Created',
            }
        case HistoryChangeTypeEnum.Updated:
            return {
                color: 'bg-blue-100 dark:bg-blue-950 border-blue-300 text-blue-700 dark:text-blue-300',
                badgeColor:
                    'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
                label: 'Updated',
            }
        case HistoryChangeTypeEnum.Deleted:
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
}

const AccountHistoryCard = ({
    history,
    index,
    isLast,
}: AccountHistoryCardProps) => {
    const config = getChangeTypeConfig(history.change_type)

    const getChangeDescription = () => {
        if (history.change_type === HistoryChangeTypeEnum.Created) {
            return 'Account configuration created'
        }
        if (history.change_type === HistoryChangeTypeEnum.Deleted) {
            return 'Account configuration removed'
        }
        if (history.changed_fields) {
            const fieldsCount = history.changed_fields.split(',').length
            return `${fieldsCount} field${fieldsCount > 1 ? 's' : ''} modified`
        }
        return 'Configuration updated'
    }
    const historyIcon = history?.account?.icon

    return (
        <Card className="group relative hover:shadow-md transition-all p-0 duration-200">
            {!isLast && (
                <div className="absolute left-7 bottom-0 w-px h-6 bg-gradient-to-b from-border to-transparent z-10" />
            )}

            <CardHeader className="p-2.5 pb-5">
                <span className="absolute text-muted-foreground text-xs right-3 top-1.5">
                    {dateAgo(history.valid_from)}
                </span>
                <div className="flex flex-col gap-2 py-2 max-w-full ">
                    <div className="inline-flex pt-2 space-x-2 ">
                        <div
                            className={cn(
                                'relative flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-sm',
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
                        <div className="flex flex-col font-sm max-w-62">
                            <p className="truncate w-full">
                                {getChangeDescription()}
                            </p>
                            <p className="text-xs text-muted-foreground truncate w-full">
                                {formatDate(history.valid_from)}
                            </p>
                        </div>
                    </div>
                    <div className="flex-1 absolute bottom-2 right-2  min-w-0">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <div className="flex-2 flex flex-col items-end ">
                                <span>
                                    {
                                        getChangeTypeConfig(history.change_type)
                                            .label
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
                                src={history.created_by?.media?.download_url}
                            />
                        </div>
                    </div>
                </div>
            </CardHeader>
        </Card>
    )
}

const AccountHistorySheet = ({ accountId }: { accountId: TEntityId }) => {
    const {
        data: accountHistory,
        refetch,
        isLoading,
        error,
    } = useGetAccountHistoryByAccountId({ accountId })

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    className="!p-0.9  py-1 h-fit"
                    size={'sm'}
                    variant={'secondary'}
                >
                    History
                    <HistoryIcon />
                </Button>
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
                                />
                            ))}
                        </div>
                    )}
                </ScrollArea>
                {accountHistory && accountHistory.length > 0 && (
                    <>
                        <Separator className="my-2" />
                        <div className="grid grid-cols-2 gap-4 text-center text-sm">
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">
                                    Total Changes
                                </p>
                                <p className="font-semibold">
                                    {accountHistory.length}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">
                                    Last Updated
                                </p>
                                <p className="font-semibold text-xs">
                                    {dateAgo(accountHistory[0]?.valid_from)}
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
