import PageContainer from '@/components/containers/page-container'

import GeneralLedgerTable from '../tables/general-ledger-table'

const WithdrawEntryPage = () => {
    return (
        <PageContainer>
            <GeneralLedgerTable
                mode="branch"
                TEntryType="withdraw-entry"
                excludeColumnIds={['balance']}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
export default WithdrawEntryPage
