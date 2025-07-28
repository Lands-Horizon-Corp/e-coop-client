import { useState } from 'react'

import { cn } from '@/lib'
import { IAccount } from '@/types/coop-types/accounts/account'
import { formatNumber } from '@/utils'

import { RefreshIcon } from '@/components/icons'
import Modal from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import MemberAccountingLedgerTable from '@/components/tables/ledgers-tables/member-accounting-ledger-table'
import { Button } from '@/components/ui/button'

import { useMemberAccountingLedgerTotal } from '@/hooks/api-hooks/member/use-member-accounting-ledger'

import { IBaseProps, TEntityId } from '@/types'

import MemberAccountGeneralLedger from './member-account-general-ledger'

interface Props extends IBaseProps {
    memberProfileId: TEntityId
}

interface MemberAccountingLedgerTotalProps extends IBaseProps {
    memberProfileId: TEntityId
}

export const MemberAccountingLedgerTotal = ({
    className,
    memberProfileId,
}: MemberAccountingLedgerTotalProps) => {
    const { data, isPending, refetch } = useMemberAccountingLedgerTotal({
        memberProfileId,
    })

    return (
        <div
            className={cn(
                'flex justify-end bg-gradient-to-tr from-card/20 to-primary/10 rounded-2xl relative px-4 py-1 border gap-x-8',
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
                    {formatNumber(
                        data.total_share_capital_plus_fixed_savings,
                        2
                    )}
                </p>

                <p className="text-xs text-muted-foreground shrink truncate">
                    Total Share Capital + Fixed Savings
                </p>
            </div>

            <div className="p-2 space-y-1">
                <p className="text-primary text-xl font-bold">
                    {formatNumber(data.total_deposits, 2)}
                </p>

                <p className="text-xs text-muted-foreground truncate shrink">
                    Total Deposits
                </p>
            </div>

            <div className="p-2 space-y-1">
                <p className="text-primary text-xl font-bold">
                    {formatNumber(data.total_loans, 2)}
                </p>

                <p className="text-xs text-muted-foreground shrink truncate">
                    Total Loans
                </p>
            </div>
        </div>
    )
}

const MemberAccountingLedger = ({ memberProfileId, className }: Props) => {
    const [focused, setFocused] = useState<
        | {
              memberProfileId: TEntityId
              accountId: TEntityId
              account?: IAccount
          }
        | undefined
    >()

    return (
        <div className={cn('flex flex-col gap-y-4 h-[80vh]', className)}>
            {focused !== undefined && (
                <Modal
                    open={focused !== undefined}
                    onOpenChange={(state) => {
                        if (!state) setFocused(undefined)
                    }}
                    titleClassName="hidden"
                    descriptionClassName="hidden"
                    closeButtonClassName="md:hidden"
                    className={cn('!max-w-[90vw] p-2')}
                >
                    <MemberAccountGeneralLedger {...focused} />
                </Modal>
            )}
            <MemberAccountingLedgerTable
                memberProfileId={memberProfileId}
                onRowClick={(data) =>
                    setFocused({
                        accountId: data.original.account_id,
                        memberProfileId: data.original.member_profile_id,
                        account: data.original.account,
                    })
                }
                className="w-full"
            />
            <MemberAccountingLedgerTotal
                className="w-fit self-end"
                memberProfileId={memberProfileId}
            />
        </div>
    )
}

export default MemberAccountingLedger
