import PermissionGuard from '@/modules/permission/components/permission-guard'

import PageContainer from '@/components/containers/page-container'

import DisbursementTransactionTable from '../disbursement-transaction-table'

const DisbursementTransactionPage = () => {
    return (
        <PageContainer>
            <PermissionGuard
                action="Read"
                resourceType="DisbursementTransaction"
            >
                <DisbursementTransactionTable
                    className="max-h-[90vh] min-h-[90vh] w-full"
                    mode="branch"
                />
            </PermissionGuard>
        </PageContainer>
    )
}

export default DisbursementTransactionPage
