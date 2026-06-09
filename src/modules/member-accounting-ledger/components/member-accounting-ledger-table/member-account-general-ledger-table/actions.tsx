import { cn } from '@/helpers/tw-utils'
import { IMemberAccountingLedger } from '@/modules/member-account-ledger'
import { useTransactionStore } from '@/store/transaction/transaction-store'
import { EyeIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface IMemberAccountGeneralLedgerActionProps {
    memberAccountLedger: IMemberAccountingLedger
    onOpen?: () => void
}

const MemberAccountGeneralLedgerAction = ({
    memberAccountLedger,
    ...props
}: IMemberAccountGeneralLedgerActionProps) => {
    const { setFocusedLedger } = useTransactionStore()

    return (
        <Button
            className={cn(
                'hover:bg-transparent! cursor-pointer hover:scale-105 ease-in-out',
                ''
            )}
            hoverVariant={'nostyle'}
            variant={'ghost'}
            size={'xs'}
            onClick={(e) => {
                e.stopPropagation()
                props?.onOpen?.()
                setFocusedLedger({
                    memberProfileId: memberAccountLedger?.member_profile_id,
                    account: memberAccountLedger?.account,
                    accountId: memberAccountLedger?.account_id,
                    memberAccountingLedgerId: memberAccountLedger?.id,
                })
            }}
        >
            <EyeIcon size={18} />
            {/* <RowActionsGroup
                onView={{
                    text: 'View General Ledger',
                    isAllowed: true,
                    onClick: () => {
                        props?.onOpen?.()
                        setFocusedLedger({
                            memberProfileId:
                                memberAccountLedger?.member_profile_id,
                            account: memberAccountLedger?.account,
                            accountId: memberAccountLedger?.account_id,
                            memberAccountingLedgerId: memberAccountLedger?.id,
                        })
                    },
                }}
                canSelect={false}
            /> */}
        </Button>
    )
}

export default MemberAccountGeneralLedgerAction
