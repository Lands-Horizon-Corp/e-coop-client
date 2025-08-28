import PageContainer from '@/components/containers/page-container'

import GeneralLedgerTable from '../tables/general-ledger-table'

const CheckVoucherEntryPage = () => {
    return (
        <PageContainer>
            <GeneralLedgerTable
                mode="branch"
                TEntryType="check-voucher"
                excludeColumnIds={['balance']}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}

export default CheckVoucherEntryPage
