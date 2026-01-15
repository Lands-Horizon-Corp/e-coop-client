import PageContainer from '@/components/containers/page-container'

import GeneralLedgerTable from '../tables/general-ledger-table'

const CashEntryPage = () => {
    return (
        <PageContainer>
            <GeneralLedgerTable
                className="max-h-[90vh] min-h-[90vh] w-full"
                entryType="cash-entry"
                excludeColumnIds={['balance']}
                mode="branch"
            />
        </PageContainer>
    )
}

export default CashEntryPage
