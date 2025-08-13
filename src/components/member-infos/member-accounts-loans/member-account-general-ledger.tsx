import { cn } from '@/lib'
import { IAccount } from '@/types/coop-types/accounts/account'
import { formatNumber } from '@/utils'

import AccountMiniCard from '@/components/elements/account-mini-card'
import { RefreshIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import GeneralLedgerTable from '@/components/tables/ledgers-tables/general-ledger-table'
import { Button } from '@/components/ui/button'

import { useMemberAccountGeneralLedgerTotal } from '@/hooks/api-hooks/use-general-ledger'

import { IBaseProps, TEntityId } from '@/types'

export const MemberAccountLedgerTotal = ({
    className,
    memberProfileId,
    accountId,
}: {
    memberProfileId: TEntityId
    accountId: TEntityId
} & IBaseProps) => {
    const { data, isPending, refetch } = useMemberAccountGeneralLedgerTotal({
        memberProfileId,
        accountId,
    })

    return (
        <div
            className={cn(
                'flex justify-start bg-gradient-to-tr from-card/20 to-primary/10  rounded-2xl relative px-3 py-1 border gap-x-8',
                className
            )}
        >
            <Button
                size="icon"
                variant="secondary"
                disabled={isPending}
                onClick={() => refetch()}
                className="absolute rounded-full size-fit top-2 right-2"
            >
                {isPending ? (
                    <LoadingSpinner className="size-3" />
                ) : (
                    <RefreshIcon className="size-3" />
                )}
            </Button>
            <div className="p-2 space-y-1">
                <p className="text-primary text-xl font-bold">
                    {formatNumber(data.total_credit, 2)}
                </p>

                <p className="text-xs text-muted-foreground shrink truncate">
                    Total Credit
                </p>
            </div>

            <div className="p-2 space-y-1">
                <p className="text-primary text-xl font-bold">
                    {formatNumber(data.total_debit, 2)}
                </p>

                <p className="text-xs text-muted-foreground truncate shrink">
                    Total Debit
                </p>
            </div>

            <div className="p-2 space-y-1">
                <p className="text-primary text-xl font-bold">
                    {formatNumber(data.balance, 2)}
                </p>

                <p className="text-xs text-muted-foreground shrink truncate">
                    Balance
                </p>
            </div>
        </div>
    )
}

interface Props extends IBaseProps {
    memberProfileId: TEntityId
    accountId: TEntityId
    defaultAccount?: IAccount
}

const MemberAccountGeneralLedger = ({
    className,
    defaultAccount,
    ...other
}: Props) => {
    return (
        <div className="space-y-4 min-h-[95vh] min-w-0 max-w-full">
            <div className="grid grid-cols-2 gap-x-2">
                <AccountMiniCard
                    accountId={other.accountId}
                    defaultAccount={defaultAccount}
                />
                <MemberAccountLedgerTotal {...other} />
            </div>
            <GeneralLedgerTable
                mode="member-account"
                accountId={other.accountId}
                memberProfileId={other.memberProfileId}
                excludeColumnIds={['account']}
                className={cn('bg-background p-2 rounded-xl', className)}
            />
        </div>
    )
}

export default MemberAccountGeneralLedger
