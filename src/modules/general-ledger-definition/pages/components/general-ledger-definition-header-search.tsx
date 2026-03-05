import { toast } from 'sonner'

import {
    AccountCreateUpdateFormModal,
    AccountPicker,
    IAccount,
} from '@/modules/account'
import ViewAccountTransactionLedger from '@/modules/account/components/account-transaction-ledger'
import { useHotkeys } from 'react-hotkeys-hook'

import { MagnifyingGlassIcon, PlusIcon } from '@/components/icons'
import Modal from '@/components/modals/modal'
import GenericSearchInput from '@/components/search/generic-search-input'
import { Button } from '@/components/ui/button'

import { useGeneralLedgerDefinition } from '../ context/general-ledger-context-provider'
import { GeneralLedgerDefinitionCreateUpdateFormModal } from '../../components'

const GeneralLedgerDefinitionHeaderSearch = () => {
    const { modals, queries, states, actions } = useGeneralLedgerDefinition()

    const handleAccountSelection = async (account: IAccount) => {
        if (account && states.selectedGL?.data?.id) {
            await queries.addAccountToGLQuery.mutateAsync({
                id: states.selectedGL.data?.id,
                accountId: account.id,
            })
        } else {
            toast.error('Please select a General Ledger Definition first.')
        }
    }

    useHotkeys(
        'Enter',
        (e) => {
            e.preventDefault()
            actions.handleSearch()
        },
        { enableOnFormTags: true },
        [actions.handleSearch]
    )

    return (
        <div>
            {states.selectedAccount?.data && (
                <Modal
                    {...modals.accountLedger}
                    className="max-w-6xl! w-full"
                    description={`You are viewing account (${states.selectedAccount?.data?.name}) accounting transaction`}
                    title="Accounting Transaction"
                >
                    <ViewAccountTransactionLedger
                        accountId={states.selectedAccount?.data?.id}
                    />
                </Modal>
            )}
            <AccountCreateUpdateFormModal
                {...modals.accountDetails}
                description="this account is part of the General Ledger Definition"
                formProps={{
                    defaultValues: states.selectedAccount?.data ?? {},
                    readOnly: states.selectedAccount?.mode === 'view',
                    accountId: states.selectedAccount?.data?.id,
                    onSuccess: () => {
                        modals.accountDetails.onOpenChange(false)
                    },
                }}
                title="Account Details"
            />
            <GeneralLedgerDefinitionCreateUpdateFormModal
                {...modals.glForm}
                formProps={{
                    defaultValues: states.selectedGL?.data ?? {},
                    readOnly: states.selectedGL?.mode === 'view',
                    generalLedgerDefinitionId: states.selectedGL?.data?.id,
                    generalLedgerDefinitionEntryId:
                        states.selectedEntry ?? undefined,
                }}
            />
            <AccountPicker
                modalOnly
                modalState={{
                    ...modals.accountPicker,
                }}
                mode="all"
                onSelect={(account) => {
                    handleAccountSelection(account)
                }}
            />

            <div className="flex gap-2 pb-4">
                <Button
                    className="rounded-xl"
                    disabled={queries.addAccountToGLQuery.isPending}
                    onClick={() => {
                        modals.glForm.onOpenChange(true)
                    }}
                    size="sm"
                >
                    <PlusIcon className="mr-2" size={15} />
                    Add GL
                </Button>
                <GenericSearchInput
                    placeholder="search GL and Account"
                    setSearchTerm={states.setSearchTerm}
                />
                <Button
                    className="flex items-center rounded-2xl space-x-2"
                    // disabled={!isSearchOnChanged || isReadOnly || isPending}
                    onClick={actions.handleSearch}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            actions.handleSearch()
                        }
                    }}
                    variant={'secondary'}
                >
                    <MagnifyingGlassIcon className="mr-2" />
                    Search
                </Button>
            </div>
        </div>
    )
}

export default GeneralLedgerDefinitionHeaderSearch
