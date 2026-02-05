import PermissionGuard from '@/modules/permission/components/permission-guard'
import { TPaymentMode } from '@/modules/quick-transfer'

import PageContainer from '@/components/containers/page-container'

import { QuickTransferProvider } from '../context/quick-transfer-context'
import DepositWithdrawWrapper from './deposit-withdraw'

const QuickDepositWithdraw = ({ mode }: { mode: TPaymentMode }) => {
    return (
        <div>
            <PageContainer className="flex w-full overflow-hidden!">
                <PermissionGuard
                    action={'Read'}
                    resourceType={
                        mode === 'deposit' ? 'QuickDeposit' : 'QuickWithdraw'
                    }
                >
                    <QuickTransferProvider mode={mode}>
                        <DepositWithdrawWrapper mode={mode} />
                    </QuickTransferProvider>
                </PermissionGuard>
            </PageContainer>
        </div>
    )
}

export default QuickDepositWithdraw
