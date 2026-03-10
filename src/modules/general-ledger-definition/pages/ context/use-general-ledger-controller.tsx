import { useState } from 'react'

import { toast } from 'sonner'

import { IAccount, useDeleteAccountFromGLFS } from '@/modules/account'
import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import {
    IGeneralLedgerDefinition,
    useConnectAccount,
    useDeleteById,
    useGetAll,
} from '@/modules/general-ledger-definition'

import { useEntityModal } from '@/hooks/use-entity-modal-state'
import { useModalState } from '@/hooks/use-modal-state'

import { TEntityId } from '@/types'

import { findNodePathWithAccounts } from '../components/gl-utils'
import { useGLFSStore } from '../store/gl-fs-store'

export const useGeneralLedgerController = () => {
    const {
        currentAuth: { user_organization },
    } = useAuthUserWithOrgBranch()

    const generalLedgerDefinitionQuery = useGetAll()

    const [searchTerm, setSearchTerm] = useState('')
    const [selectedEntry, setSelectedEntry] = useState<TEntityId | null>(null)

    const states = {
        searchTerm,
        setSearchTerm,
        selectedEntry,
        setSelectedEntry,
    }

    const { resetExpansion, expandPath, setTargetNodeId } = useGLFSStore()
    const glfsStore = useGLFSStore()

    const modals = {
        glForm: useEntityModal<{
            gl_definition?: IGeneralLedgerDefinition
        }>(),
        accountDetails: useEntityModal<{
            account?: IAccount
            index?: number
            type?: 'positive' | 'negative'
        }>(),
        accountPicker: useModalState(),
        accountLedger: useEntityModal<IAccount>(),
    }

    const selectors = {
        glDefinition: modals.glForm.data?.gl_definition ?? null,
        glId: modals.glForm.data?.gl_definition?.id ?? null,

        account: modals.accountDetails.data?.account ?? null,
        accountId: modals.accountDetails.data?.account?.id ?? null,
    }

    const addAccountToGLQuery = useConnectAccount({
        options: {
            onSuccess: () => {
                generalLedgerDefinitionQuery.refetch()
                modals.accountPicker.onOpenChange?.(false)
                toast.success('Account connected to GL.')
            },
        },
    })

    const deleteGLQuery = useDeleteById({
        options: {
            onSuccess: () => {
                generalLedgerDefinitionQuery.refetch()
                modals.accountDetails.close()
            },
        },
    })

    const removeAccountFromGLQuery = useDeleteAccountFromGLFS({
        options: {
            onSuccess: (account) => {
                generalLedgerDefinitionQuery.refetch()
                toast.success(`${account.name} removed.`)
            },
        },
    })

    const actions = {
        async handleAccountSelect(account: IAccount) {
            if (!selectors.glId) {
                toast.error('Select GL first.')
                return
            }

            await addAccountToGLQuery.mutateAsync({
                id: selectors.glId,
                accountId: account.id,
            })
        },

        handleDeleteGL(id: TEntityId) {
            deleteGLQuery.mutate(id)
        },

        handleRemoveAccount(accountId: TEntityId) {
            removeAccountFromGLQuery.mutate({
                id: accountId,
                mode: 'general-ledger',
            })
        },

        handleSearch() {
            if (!states.searchTerm.trim()) {
                resetExpansion()
                return
            }

            const path = findNodePathWithAccounts(
                glfsStore.generalLedgerDefinitions,
                [],
                states.searchTerm
            )

            if (path) {
                expandPath(path)
                setTargetNodeId(path[path.length - 1])
            } else {
                toast.error('Item not found!')
                resetExpansion()
            }
        },
    }
    return {
        userOrganization: user_organization,

        states,
        modals,
        selectors,
        actions,

        queries: {
            generalLedgerDefinitionQuery,
            addAccountToGLQuery,
            deleteGLQuery,
            removeAccountFromGLQuery,
        },

        ...useGLFSStore(),
    }
}

export type TGeneralLedgerController = ReturnType<
    typeof useGeneralLedgerController
>
