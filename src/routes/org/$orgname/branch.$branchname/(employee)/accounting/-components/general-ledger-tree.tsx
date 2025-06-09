import { IGeneralLedgerDefinition } from '@/types/coop-types/general-ledger-definitions'
import GeneralLedgerTreeNode from './general-ledger-node'

type GeneralLedgerTreeViewerProps = {
    treeData: IGeneralLedgerDefinition[]
}
const GeneralLedgerTreeViewer = ({
    treeData,
}: GeneralLedgerTreeViewerProps) => {
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
            {treeData.map((node) => (
                <GeneralLedgerTreeNode key={node.id} node={node} depth={0} />
            ))}
        </div>
    )
}

export default GeneralLedgerTreeViewer
