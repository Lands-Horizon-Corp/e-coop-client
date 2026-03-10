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

import { useGeneralLedgerDefinitionContext } from '../ context/general-ledger-context-provider'
import { GeneralLedgerDefinitionCreateUpdateFormModal } from '../../components'

const GeneralLedgerDefinitionHeaderSearch = () => {
    const {
        selectors: { glDefinition, glId, account },
        modals: { accountDetails, glForm, accountPicker, accountLedger },
        queries,
        states,
        actions,
    } = useGeneralLedgerDefinitionContext()

    const handleAccountSelection = async (account: IAccount) => {
        if (account && glDefinition?.id) {
            await queries.addAccountToGLQuery.mutateAsync({
                id: glDefinition?.id,
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
            {account && (
                <Modal
                    {...accountLedger}
                    className="max-w-6xl! w-full"
                    description={`You are viewing account (${account?.name}) accounting transaction`}
                    title="Accounting Transaction"
                >
                    <ViewAccountTransactionLedger accountId={account?.id} />
                </Modal>
            )}
            <AccountCreateUpdateFormModal
                {...accountDetails}
                description="this account is part of the General Ledger Definition"
                formProps={{
                    defaultValues: account ?? {
                        index: accountDetails.data?.index,
                    },
                    readOnly: accountDetails?.mode === 'view',
                    accountId: account?.id,
                    onSuccess: () => {
                        accountDetails.close()
                    },
                }}
                title="Account Details"
            />
            <GeneralLedgerDefinitionCreateUpdateFormModal
                {...glForm}
                formProps={{
                    defaultValues: glDefinition ?? {
                        index: 0,
                    },
                    readOnly: glForm.mode === 'view',
                    generalLedgerDefinitionId: glId ?? undefined,
                    generalLedgerDefinitionEntryId:
                        states.selectedEntry ?? undefined,
                }}
            />
            <AccountPicker
                modalOnly
                modalState={{
                    ...accountPicker,
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
                        glForm.create()
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
