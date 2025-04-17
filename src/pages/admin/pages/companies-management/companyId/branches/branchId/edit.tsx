import { useParams } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'

import { branchLoader } from '@/hooks/api-hooks/use-branch'
import { BranchEditForm } from '@/components/forms'

const EditBranchPage = () => {
    const { branchId } = useParams({
        from: '/admin/companies-management/$companyId/branch/$branchId',
    })

    const { data: company } = useSuspenseQuery(branchLoader(branchId))

    return (
        <div className="flex w-full max-w-full flex-col items-center px-4 pb-6 sm:px-8">
            <div className="w-full max-w-5xl space-y-4 p-4">
                <h4 className="font-medium">Edit Branch</h4>
                <BranchEditForm branchId={branchId} defaultValues={company} />
            </div>
        </div>
    )
}

export default EditBranchPage
