import { useState } from 'react'

import { cn } from '@/helpers/tw-utils'
import OrganizationPreviewDisplaySkeleton from '@/modules/organization/components/organization-preview-display-skeleton'

import MapPicker from '@/components/map/map-picker'
import Modal, { IModalProps } from '@/components/modals/modal'

import { useModalState } from '@/hooks/use-modal-state'

import { TEntityId } from '@/types'

import { useGetBranchById } from '../../branch.service'
import { IBranch } from '../../branch.types'
import BranchPreviewDisplay from '../branch-display-preview'

interface OrganizationModalProps extends IModalProps {
    branchId: TEntityId
    className?: string
    showActions?: boolean
    isLoading?: boolean
}

const BranchModalDisplay = ({
    branchId,
    className,
    showActions,
    isLoading,
    ...modalProps
}: OrganizationModalProps) => {
    const [selectedBranch, setSelectedBranch] = useState<IBranch | null>(null)
    const openBranchMapLocation = useModalState(false)
    const { data: branch } = useGetBranchById({ id: branchId })
    if (!branch) return null
    return (
        <Modal
            {...modalProps}
            className={cn(
                '!max-w-4xl w-full border-0 p-0 !rounded-none max-h-[90vh]',
                isLoading ? 'overflow-y-hidden' : '',
                className
            )}
            showCloseButton={false}
            titleClassName="hidden"
        >
            {selectedBranch && (
                <MapPicker
                    disabled={false}
                    hideButtonCoordinates={true}
                    modalState={openBranchMapLocation}
                    title={`${branch.name} Location`}
                    value={{
                        lat: branch.latitude,
                        lng: branch.longitude,
                    }}
                    viewOnly={true}
                />
            )}
            <div className="relative">
                {isLoading ? (
                    <OrganizationPreviewDisplaySkeleton className="rounded-none min-h-screen overflow-y-hidden" />
                ) : (
                    <BranchPreviewDisplay
                        branch={branch}
                        onSelectBranch={(branch) => {
                            setSelectedBranch(branch)
                            openBranchMapLocation.onOpenChange(true)
                        }}
                        showActions={showActions}
                    />
                )}
            </div>
        </Modal>
    )
}

export default BranchModalDisplay
