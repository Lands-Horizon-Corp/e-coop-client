import PageContainer from '@/components/containers/page-container'

import DisbursementTransactionTable from '../disbursement-transaction-table'

const DisbursementTransactionPage = () => {
    return (
        <PageContainer>
            <DisbursementTransactionTable
                className="max-h-[90vh] min-h-[90vh] w-full"
                mode="branch"
            />
        </PageContainer>
    )
}

export default DisbursementTransactionPage
