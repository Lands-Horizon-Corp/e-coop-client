import PageContainer from '@/components/containers/page-container'

import GeneralLedgerTable from '../tables/general-ledger-table'

const CheckVoucherEntryPage = () => {
    return (
        <PageContainer>
            <GeneralLedgerTable
                className="max-h-[90vh] min-h-[90vh] w-full"
                excludeColumnIds={['balance']}
                mode="branch"
                TEntryType="check-voucher"
            />
        </PageContainer>
    )
}

export default CheckVoucherEntryPage
