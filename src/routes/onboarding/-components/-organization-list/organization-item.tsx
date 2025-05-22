import { GradientBackground } from '@/components/gradient-background/gradient-background'
import PlainTextEditor from '@/components/plain-text-editor'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { IOrganization } from '@/types'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'

type OrganizationItemProps = {
    organization: IOrganization
}

const OrganizationItem = ({ organization }: OrganizationItemProps) => {
    const [onOpenChange, setOpenChange] = useState(false)

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
            <GradientBackground mediaUrl={organization.media?.url}>
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
                        <p className="text-start text-xs text-white/80">
                            <PlainTextEditor
                                content={organization.description}
                            />
                        </p>
                        <Link
                            to={`/onboarding/organization/$organization_id`}
                            params={{ organization_id: organization.id }}
                        >
                            <Button
                                size={'sm'}
                                variant={'secondary'}
                                className="mt-2 max-w-32 text-xs"
                            >
                                View Details
                            </Button>
                        </Link>
                    </div>
                </div>
            </GradientBackground>
        </Link>
    )
}

export default OrganizationItem
