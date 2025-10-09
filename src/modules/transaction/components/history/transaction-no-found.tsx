import { FileText } from 'lucide-react'

export const TransactionNoFound = () => (
    <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <FileText className="mb-4 text-gray-400" size={48} />
        <p className="text-lg font-semibold">No Transactions Found</p>
        <p className="text-sm">
            There are no transactions to display at the moment.
        </p>
    </div>
)
export default TransactionNoFound
