import PermissionGuard from '@/modules/permission/components/permission-guard'
import PermissionNotAllowedDisplay from '@/modules/permission/components/permission-not-allowed-display'

import PageContainer from '@/components/containers/page-container'

import AccountTransaction from '../account-transaction'

const AccountTransactionPage = () => {
    return (
        <PageContainer>
            <PermissionGuard
                action="Read"
                NotAllowedComponent={(props) => (
                    <PermissionNotAllowedDisplay {...props} />
                )}
                resourceType="AccountTransaction"
            >
                <AccountTransaction />
            </PermissionGuard>
        </PageContainer>
    )
}

export default AccountTransactionPage
