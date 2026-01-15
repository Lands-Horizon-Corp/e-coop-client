import { useNavigate } from '@tanstack/react-router'

import { cn } from '@/helpers/tw-utils'
import { useCategoryStore } from '@/store/onboarding/category-store'

import RandomDots from '@/components/backgrounds/random-dots'
import { BuildingIcon, PlusIcon } from '@/components/icons'
import ImageMatch from '@/components/image-match'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const NoOrganizationView = () => {
    const { handleProceedToSetupOrg } = useCategoryStore()
    const navigate = useNavigate()

    return (
        <div className="flex w-full flex-col justify-center items-center gap-y-5">
            <RandomDots count={80} enableFloat enableGlow />
            <ImageMatch
                alt="Cooperative community working together"
                containerClassName="overflow-hidden rounded-3xl max-w-[300px] transform group-hover:scale-105 transition-transform duration-300"
                src="/pictures/go-up.png"
            />
            <Button
                className={cn('w-[300px] z-10 gap-x-2 rounded-xl')}
                onClick={() => {
                    handleProceedToSetupOrg(navigate)
                }}
            >
                <PlusIcon />
                Create your own Organization
            </Button>
            <div className="grid grid-cols-3 items-center gap-5 ">
                <Separator className="w-10" />
                <p>or</p>
                <Separator className="w-10" />
            </div>
            <Button
                className={cn('w-[300px] gap-x-2 rounded-xl')}
                onClick={() => {
                    navigate({ to: '/onboarding/organization' as string })
                }}
                variant={'secondary'}
            >
                <BuildingIcon /> Join an Organization
            </Button>
        </div>
    )
}

export default NoOrganizationView
