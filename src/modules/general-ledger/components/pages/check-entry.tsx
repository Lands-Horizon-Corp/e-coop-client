import PageContainer from '@/components/containers/page-container'

import GeneralLedgerTable from '../tables/general-ledger-table'

const CheckEntryPage = () => {
    return (
        <PageContainer>
            <GeneralLedgerTable
                mode="branch"
                TEntryType="check-entry"
                excludeColumnIds={['balance']}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}

export default CheckEntryPage
