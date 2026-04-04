import {
    hasPermissionFromAuth,
    useAuthUserWithOrgBranch,
} from '@/modules/authentication/authgentication.store'
import PermissionGuard from '@/modules/permission/components/permission-guard'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'

import OtherFundCreateUpdateFormModal from '../components/forms/create-update-other-fund-modal'
import OtherFundTable, { OtherFundTableProps } from '../components/tables'

const OtherFundPage = () => {
    const {
        currentAuth: {
            user_organization: {
                branch: {
                    branch_setting: { currency },
                },
            },
        },
    } = useAuthUserWithOrgBranch()
    const createModal = useModalState(false)
    return (
        <div>
            <PageContainer>
                <OtherFundCreateUpdateFormModal
                    {...createModal}
                    formProps={{
                        defaultValues: {
                            currency,
                            currency_id: currency.id,
                        },
                    }}
                />
                <PermissionGuard action="Read" resourceType="OtherFund">
                    <OtherFundTable
                        className="max-h-[90vh] min-h-[90vh] w-full"
                        toolbarProps={{
                            createActionProps: {
                                disabled: !hasPermissionFromAuth({
                                    action: 'Create',
                                    resourceType: 'OtherFund',
                                }),
                                onClick: () => {
                                    createModal.onOpenChange(true)
                                },
                            },
                            exportActionProps: {
                                disabled: !hasPermissionFromAuth({
                                    action: 'Export',
                                    resourceType: 'OtherFund',
                                }),
                            } as NonNullable<
                                OtherFundTableProps['toolbarProps']
                            >['exportActionProps'],
                        }}
                    />
                </PermissionGuard>
            </PageContainer>
        </div>
    )
}

export default OtherFundPage
