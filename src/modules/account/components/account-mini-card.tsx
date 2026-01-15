import { cn } from '@/helpers'
import { CurrencyBadge } from '@/modules/currency/components/currency-badge'

import {
    HashIcon,
    RefreshIcon,
    RenderIcon,
    TIcon,
    TextFileFillIcon,
} from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

import { IClassProps, TEntityId } from '@/types'

import { useGetAccountById } from '../account.service'
import { IAccount } from '../account.types'

interface Props extends IClassProps {
    accountId: TEntityId
    defaultAccount?: IAccount
}

const AccountMiniCard = ({ accountId, defaultAccount, className }: Props) => {
    const { data, isPending, refetch } = useGetAccountById({
        id: accountId,
        options: {
            initialData: defaultAccount,
        },
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
                        <div className="space-y-1">
                            <h3
                                className="font-semibold text-primary text-lg leading-tight truncate"
                                title={data?.name ?? '...'}
                            >
                                {data?.icon && (
                                    <RenderIcon
                                        className="inline mr-1"
                                        icon={data.icon as TIcon}
                                    />
                                )}
                                {data?.name ?? '...'}
                            </h3>
                            {data?.currency && (
                                <CurrencyBadge
                                    currency={data?.currency}
                                    size="sm"
                                />
                            )}
                        </div>
                        {data?.loan_account && (
                            <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                                <HashIcon className="h-3 w-3" />
                                <span>{data?.loan_account.name ?? '-'}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col items-end gap-1 ml-2">
                        <Badge variant="outline">
                            {data?.type ?? 'unknown'}
                        </Badge>
                        {data?.is_internal && (
                            <Badge className="text-xs" variant="secondary">
                                Internal
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>
            <Button
                className="size-fit p-1 absolute top-1 right-1 rounded-full"
                disabled={isPending}
                onClick={() => refetch()}
                variant="ghost"
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
                        <TextFileFillIcon className="size-4 text-muted-foreground/80 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground/90 leading-relaxed">
                            {data?.description}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default AccountMiniCard
