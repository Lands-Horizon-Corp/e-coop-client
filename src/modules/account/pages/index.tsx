import PermissionGuard from '@/modules/permission/components/permission-guard'

import PageContainer from '@/components/containers/page-container'

import { AccountProvider } from '../context/account-provider'
import AccountWrapper from './account-wrapper'

export const Account = () => {
    return (
        <PageContainer>
            <PermissionGuard action="Read" resourceType="Account">
                <AccountProvider>
                    <AccountWrapper />
                </AccountProvider>
            </PermissionGuard>
        </PageContainer>
    )
}
export default Account
