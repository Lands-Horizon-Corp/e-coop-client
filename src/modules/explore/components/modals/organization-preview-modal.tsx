import { useState } from 'react'

import { cn } from '@/helpers'
import { useGetBranchesByOrganizationId } from '@/modules/branch'
import { BranchCardHeaderContent } from '@/modules/branch/components/cards/branch-card'
import BranchModalDisplay from '@/modules/branch/components/modal/branch-modal-display'
import { useGetOrganizationById } from '@/modules/organization'
import { OrganizationPreviewDisplay } from '@/modules/organization/components/organization-preview-display'
import OrganizationPreviewModalDetails from '@/modules/organization/pages/onboarding/with-organization/organization-preview-details-modal'

import { BranchIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import CardTopImage from '@/components/ui/card-top-image'

import { useModalState } from '@/hooks/use-modal-state'

import { TEntityId } from '@/types'

interface OrganizationBranchesModalProps extends IModalProps {
    organizationId: TEntityId
    className?: string
}

const OrganizationBranchesModal = ({
    organizationId,
    className,
    ...props
}: OrganizationBranchesModalProps) => {
    const { data: organization, isLoading } = useGetOrganizationById({
        id: organizationId,
    })

    const { data: branches } = useGetBranchesByOrganizationId({
        organizationId,
    })
    const [selectedBranch, setSelectedBranch] = useState<TEntityId>()
    const branchModalState = useModalState(false)
    return (
        <Modal
            open
            {...props}
            className={cn(
                '!max-w-4xl w-full border-0 p-0 !rounded-[10px] max-h-[90vh]',
                isLoading ? 'overflow-y-hidden' : '',
                className
            )}
        >
            {selectedBranch && (
                <BranchModalDisplay
                    {...branchModalState}
                    branchId={selectedBranch}
                    isLoading={false}
                    showActions={false}
                />
            )}
            {organization && (
                <OrganizationPreviewDisplay
                    organization={organization}
                    showActions={false}
                />
            )}
            <div className="space-y-4 px-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BranchIcon className="text-primary" />
                        <h2 className="text-lg font-semibold">
                            Branches ({branches && branches.length})
                        </h2>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-3 p-5 gap-2">
                {branches?.map((branch) => {
                    return (
                        <CardTopImage
                            className={cn(
                                'cursor-pointer rounded-2xl',
                                className
                            )}
                            customHeader={
                                <div className="">
                                    <BranchCardHeaderContent
                                        branch={branch}
                                        showContact={false}
                                        showLocation={false}
                                        variant={'compact'}
                                    />
                                </div>
                            }
                            imageAlt={`${branch.name} branch`}
                            imageClassName=""
                            imageSrc={branch.media?.download_url}
                            onCardClick={() => {
                                branchModalState.onOpenChange(true)
                                setSelectedBranch(branch.id)
                            }}
                        />
                    )
                })}
            </div>
            {organization && (
                <OrganizationPreviewModalDetails
                    onJoin={() => {}}
                    organization={organization}
                />
            )}
        </Modal>
    )
}

export default OrganizationBranchesModal
