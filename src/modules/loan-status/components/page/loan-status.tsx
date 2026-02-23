import { hasPermissionFromAuth } from '@/modules/authentication/authgentication.store'
import PermissionGuard from '@/modules/permission/components/permission-guard'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'

import { LoanStatusCreateUpdateFormModal } from '../forms/loan-status-create-update-form'
import LoanStatusTable, { LoanStatusTableProps } from '../loan-status-table'
import LoanStatusAction from '../loan-status-table/row-action-context'

const LoanStatusPage = () => {
    const createModal = useModalState()

    return (
        <PageContainer>
            <PermissionGuard action="Read" resourceType="LoanStatus">
                <LoanStatusCreateUpdateFormModal {...createModal} />
                <LoanStatusTable
                    actionComponent={LoanStatusAction}
                    className="max-h-[90vh] min-h-[90vh] w-full"
                    toolbarProps={{
                        createActionProps: {
                            disabled: !hasPermissionFromAuth({
                                action: 'Create',
                                resourceType: 'LoanStatus',
                            }),
                            onClick: () => {
                                createModal.onOpenChange(true)
                            },
                        },
                        exportActionProps: {
                            disabled: !hasPermissionFromAuth({
                                action: 'Export',
                                resourceType: 'LoanStatus',
                            }),
                        } as NonNullable<
                            LoanStatusTableProps['toolbarProps']
                        >['exportActionProps'],
                    }}
                />
            </PermissionGuard>
        </PageContainer>
    )
}

export default LoanStatusPage
