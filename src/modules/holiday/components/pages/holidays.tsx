import PermissionGuard from '@/modules/permission/components/permission-guard'

import PageContainer from '@/components/containers/page-container'

import HolidayEditor from '../holiday-editor'

const HolidayPage = () => {
    return (
        <PageContainer>
            <PermissionGuard action="Read" resourceType="Holiday">
                <HolidayEditor className="w-full max-w-2xl" />
            </PermissionGuard>
        </PageContainer>
    )
}

export default HolidayPage
