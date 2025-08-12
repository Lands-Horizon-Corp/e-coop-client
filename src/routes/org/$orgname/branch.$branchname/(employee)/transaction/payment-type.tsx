import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import { PaymentTypeFormModal } from '@/components/forms/payment-type-forms/payment-type-create-update-form'
import { PaymentTypeTable } from '@/components/tables/payment-type-table'
import PaymentTypeAction from '@/components/tables/payment-type-table/row-action-context'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/transaction/payment-type'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const [createModal, setCreateModal] = useState(false)
    const invalidateQueries = useQueryClient()

    return (
        <PageContainer>
            <PaymentTypeFormModal
                open={createModal}
                onOpenChange={setCreateModal}
                titleClassName="font-bold"
                formProps={{
                    defaultValues: {},
                    onSuccess: () => {
                        invalidateQueries.invalidateQueries({
                            queryKey: ['payment-type', 'resource-query'],
                        })
                    },
                }}
            />

            <PaymentTypeTable
                actionComponent={(props) => <PaymentTypeAction {...props} />}
                toolbarProps={{
                    createActionProps: {
                        onClick: () => setCreateModal(true),
                    },
                }}
            />
        </PageContainer>
    )
}
