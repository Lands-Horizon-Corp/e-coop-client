import { useFinancialStatementStore } from '@/store/financial-statement-definition-store'
import GeneralLedgerTreeNode, {
    addPositionIndexes,
    IGeneralLedgerAccount,
    moveNodeInTree,
} from './general-ledger-node'

import { IGeneralLedgerDefinition } from '@/types/coop-types/general-ledger-definitions'

import { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MagnifyingGlassIcon } from '@/components/icons'

type GeneralLedgerTreeViewerProps = {
    treeData: IGeneralLedgerDefinition[]
}

const findNodePath = (
    nodes: IGeneralLedgerDefinition[],
    name: string,
    path: string[] = []
): string[] | null => {
    for (const node of nodes) {
        const newPath = [...path, node.id]
        if (node.name.toLowerCase().includes(name.toLowerCase())) {
            return newPath
        }
        if (node.general_ledger_accounts) {
            const foundPath = findNodePath(
                node.general_ledger_accounts,
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

const GeneralLedgerTreeViewer = ({
    treeData,
}: GeneralLedgerTreeViewerProps) => {
    const [ledgerData, setLedgerData] =
        useState<IGeneralLedgerDefinition[]>(treeData)

    const [searchTerm, setSearchTerm] = useState('')
    const { expandPath, setTargetNodeId, resetExpansion } =
        useFinancialStatementStore()

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
    const isSearchOnChanged = searchTerm.length > 0

    return (
        <div className="w-full rounded-lg p-4 shadow-md">
            <h3 className="mb-4 text-xl font-bold">
                General Ledger Definition
            </h3>
            <div className="flex gap-2 border-b p-4">
                <Input
                    type="text"
                    placeholder="Search General Ledger..."
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
