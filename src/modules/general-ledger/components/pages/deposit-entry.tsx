import PageContainer from '@/components/containers/page-container'

import GeneralLedgerTable from '../tables/general-ledger-table'

const DepositEntryPage = () => {
    return (
        <PageContainer>
            <GeneralLedgerTable
                mode="branch"
                TEntryType="deposit-entry"
                excludeColumnIds={['balance']}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}

export default DepositEntryPage
