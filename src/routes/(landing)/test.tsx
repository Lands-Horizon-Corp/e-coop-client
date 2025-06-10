import PageContainer from '@/components/containers/page-container'
import { createFileRoute } from '@tanstack/react-router'
import { financialStatementDefinitionSample } from '@/types/coop-types/financial-statement-definition'
import { IFinancialStatementAccountsGrouping } from '@/types/coop-types/financial-statement-accounts-grouping'

import FinancialStatementTreeViewer from '../org/$orgname/branch.$branchname/(employee)/accounting/-components/financial-statement-tree'
import GeneralLedgerTreeViewer from '../org/$orgname/branch.$branchname/(employee)/accounting/-components/general-ledger-tree'
import { generalLedgerDefinitionSample } from '@/types/coop-types/general-ledger-definitions'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/(landing)/test')({
    component: RouteComponent,
})

export const FinancialStatementAccountsGroupingMapper = ({
    data,
}: {
    data?: IFinancialStatementAccountsGrouping
}) => {
    return <div>{data?.name}</div>
}

function RouteComponent() {
    const [time, setTimer] = useState(0)
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    const handleStartTime = () => {
        if (timerRef.current !== null) {
            return
        }

        timerRef.current = setInterval(() => {
            setTimer((prev) => prev + 1)
        }, 1000)
    }

    const stopTimer = () => {
        console.log('stop')
        if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
        }
    }

    return (
        <div>
            <PageContainer>
                <Button onClick={handleStartTime}>start</Button>
                <Button variant={'destructive'} onClick={() => stopTimer()}>
                    stop
                </Button>

                <h1>{time}</h1>
                <div className="flex w-full flex-col bg-black">
                    <FinancialStatementTreeViewer
                        treeData={financialStatementDefinitionSample}
                    />
                    <GeneralLedgerTreeViewer
                        treeData={generalLedgerDefinitionSample}
                    />
                </div>
            </PageContainer>
        </div>
    )
}
