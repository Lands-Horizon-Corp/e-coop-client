import { createFileRoute } from '@tanstack/react-router'

import Transaction from '@/modules/transaction/pages'

import { TEntityId } from '@/types'

type TransactionSearch = {
    transactionId?: TEntityId
}

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(transactions)/payment'
)({
    component: RouteComponent,
    validateSearch: (search): TransactionSearch => {
        const id = search.transactionId
        return {
            transactionId:
                typeof id === 'string' && id.length > 0 ? id : undefined,
        }
    },
})

function RouteComponent() {
    const fullPath = Route.fullPath
    const { transactionId } = Route.useSearch()

    return <Transaction fullPath={fullPath} transactionId={transactionId} />
}
