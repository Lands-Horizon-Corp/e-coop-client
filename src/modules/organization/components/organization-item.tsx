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
            to={`/onboarding/organization/$organization_id`}
            params={{ organization_id: organization.id }}
        >
            <GradientBackground mediaUrl={organization.media?.download_url}>
                <div
                    key={organization.id}
                    className={cn(
                        'relative flex min-h-32 cursor-pointer items-center justify-between rounded-2xl border-0 p-4 hover:bg-secondary/50 hover:no-underline'
                    )}
                    onClick={handleOpenChange}
                >
                    <div className="flex flex-col">
                        <p className="touch-pan-up text-start text-2xl font-bold">
                            {organization.name}
                        </p>
                        <PlainTextEditor content={organization.description} />
                        <Button
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
                            className="mt-2 max-w-32 text-xs"
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
