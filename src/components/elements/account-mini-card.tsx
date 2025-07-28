import { cn } from '@/lib'
import { IAccount } from '@/types/coop-types/accounts/account'

import { useAccount } from '@/hooks/api-hooks/use-account'

import { IClassProps, TEntityId } from '@/types'

import { HashIcon, RefreshIcon, TextFileFillIcon } from '../icons'
import LoadingSpinner from '../spinners/loading-spinner'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader } from '../ui/card'

interface Props extends IClassProps {
    accountId: TEntityId
    defaultAccount?: IAccount
}

const AccountMiniCard = ({ accountId, defaultAccount, className }: Props) => {
    const { data, isPending, refetch } = useAccount({
        id: accountId,
        initialData: defaultAccount,
    })

    return (
        <Card
            className={cn(
                'w-full hover:shadow-md relative rounded-xl transition-shadow',
                className
            )}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <h3
                            className="font-semibold text-primary text-lg leading-tight truncate"
                            title={data?.name ?? '...'}
                        >
                            {data?.name ?? '...'}
                        </h3>
                        {data?.alternative_code && (
                            <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                                <HashIcon className="h-3 w-3" />
                                <span>{data?.alternative_code ?? '-'}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col items-end gap-1 ml-2">
                        <Badge variant="outline">
                            {data?.type ?? 'unknown'}
                        </Badge>
                        {data?.is_internal && (
                            <Badge variant="secondary" className="text-xs">
                                Internal
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>
            <Button
                disabled={isPending}
                variant="ghost"
                className="size-fit p-1 absolute top-1 right-1 rounded-full"
                onClick={() => refetch()}
            >
                {isPending ? (
                    <LoadingSpinner className="size-3" />
                ) : (
                    <RefreshIcon className="size-3" />
                )}
            </Button>
            <CardContent className="pt-0">
                <div className="space-y-3">
                    <div className="flex items-start gap-2">
                        <TextFileFillIcon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {data?.description}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default AccountMiniCard
