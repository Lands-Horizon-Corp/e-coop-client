import { useQueryClient } from '@tanstack/react-query'

import AreaTable, { AreaTableProps } from '@/modules/area/components/area-table'
import {
    hasPermissionFromAuth,
    useAuthUserWithOrgBranch,
} from '@/modules/authentication/authgentication.store'
import PermissionGuard from '@/modules/permission/components/permission-guard'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

import { AreaCreateUpdateFormModal } from '../forms/area-create-update-form'

const AreaPage = () => {
    const createModal = useModalState()
    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()

    const queryClient = useQueryClient()

    useSubscribe(`area.created.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['area', 'paginated'],
        })
    })

    useSubscribe(`area.updated.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['area', 'paginated'],
        })
    })

    useSubscribe(`area.deleted.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['area', 'paginated'],
        })
    })

    return (
        <PageContainer>
            <PermissionGuard action="Read" resourceType="Area">
                <AreaCreateUpdateFormModal {...createModal} />
                <AreaTable
                    className="max-h-[90vh] min-h-[90vh] w-full"
                    toolbarProps={{
                        createActionProps: {
                            onClick: () => createModal.onOpenChange(true),
                            disabled: !hasPermissionFromAuth({
                                action: 'Create',
                                resourceType: 'Area',
                            }),
                        },
                        exportActionProps: {
                            disabled: !hasPermissionFromAuth({
                                action: 'Export',
                                resourceType: 'Area',
                            }),
                        } as NonNullable<
                            AreaTableProps['toolbarProps']
                        >['exportActionProps'],
                    }}
                />
            </PermissionGuard>
        </PageContainer>
    )
}

export default AreaPage
