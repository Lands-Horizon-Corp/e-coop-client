import PageContainer from '@/components/containers/page-container'

import DisbursementTransactionTable from '../disbursement-transaction-table'

const DisbursementTransactionPage = () => {
    return (
        <PageContainer>
            <DisbursementTransactionTable
                mode="branch"
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}

export default DisbursementTransactionPage
