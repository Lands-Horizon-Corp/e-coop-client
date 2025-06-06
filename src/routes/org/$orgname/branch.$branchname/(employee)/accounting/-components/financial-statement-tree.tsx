import FinancialStatementTreeNode from './financial-statement-node'
import { IFinancialStatementDefinition } from '@/types/coop-types/financial-statement-definition'

type FinancialStatementTreeViewerProps = {
    treeData: IFinancialStatementDefinition[]
}
const FinancialStatementTreeViewer = ({
    treeData,
}: FinancialStatementTreeViewerProps) => {
    if (!treeData || treeData.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500">
                No General Ledger data available.
            </div>
        )
    }

    return (
        <div className="rounded-lg p-4 shadow-md">
            <h3 className="mb-4 text-xl font-bold">
                Financial Statement Definition
            </h3>
            {treeData.map((node) => (
                <FinancialStatementTreeNode
                    key={node.id}
                    node={node}
                    depth={0}
                />
            ))}
        </div>
    )
}

export default FinancialStatementTreeViewer
