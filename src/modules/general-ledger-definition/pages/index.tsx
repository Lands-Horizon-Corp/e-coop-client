import FinancialStatementTitleList from '@/modules/financial-statement-title/pages'
import PermissionGuard from '@/modules/permission/components/permission-guard'

import PageContainer from '@/components/containers/page-container'
import { Empty } from '@/components/ui/empty'

import { GeneralLedgerContextProvider } from '../ context/general-ledger-context-provider'
import { GeneralLedgerDefinitionTreeViewer } from '../components'

const GeneralLedgerDefinitionPage = () => {
    return (
        <PageContainer className="w-full relative min-h-screen p-5">
            <PermissionGuard
                action="Read"
                className=" inline-flex w-full v1"
                resourceType="GLDefinition"
            >
                <GeneralLedgerContextProvider>
                    <div className="w-full inline-flex p-2 gap-x-4">
                        <div className="flex-1 h-screen  ">
                            <Empty className="border">
                                Reports is under construction
                            </Empty>
                        </div>
                        <GeneralLedgerDefinitionTreeViewer />
                        <FinancialStatementTitleList />
                    </div>
                </GeneralLedgerContextProvider>
            </PermissionGuard>
        </PageContainer>
    )
}

export default GeneralLedgerDefinitionPage
