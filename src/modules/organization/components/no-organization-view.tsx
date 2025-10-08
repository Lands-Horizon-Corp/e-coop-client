import { useNavigate } from '@tanstack/react-router'

import { cn } from '@/helpers/tw-utils'
import { useCategoryStore } from '@/store/onboarding/category-store'

import { BuildingIcon, PlusIcon } from '@/components/icons'
import { HikingLandscape } from '@/components/svg/svg'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const NoOrganizationView = () => {
    const { handleProceedToSetupOrg } = useCategoryStore()
    const navigate = useNavigate()

    return (
        <div className="flex w-full flex-col items-center gap-y-5">
            <HikingLandscape />
            <Button
                className={cn('w-[300px] gap-x-2 rounded-xl')}
                onClick={() => {
                    handleProceedToSetupOrg(navigate)
                }}
            >
                <PlusIcon />
                Create your own Organization
            </Button>
            <div className="flex items-center justify-evenly gap-x-2">
                <Separator className="w-5" />
                <p>or</p>
                <Separator className="w-5" />
            </div>
            <Button
                className={cn('w-[300px] gap-x-2 rounded-xl')}
                onClick={() => {
                    navigate({ to: '/onboarding/organization' })
                }}
                variant={'secondary'}
            >
                <BuildingIcon /> Join an Organization
            </Button>
        </div>
    )
}

export default NoOrganizationView
