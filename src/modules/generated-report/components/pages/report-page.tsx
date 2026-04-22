import PermissionGuard from '@/modules/permission/components/permission-guard'

import PageContainer from '@/components/containers/page-container'

import ReportsMenu from '../report-menu'

export default function ReportPage() {
    return (
        <PageContainer>
            <PermissionGuard action="Read" resourceType="Report">
                <ReportsMenu />
            </PermissionGuard>
        </PageContainer>
    )
}
