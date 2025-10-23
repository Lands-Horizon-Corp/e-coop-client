import { cn } from '@/helpers'
import { IAccount } from '@/modules/account'
import AccountMiniCard from '@/modules/account/components/account-mini-card'
import { currencyFormat } from '@/modules/currency'
import GeneralLedgerTable from '@/modules/general-ledger/components/tables/general-ledger-table'
import { useMemberAccountGeneralLedgerTotal } from '@/modules/member-accounting-ledger/member-accounting-ledger.service'

import { RefreshIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'

import { IBaseProps, TEntityId } from '@/types'

export const MemberAccountLedgerTotal = ({
    className,
    memberProfileId,
    accountId,
    account,
}: {
    memberProfileId: TEntityId
    accountId: TEntityId
    account?: IAccount
} & IBaseProps) => {
    const { data, isPending, refetch } = useMemberAccountGeneralLedgerTotal({
        memberProfileId,
        accountId,
        options: {
            retry: 0,
        },
    })

    const currency = account?.currency

    return (
        <div
            className={cn(
                'flex justify-start bg-gradient-to-tr from-card/20 to-primary/10  rounded-2xl relative px-3 py-1 border gap-x-8',
                className
            )}
        >
            <Button
                className="absolute rounded-full size-fit top-2 right-2"
                disabled={isPending}
                onClick={() => refetch()}
                size="icon"
                variant="secondary"
            >
                {isPending ? (
                    <LoadingSpinner className="size-3" />
                ) : (
                    <RefreshIcon className="size-3" />
                )}
            </Button>
            <div className="p-2 space-y-1">
                <p className="text-primary text-xl font-bold">
                    {data
                        ? currencyFormat(data.total_credit, {
                              currency,
                              showSymbol: !!currency,
                          })
                        : '-'}
                </p>

                <p className="text-xs text-muted-foreground shrink truncate">
                    Total Credit
                </p>
            </div>

            <div className="p-2 space-y-1">
                <p className="text-primary text-xl font-bold">
                    {data
                        ? currencyFormat(data.total_debit, {
                              currency,
                              showSymbol: !!currency,
                          })
                        : '-'}
                </p>

                <p className="text-xs text-muted-foreground truncate shrink">
                    Total Debit
                </p>
            </div>

            <div className="p-2 space-y-1">
                <p className="text-primary text-xl font-bold">
                    {data
                        ? currencyFormat(data.balance, {
                              currency,
                              showSymbol: !!currency,
                          })
                        : '-'}
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
                accountId={other.accountId}
                className={cn('bg-background p-2 rounded-xl', className)}
                excludeColumnIds={['account']}
                memberProfileId={other.memberProfileId}
                mode="member-account"
            />
        </div>
    )
}

export default MemberAccountGeneralLedger
