import { useOrganizations } from '@/hooks/api-hooks/use-organization'
import { createFileRoute } from '@tanstack/react-router'

import OrganizationItem from '../-components/-organization-list/organization-item'
import JoinBranchWithCodeFormModal from '@/components/forms/onboarding-forms/join-organization-form'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
// import { CodeSandBox } from '@/components/icons'

export const Route = createFileRoute('/onboarding/organization/')({
    component: RouteComponent,
})

function RouteComponent() {
    const { data: Organizations } = useOrganizations()
    const [onOpenJoinWithCodeModal, setOpenJoinWithCodeModal] = useState(false)
    const isNoOrganization = Organizations.length === 0

    return (
        <div className="w-full py-2">
            <JoinBranchWithCodeFormModal
                open={onOpenJoinWithCodeModal}
                onOpenChange={setOpenJoinWithCodeModal}
                title="Enter Code to Join a Branch"
                titleClassName="text-lg font-semibold"
            />
            <div className="flex">
                <div className="my-2 grow">
                    <h1 className="text-2xl font-bold text-muted-foreground"></h1>
                    List of organizations you can join, along with their
                    branches.
                </div>
                <Button
                    variant={'outline'}
                    size={'sm'}
                    onClick={() => setOpenJoinWithCodeModal(true)}
                >
                    Join with Code
                    {/* <CodeSandBox className="ml-2" /> */}
                </Button>
            </div>
            {isNoOrganization && (
                <div className="col-span-1">
                    <h2 className="text-center text-lg font-semibold">
                        No Organizations Found
                    </h2>
                </div>
            )}
            <div className="grid grid-cols-1 gap-2 py-2">
                {Organizations?.map((organization) => (
                    <OrganizationItem
                        key={organization.id}
                        organization={organization}
                    />
                ))}
            </div>
        </div>
    )
}
