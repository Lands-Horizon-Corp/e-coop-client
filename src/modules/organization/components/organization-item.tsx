import { useState } from 'react'

import { Link, useNavigate } from '@tanstack/react-router'

import { cn } from '@/helpers/tw-utils'
import { IOrganization } from '@/modules/organization'

import { GradientBackground } from '@/components/gradient-background/gradient-background'
import { Button } from '@/components/ui/button'
import { PlainTextEditor } from '@/components/ui/text-editor'

type OrganizationItemProps = {
    organization: IOrganization
}

const OrganizationItem = ({ organization }: OrganizationItemProps) => {
    const [onOpenChange, setOpenChange] = useState(false)
    const navigate = useNavigate()
    const handleOpenChange = () => {
        setOpenChange(!onOpenChange)
    }

    if (!organization || !organization.media) {
        return null
    }

    return (
        <Link
            params={{ organization_id: organization.id }}
            to={`/onboarding/organization/$organization_id`}
        >
            <GradientBackground mediaUrl={organization.media?.download_url}>
                <div
                    className={cn(
                        'relative flex min-h-32 cursor-pointer items-center justify-between rounded-2xl border-0 p-4 hover:bg-secondary/50 hover:no-underline'
                    )}
                    key={organization.id}
                    onClick={handleOpenChange}
                >
                    <div className="flex flex-col">
                        <p className="touch-pan-up text-start text-2xl font-bold">
                            {organization.name}
                        </p>
                        <PlainTextEditor content={organization.description} />
                        <Button
                            className="mt-2 max-w-32 text-xs"
                            onClick={() =>
                                navigate({
                                    to: `/onboarding/organization/${organization.id}`,
                                    params: {
                                        organization_id: organization.id,
                                    },
                                })
                            }
                            size={'sm'}
                            variant={'secondary'}
                        >
                            View Details
                        </Button>
                    </div>
                </div>
            </GradientBackground>
        </Link>
    )
}

export default OrganizationItem
