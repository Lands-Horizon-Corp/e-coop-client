import { cn } from '@/helpers/tw-utils'

import Modal, { IModalProps } from '@/components/modals/modal'
import GeneralLedgerAccountTable from '@/components/tables/ledgers-tables/general-ledger-accounts-table'

import { TEntityId } from '@/types'

export const GeneralLedgerAccountsModal = ({
    title = 'General Ledger Accounts',
    description = 'This is the general ledger accounts view modal',
    className,
    accountId,
    ...props
}: IModalProps & { accountId: TEntityId }) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('min-w-[70rem]', className)}
            {...props}
        >
            <GeneralLedgerAccountTable accountId={accountId} />
        </Modal>
    )
}

export default GeneralLedgerAccountsModal
