import { UdpateGeneralLedgerOrder } from '@/types'

import { IGeneralLedgerDefinition } from '../../general-ledger-definition.types'

export const findNodePathByGlIdOnly = (
    nodes: IGeneralLedgerDefinition[],
    path: string[] = [],
    glId: string
): string[] | null => {
    for (const node of nodes) {
        const newPath = [...path, node.id]

        if (node.id === glId) {
            return newPath
        }

        if (node.general_ledger_definition_entries) {
            const found = findNodePathByGlIdOnly(
                node.general_ledger_definition_entries,
                newPath,
                glId
            )
            if (found) return found
        }
    }

    return null
}

export const findNodePathWithAccounts = (
    nodes: IGeneralLedgerDefinition[],
    path: string[] = [],
    searchTerm: string
): string[] | null => {
    for (const node of nodes) {
        const newPath = [...path, node.id]

        if (
            searchTerm &&
            (node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                node.accounts?.some((account) =>
                    account.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                ))
        ) {
            return newPath
        }

        if (node.general_ledger_definition_entries) {
            const foundPath = findNodePathWithAccounts(
                node.general_ledger_definition_entries,
                newPath,
                searchTerm
            )
            if (foundPath) return foundPath
        }
    }
    return null
}

export const buildPayload = (
    items: IGeneralLedgerDefinition[]
): UdpateGeneralLedgerOrder[] => {
    return items.map((item, index) => ({
        general_ledger_definition_id: item.id,
        index,
        accounts: [
            ...(item.accounts?.map((account, accountIndex) => ({
                account_id: account.id,
                index: accountIndex,
            })) || []),
            ...buildPayload(item.general_ledger_definition_entries || []).map(
                (entry) => ({
                    account_id: entry.general_ledger_definition_id,
                    index: entry.index,
                })
            ),
        ],
    }))
}
