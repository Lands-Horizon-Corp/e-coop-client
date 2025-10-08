import { useState } from 'react'

import { toast } from 'sonner'

import { IOrganizationWithPolicies } from '@/modules/organization'

import { IModalProps } from '@/components/modals/modal'
import Modal from '@/components/modals/modal'
import OrganizationPolicies from '@/components/policies'
import { Button } from '@/components/ui/button'

type PolicyAcceptanceModalProps = IModalProps & {
    onAccept: () => void
    onCancel: () => void
    organization: IOrganizationWithPolicies
    branchName: string
}

export const PolicyAcceptanceModal = ({
    onAccept,
    onCancel,
    branchName,
    organization,
    ...rest
}: PolicyAcceptanceModalProps) => {
    const [isAllChecked, setIsAllChecked] = useState(false)

    const handleAccept = () => {
        if (!isAllChecked) {
            toast.error('Please accept all policies before proceeding.')
            return
        }
        onAccept()
    }

    return (
        <Modal
            description={
                <span>
                    You are about to join this branch{' '}
                    <span className="font-semibold italic text-pretty">
                        {branchName}
                    </span>
                    , are you sure you want to proceed?
                </span>
            }
            title={`Join Branch ${branchName}`}
            {...rest}
            className="max-w-2xl"
        >
            <div>
                <p className=" text-xs text-muted-foreground mb-4">
                    To proceed, please read and accept the following policies:
                </p>
                <OrganizationPolicies
                    isIncludeIAccept
                    onPolicyChange={(isAllChecked) =>
                        setIsAllChecked(isAllChecked)
                    }
                    organization={organization}
                />
                <div className="flex justify-end col-span-2 gap-x-2 mt-6">
                    <Button onClick={onCancel} size={'sm'} variant={'ghost'}>
                        Cancel
                    </Button>
                    <Button
                        disabled={!isAllChecked}
                        onClick={handleAccept}
                        size={'sm'}
                    >
                        Join
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
export default PolicyAcceptanceModal
