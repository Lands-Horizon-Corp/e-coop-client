import { useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'

import { BranchCreateFormModal } from '@/components/forms'
import BranchesTable from '@/components/tables/branches-table'
import BranchesTableAdminAction from '@/components/tables/branches-table/row-actions/branches-table-admin-action'

const CompanyBranchesPage = () => {
    const queryClient = useQueryClient()
    const [createModal, setCreateModal] = useState(false)
    const { companyId } = useParams({
        from: '/admin/companies-management/$companyId/branch',
    })

    return (
        <div className="flex w-full max-w-full flex-col items-center px-4 pb-6 sm:px-8">
            <BranchCreateFormModal
                open={createModal}
                onOpenChange={(newState) => setCreateModal(newState)}
                formProps={{
                    defaultValues: {
                        companyId,
                    },
                    onSuccess: () =>
                        queryClient.invalidateQueries({
                            queryKey: ['branch', 'resource-query'],
                        }),
                }}
            />
            <BranchesTable
                defaultFilter={{
                    companyId: {
                        mode: 'equal',
                        value: companyId,
                        dataType: 'number',
                        isStaticFilter: true,
                        displayText: 'Company',
                    },
                }}
                actionComponent={({ row }) => (
                    <BranchesTableAdminAction row={row} />
                )}
                className="min-h-[90vh] w-full"
                toolbarProps={{
                    createActionProps: {
                        onClick: () => setCreateModal(true),
                    },
                }}
            />
        </div>
    )
}

export default CompanyBranchesPage
