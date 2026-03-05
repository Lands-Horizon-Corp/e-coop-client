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

import { useModalState } from '@/hooks/use-modal-state'

import { TEntityId } from '@/types'

import { findNodePathWithAccounts } from '../components/gl-utils'
import { useGLFSStore } from '../store/gl-fs-store'

export const useGeneralLedgerController = () => {
    const {
        currentAuth: { user_organization },
    } = useAuthUserWithOrgBranch()

    const generalLedgerDefinitionQuery = useGetAll()
    const [selectedGL, setSelectedGL] = useState<{
        mode: 'view' | 'edit' | 'create'
        data: IGeneralLedgerDefinition | null
    }>()

    const [selectedAccount, setSelectedAccount] = useState<{
        mode: 'view' | 'edit' | 'create'
        data: IAccount | null
    }>()

    const [searchTerm, setSearchTerm] = useState('')
    const [selectedEntry, setSelectedEntry] = useState<TEntityId | null>(null)

    const states = {
        selectedGL,
        setSelectedGL,
        selectedAccount,
        setSelectedAccount,
        searchTerm,
        setSearchTerm,
        selectedEntry,
        setSelectedEntry,
    }

    const { resetExpansion, expandPath, setTargetNodeId } = useGLFSStore()

    const glfsStore = useGLFSStore()

    const modals = {
        glForm: useModalState(),
        accountDetails: useModalState(),
        accountPicker: useModalState(),
        accountLedger: useModalState(),
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
                setSelectedGL(undefined)
                modals.accountDetails.onOpenChange?.(false)
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

    const handleAccountSelect = async (account: IAccount) => {
        if (!selectedGL?.data?.id) {
            toast.error('Select GL first.')
            return
        }

        await addAccountToGLQuery.mutateAsync({
            id: selectedGL.data?.id,
            accountId: account.id,
        })
    }

    const handleDeleteGL = (id: TEntityId) => {
        deleteGLQuery.mutate(id)
    }

    const handleRemoveAccount = (accountId: TEntityId) => {
        removeAccountFromGLQuery.mutate({
            id: accountId,
            mode: 'general-ledger',
        })
    }

    const handleSearch = () => {
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
    }

    return {
        userOrganization: user_organization,
        states,
        modals,
        actions: {
            handleAccountSelect,
            handleDeleteGL,
            handleRemoveAccount,
            handleSearch,
        },
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
