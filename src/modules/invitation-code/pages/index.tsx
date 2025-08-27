import { useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import { InvitationCodeCreateUpdateFormModal } from '@/modules/invitation-code'

import PageContainer from '@/components/containers/page-container'

import { useSubscribe } from '@/hooks/use-pubsub'

import { InvitationCodeAction, InvitationCodeTable } from '../components'

const InvitationCode = () => {
    const [createModal, setCreateModal] = useState(false)
    const {
        currentAuth: { user_organization },
    } = useAuthUserWithOrgBranch()
    const queryClient = useQueryClient()

    useSubscribe(
        `invitation_code.create.branch.${user_organization.branch_id}`,
        () => {
            queryClient.invalidateQueries({
                queryKey: ['invitation-code', 'resource-query'],
            })
        }
    )

    useSubscribe(
        `invitation_code.update.branch.${user_organization.branch_id}`,
        () => {
            queryClient.invalidateQueries({
                queryKey: ['invitation-code', 'resource-query'],
            })
        }
    )

    useSubscribe(
        `invitation_code.delete.branch.${user_organization.branch_id}`,
        () => {
            queryClient.invalidateQueries({
                queryKey: ['invitation-code', 'resource-query'],
            })
        }
    )

    return (
        <PageContainer>
            <InvitationCodeCreateUpdateFormModal
                open={createModal}
                onOpenChange={setCreateModal}
                titleClassName="font-bold"
                className="min-w-[400px] sm:min-w-[500px] md:min-w-[600px] lg:min-w-[700px] xl:min-w-[800px]"
                formProps={{
                    defaultValues: {},
                    onSuccess: () => {
                        toast.success('Invitation code created')
                    },
                }}
            />
            <InvitationCodeTable
                actionComponent={(props) => (
                    <InvitationCodeAction
                        onDeleteSuccess={() => {
                            queryClient.invalidateQueries({
                                queryKey: ['invitation-code'],
                            })
                            toast.success('Invitation code deleted')
                        }}
                        {...props}
                    />
                )}
                toolbarProps={{
                    createActionProps: {
                        onClick: () => setCreateModal(true),
                    },
                }}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
export default InvitationCode
