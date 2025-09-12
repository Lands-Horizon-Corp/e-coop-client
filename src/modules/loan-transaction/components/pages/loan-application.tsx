import PageContainer from '@/components/containers/page-container'

import LoanTransactionCreateUpdateForm from '../forms/loan-transaction-create-update-form'

const LoanApplicationPage = () => {
    return (
        <PageContainer>
            <LoanTransactionCreateUpdateForm mode="create" />
        </PageContainer>
    )
}

export default LoanApplicationPage
