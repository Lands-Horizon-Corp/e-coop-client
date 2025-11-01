import { cn } from '@/helpers/tw-utils'
import { OrganizationPreviewDisplaySkeleton } from '@/modules/organization/pages/organization/organization-preview-display'

import Modal, { IModalProps } from '@/components/modals/modal'

import { IBranch } from '../../branch.types'
import BranchPreviewDisplay from '../branch-display-preview'

interface OrganizationModalProps extends IModalProps {
    branch?: IBranch | null
    className?: string
    showActions?: boolean
    isLoading?: boolean
}

const BranchModalDisplay = ({
    branch,
    className,
    showActions,
    isLoading,
    ...modalProps
}: OrganizationModalProps) => {
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
            <div className="relative">
                {isLoading ? (
                    <OrganizationPreviewDisplaySkeleton
                        className="rounded-none min-h-screen overflow-y-hidden"
                        variant="default"
                    />
                ) : (
                    <BranchPreviewDisplay
                        branch={branch}
                        showActions={showActions}
                    />
                )}
            </div>
        </Modal>
    )
}

export default BranchModalDisplay
