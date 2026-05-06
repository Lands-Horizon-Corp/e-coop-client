import { useQueryClient } from '@tanstack/react-query'

import { useAuthStore } from '@/modules/authentication/authgentication.store'
import GeneralLedgerTable from '@/modules/general-ledger/components/tables/general-ledger-table'

import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'
import Modal from '@/components/modals/modal'

import { IAccount } from '../account.types'
import { AccountCreateUpdateFormModal } from '../components'
import {
    AccountActionExtra,
    AccountActionType,
} from '../components/account-actions'
import AccountConsolidationModal from '../components/account-actions/account-consolidation-modal'
import ViewAccountTransactionLedger from '../components/account-actions/account-transaction-ledger'
import { AccountViewerModal } from '../components/account-viewer/account-viewer'
import { getModalTitle } from '../components/tables/row-actions'

export const AccountTableActionManager = () => {
    const queryClient = useQueryClient()

    const { state, close } = useTableRowActionStore<
        IAccount,
        AccountActionType,
        AccountActionExtra
    >()

    const {
        currentAuth: { user_organization },
    } = useAuthStore()

    const isCreate = state.action === 'create'

    return (
        <>
            {state.action && ['create', 'edit'].includes(state.action) && (
                <AccountCreateUpdateFormModal
                    description={`${isCreate ? 'Create' : 'Modify/Update'} account...`}
                    formProps={{
                        accountId: isCreate ? undefined : state.id,
                        defaultValues: {
                            ...state.defaultValues,
                            index: isCreate
                                ? state.extra?.index
                                : state.defaultValues?.index,
                        },
                        onSuccess: () => {
                            queryClient.invalidateQueries({
                                queryKey: ['account', 'all', 'all'],
                            })
                        },
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                    title={`${isCreate ? 'Create' : 'Update'} Account`}
                />
            )}
            {state.action === 'view' && state.id && (
                <AccountViewerModal
                    accountViewerProps={{
                        accountId: state.id,
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}
            {state.action === 'view-ledger' && state.defaultValues && (
                <Modal
                    className="max-w-[95vw]!"
                    description={`You are viewing account (${state.defaultValues.name}) ${getModalTitle(state.extra?.entryType).toLowerCase()}`}
                    onOpenChange={close}
                    open={state.isOpen}
                    title={getModalTitle(state.extra?.entryType)}
                >
                    <GeneralLedgerTable
                        accountId={state.defaultValues.id}
                        className="min-h-[90vh] max-w-[90vw]! min-w-0 max-h-[90vh]"
                        entryType={state.extra?.entryType || ''}
                        mode="account"
                    />
                </Modal>
            )}
            {state.action === 'view-accounting-ledger-transaction' &&
                state.defaultValues && (
                    <Modal
                        className="max-w-6xl! w-full"
                        description={`You are viewing account (${state.defaultValues.name}) accounting transaction`}
                        onOpenChange={close}
                        open={state.isOpen}
                        title="Accounting Transaction"
                    >
                        <ViewAccountTransactionLedger
                            accountId={state.defaultValues.id}
                        />
                    </Modal>
                )}
            {state.action === 'view-account-consolidations' &&
                state.id &&
                user_organization?.id &&
                state.defaultValues && (
                    <AccountConsolidationModal
                        accountId={state.id}
                        accountName={state.defaultValues?.name}
                        onOpenChange={close}
                        open={state.isOpen}
                        organizationId={user_organization.organization_id}
                    />
                )}
        </>
    )
}
