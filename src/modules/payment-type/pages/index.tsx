import { useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
    PaymentTypeActions,
    PaymentTypeCreateUpdateFormModal,
    PaymentTypeTable,
} from '@/modules/payment-type'

import PageContainer from '@/components/containers/page-container'

const PaymentType = () => {
    const [createModal, setCreateModal] = useState(false)
    const invalidateQueries = useQueryClient()

    return (
        <PageContainer>
            <PaymentTypeCreateUpdateFormModal
                open={createModal}
                onOpenChange={setCreateModal}
                titleClassName="font-bold"
                formProps={{
                    defaultValues: {},
                    onSuccess: () => {
                        // invalidateQueries.invalidateQueries({
                        //     queryKey: ['payment-type', paginated],
                        // })
                        toast.success('Payment type created successfully')
                    },
                }}
            />

            <PaymentTypeTable
                actionComponent={(props) => (
                    <PaymentTypeActions
                        onDeleteSuccess={() => {
                            invalidateQueries.invalidateQueries({
                                queryKey: ['payment-type'],
                            })
                            toast.success('Payment type deleted successfully')
                        }}
                        {...props}
                    />
                )}
                toolbarProps={{
                    createActionProps: {
                        onClick: () => setCreateModal(true),
                    },
                }}
            />
        </PageContainer>
    )
}
export default PaymentType
