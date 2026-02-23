import { useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { hasPermissionFromAuth } from '@/modules/authentication/authgentication.store'
import {
    PaymentTypeActions,
    PaymentTypeCreateUpdateFormModal,
    PaymentTypeTable,
} from '@/modules/payment-type'
import PermissionGuard from '@/modules/permission/components/permission-guard'

import PageContainer from '@/components/containers/page-container'

import { PaymentTypeTableProps } from '../components/tables'

const PaymentType = () => {
    const [createModal, setCreateModal] = useState(false)
    const queryClient = useQueryClient()

    return (
        <PageContainer>
            <PermissionGuard action="Read" resourceType="PaymentType">
                <>
                    <PaymentTypeCreateUpdateFormModal
                        formProps={{
                            defaultValues: {},
                            onSuccess: () => {
                                queryClient.invalidateQueries({
                                    queryKey: ['payment-type'],
                                })
                                toast.success(
                                    'Payment type created successfully'
                                )
                            },
                        }}
                        onOpenChange={setCreateModal}
                        open={createModal}
                        titleClassName="font-bold"
                    />

                    <PaymentTypeTable
                        actionComponent={(props) => (
                            <PaymentTypeActions
                                {...props}
                                onDeleteSuccess={() => {
                                    queryClient.invalidateQueries({
                                        queryKey: ['payment-type'],
                                    })
                                    toast.success(
                                        'Payment type deleted successfully'
                                    )
                                }}
                            />
                        )}
                        toolbarProps={{
                            createActionProps: {
                                onClick: () => setCreateModal(true),
                                disabled: !hasPermissionFromAuth({
                                    action: 'Create',
                                    resourceType: 'PaymentType',
                                }),
                            },
                            exportActionProps: {
                                disabled: !hasPermissionFromAuth({
                                    action: 'Export',
                                    resourceType: 'PaymentType',
                                }),
                            } as NonNullable<
                                PaymentTypeTableProps['toolbarProps']
                            >['exportActionProps'],
                        }}
                    />
                </>
            </PermissionGuard>
        </PageContainer>
    )
}

export default PaymentType
