import { AccountCreateUpdateFormModal, AccountsTable } from '@/modules/account'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'

export const Account = () => {
    const createModal = useModalState()

    return (
        <PageContainer>
            <div className="flex w-full flex-col  items-start gap-4">
                <AccountCreateUpdateFormModal
                    className=" min-w-[80vw] max-w-[80vw]"
                    {...createModal}
                />
                <AccountsTable
                    className="max-h-[90vh] min-h-[90vh] w-full"
                    toolbarProps={{
                        createActionProps: {
                            onClick: () => createModal.onOpenChange(true),
                        },
                    }}
                />
            </div>
        </PageContainer>
    )
}
export default Account
