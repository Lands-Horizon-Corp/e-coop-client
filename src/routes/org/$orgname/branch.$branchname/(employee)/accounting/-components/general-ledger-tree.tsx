import GeneralLedgerTreeNode, {
    addPositionIndexes,
    IGeneralLedgerAccount,
    moveNodeInTree,
} from './general-ledger-node'

import { IGeneralLedgerDefinition } from '@/types/coop-types/general-ledger-definitions'

import { useCallback, useRef, useState } from 'react'

type GeneralLedgerTreeViewerProps = {
    treeData: IGeneralLedgerDefinition[]
}
const GeneralLedgerTreeViewer = ({
    treeData,
}: GeneralLedgerTreeViewerProps) => {
    const [ledgerData, setLedgerData] =
        useState<IGeneralLedgerDefinition[]>(treeData)

    const addPositionIndexesToTree = useCallback(
        (nodes: (IGeneralLedgerDefinition | IGeneralLedgerAccount)[]) => {
            nodes.forEach((node, idx) => {
                node.index = idx
                if (
                    node.general_ledger_accounts &&
                    node.general_ledger_accounts.length > 0
                ) {
                    addPositionIndexesToTree(node.general_ledger_accounts)
                }
            })
        },
        []
    )

    const initialLedgerData = useRef<IGeneralLedgerDefinition[]>([])

    if (initialLedgerData.current.length === 0) {
        initialLedgerData.current = JSON.parse(JSON.stringify(treeData))
        addPositionIndexesToTree(initialLedgerData.current)
    }

    const handleMoveNode = useCallback(
        (draggedId: string, targetId: string) => {
            setLedgerData((prevData) => {
                const moveResult = moveNodeInTree(prevData, draggedId, targetId)
                addPositionIndexes(moveResult)
                return moveResult
            })
        },
        [addPositionIndexesToTree]
    )

    if (!treeData || treeData.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500">
                No General Ledger data available.
            </div>
        )
    }

    return (
        <div className="w-1/2 rounded-lg p-4 shadow-md">
            <h3 className="mb-4 text-xl font-bold">
                General Ledger Definition
            </h3>
            {ledgerData.map((node) => (
                <GeneralLedgerTreeNode
                    key={node.id}
                    node={node}
                    depth={0}
                    onMoveNode={handleMoveNode}
                />
            ))}
        </div>
    )
}

export default GeneralLedgerTreeViewer
