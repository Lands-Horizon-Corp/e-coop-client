import { useCallback, useRef, useState } from 'react'

import { Input } from '@/components/ui/input'
import AccountPicker from '@/components/pickers/account-picker'
import { Button } from '@/components/ui/button'

import FinancialStatementTreeNode, {
    addFSPositionIndexes,
    IFinancialStatementAccount,
    moveFSNodeInTree,
} from './financial-statement-node'

import { MagnifyingGlassIcon } from '@/components/icons'

import { useFinancialStatementStore } from '@/store/financial-statement-definition-store'
import { IFinancialStatementDefinition } from '@/types/coop-types/financial-statement-definition'

import { toast } from 'sonner'

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

    const [searchTerm, setSearchTerm] = useState('')
    const { expandPath, setTargetNodeId, resetExpansion } =
        useFinancialStatementStore()

    const findNodePath = (
        nodes: IFinancialStatementDefinition[],
        name: string,
        path: string[] = []
    ): string[] | null => {
        for (const node of nodes) {
            const newPath = [...path, node.id]
            if (node.name.toLowerCase().includes(name.toLowerCase())) {
                return newPath
            }
            if (node.financial_statement_accounts) {
                const foundPath = findNodePath(
                    node.financial_statement_accounts,
                    name,
                    newPath
                )
                if (foundPath) {
                    return foundPath
                }
            }
        }
        return null
    }

    const handleSearch = () => {
        if (!searchTerm.trim()) {
            resetExpansion()
            return
        }

        const path = findNodePath(treeData, searchTerm)

        if (path) {
            expandPath(path)
            setTargetNodeId(path[path.length - 1])
        } else {
            toast.error('Item not found!')
            resetExpansion()
        }
    }

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

    const isSearchOnChanged = searchTerm.length > 0

    return (
        <div className="w-full rounded-lg p-4 shadow-md">
            <AccountPicker
                open={openAccountPicker}
                onOpenChange={setOpenAccountPicker}
                modalOnly
            />
            <h3 className="mb-4 text-xl font-bold">
                Financial Statement Definition
            </h3>
            <div className="flex gap-2 border-b p-4">
                <Input
                    type="text"
                    placeholder="Search financial statement..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && isSearchOnChanged) {
                            handleSearch()
                        }
                    }}
                />
                <Button
                    onClick={handleSearch}
                    variant={'ghost'}
                    className="flex items-center space-x-2"
                    disabled={!isSearchOnChanged}
                >
                    <MagnifyingGlassIcon className="mr-2" />
                    Search
                </Button>
            </div>
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
