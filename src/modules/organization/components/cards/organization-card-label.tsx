import { cn } from '@/helpers'

import { CreditCardIcon as SubscriptionIcon } from '@/components/icons'
import { Badge } from '@/components/ui/badge'

import { IOrganization } from '../../organization.types'

type TOrganizationLabel = {
    organization: IOrganization
}

export const OrganizationCardLabel = ({ organization }: TOrganizationLabel) => {
    if (!organization.subscription_plan) return null

    const isPlanhasPro = organization.subscription_plan.name
        .toLowerCase()
        .includes('pro')

    const isEnterprise = organization.subscription_plan.name
        .toLowerCase()
        .includes('enterprise')

    const variant = isEnterprise
        ? 'success'
        : isPlanhasPro
          ? 'default'
          : 'secondary'

    return (
        <Badge
            className={cn(
                'text-xs flex !min-w-fit',
                isEnterprise ? ' !backdrop-blur-md !bg-background/80 ' : ''
            )}
            variant={variant}
        >
            <SubscriptionIcon className="h-3 w-3 mr-1" />
            {organization.subscription_plan.name}
        </Badge>
    )
}
