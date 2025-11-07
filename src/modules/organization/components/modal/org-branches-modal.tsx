import { useState } from 'react'

import { toast } from 'sonner'

import { useAuthUser } from '@/modules/authentication/authgentication.store'
import { IUserBase } from '@/modules/user'
import {
    IOrgUserOrganizationGroup,
    IUserOrganization,
} from '@/modules/user-organization'

import MapPicker from '@/components/map/map-picker'

import { useModalState } from '@/hooks/use-modal-state'

import { TEntityId } from '@/types'

import Modal, { IModalProps } from '../../../../components/modals/modal'
import { ListOfBranches } from '../with-organization'

interface OrganizationBranchesModalProps extends IModalProps {
    organization: IOrgUserOrganizationGroup
    handleVisit: (
        userOrganization: IUserOrganization<IUserBase>
    ) => Promise<void>
    switchingOrgId: TEntityId | null
}

const OrganizationBranchesModal = ({
    organization: org,
    handleVisit,
    switchingOrgId,
    ...props
}: OrganizationBranchesModalProps) => {
    const {
        currentAuth: { user_organization: currentUserOrg },
    } = useAuthUser()

    const [selectedOrg, setSelectedOrg] = useState<IUserOrganization | null>(
        null
    )

    const openBranchMapLocation = useModalState(false)

    return (
        <Modal {...props}>
            {selectedOrg && (
                <MapPicker
                    disabled={false}
                    hideButtonCoordinates={true}
                    modalState={openBranchMapLocation}
                    title={`${selectedOrg.branch.name} Location`}
                    value={{
                        lat: selectedOrg.branch.latitude,
                        lng: selectedOrg.branch.longitude,
                    }}
                    viewOnly={true}
                />
            )}
            <div className="w-fit max-w-lg flex flex-col gap-y-2 overflow-y-auto ecoop-scroll border-0  bg-background">
                {org.user_organizations.map((userOrg) => {
                    const isCurrentOrg = userOrg.id === currentUserOrg?.id
                    return (
                        <ListOfBranches
                            isCurrent={isCurrentOrg}
                            isLoading={switchingOrgId === userOrg.id}
                            key={userOrg.id}
                            onClick={() =>
                                toast.promise(handleVisit(userOrg), {
                                    loading: `Switching to ${userOrg.branch?.name}...`,
                                    success: `Switched to ${userOrg.branch?.name}`,
                                    error: `Failed to switch to ${userOrg.branch?.name}`,
                                })
                            }
                            onSelect={(org) => {
                                setSelectedOrg(org)
                                openBranchMapLocation.onOpenChange(true)
                            }}
                            userOrg={userOrg}
                        />
                    )
                })}
            </div>
        </Modal>
    )
}
export default OrganizationBranchesModal
