import { createFileRoute } from '@tanstack/react-router'

import Transaction from '@/modules/transaction/pages'

import { TEntityId } from '@/types'

type TransactionSearch = {
    transactionId: TEntityId
}

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/transaction/'
)({
    component: RouteComponent,
    validateSearch: (search: Record<string, unknown>): TransactionSearch => {
        return {
            transactionId: String(search?.transactionId ?? ''),
        }
    },
})

function RouteComponent() {
    const fullPath = Route.fullPath
    const { transactionId } = Route.useSearch()

    return <Transaction fullPath={fullPath} transactionId={transactionId} />
}
