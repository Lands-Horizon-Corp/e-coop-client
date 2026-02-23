import { hasPermissionFromAuth } from '@/modules/authentication/authgentication.store'
import PermissionGuard from '@/modules/permission/components/permission-guard'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'

import { LoanPurposeCreateUpdateFormModal } from '../forms/loan-purpose-create-update-form'
import LoanPurposeTable, { LoanPurposeTableProps } from '../loan-purpose-table'
import LoanPurposeAction from '../loan-purpose-table/row-action-context'

const LoanPurposePage = () => {
    const createModal = useModalState()

    return (
        <PageContainer>
            <PermissionGuard action="Read" resourceType="LoanPurpose">
                <LoanPurposeCreateUpdateFormModal {...createModal} />
                <LoanPurposeTable
                    actionComponent={LoanPurposeAction}
                    className="max-h-[90vh] min-h-[90vh] w-full"
                    toolbarProps={{
                        createActionProps: {
                            disabled: !hasPermissionFromAuth({
                                action: 'Create',
                                resourceType: 'LoanPurpose',
                            }),
                            onClick: () => {
                                createModal.onOpenChange(true)
                            },
                        },
                        exportActionProps: {
                            disabled: !hasPermissionFromAuth({
                                action: 'Export',
                                resourceType: 'LoanPurpose',
                            }),
                        } as NonNullable<
                            LoanPurposeTableProps['toolbarProps']
                        >['exportActionProps'],
                    }}
                />
            </PermissionGuard>
        </PageContainer>
    )
}

export default LoanPurposePage
