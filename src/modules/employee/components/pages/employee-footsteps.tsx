import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import FootstepTable from '@/modules/footstep/components/footsteps-table'
import FootstepAction from '@/modules/footstep/components/footsteps-table/row-action-context'

import PageContainer from '@/components/containers/page-container'

import { useSubscribe } from '@/hooks/use-pubsub'

const EmployeeFootstepPage = () => {
    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()
    const queryClient = useQueryClient()

    useSubscribe(`footstep.create.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['footstep', 'paginated', 'branch'],
        })
    })

    useSubscribe(`footstep.update.user.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['footstep', 'paginated', 'branch'],
        })
    })

    useSubscribe(`footstep.delete.user.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['footstep', 'paginated', 'branch'],
        })
    })

    return (
        <PageContainer>
            <FootstepTable
                actionComponent={FootstepAction}
                className="max-h-[90vh] min-h-[90vh] w-full"
                mode="branch"
            />
        </PageContainer>
    )
}

export default EmployeeFootstepPage
