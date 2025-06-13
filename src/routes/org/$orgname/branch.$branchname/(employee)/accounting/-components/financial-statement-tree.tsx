import { useCallback, useRef, useState } from 'react'

import AccountPicker from '@/components/pickers/account-picker'

import FinancialStatementTreeNode, {
    addFSPositionIndexes,
    IFinancialStatementAccount,
    moveFSNodeInTree,
} from './financial-statement-node'

import { IFinancialStatementDefinition } from '@/types/coop-types/financial-statement-definition'

type FinancialStatementTreeViewerProps = {
    treeData: IFinancialStatementDefinition[]
}
const FinancialStatementTreeViewer = ({
    treeData,
}: FinancialStatementTreeViewerProps) => {
    const [openAccountPicker, setOpenAccountPicker] = useState(false)
    const [financialStatement, setFinancialStatement] =
        useState<IFinancialStatementDefinition[]>(treeData)
    const initialLedgerData = useRef<IFinancialStatementDefinition[]>([])

    const addPositionIndexesToTree = useCallback(
        (
            nodes: (
                | IFinancialStatementDefinition
                | IFinancialStatementAccount
            )[]
        ) => {
            nodes.forEach((node, idx) => {
                node.index = idx
                if (
                    node.financial_statement_accounts &&
                    node.financial_statement_accounts.length > 0
                ) {
                    addPositionIndexesToTree(node.financial_statement_accounts)
                }
            })
        },
        []
    )

    if (initialLedgerData.current.length === 0) {
        initialLedgerData.current = JSON.parse(JSON.stringify(treeData))
        addPositionIndexesToTree(initialLedgerData.current)
    }

    const handleMoveNode = useCallback(
        (draggedId: string, targetId: string) => {
            setFinancialStatement((prevData) => {
                const moveResult = moveFSNodeInTree(
                    prevData,
                    draggedId,
                    targetId
                )
                addFSPositionIndexes(moveResult)
                return moveResult
            })
        },
        []
    )

    if (!treeData || treeData.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500">
                No General Ledger data available.
            </div>
        )
    }
    const handleOpenAccountPicker = () => {
        setOpenAccountPicker(true)
    }

    return (
        <div className="w-1/2 rounded-lg p-4 shadow-md">
            <AccountPicker
                open={openAccountPicker}
                onOpenChange={setOpenAccountPicker}
                modalOnly
            />
            <h3 className="mb-4 text-xl font-bold">
                Financial Statement Definition
            </h3>
            {financialStatement.map((node) => (
                <FinancialStatementTreeNode
                    handleOpenAccountPicker={handleOpenAccountPicker}
                    key={node.id}
                    node={node}
                    depth={0}
                    onMoveNode={handleMoveNode}
                />
            ))}
        </div>
    )
}

export default FinancialStatementTreeViewer
