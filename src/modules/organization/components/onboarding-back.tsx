import { useRouter } from '@tanstack/react-router'

import { BackIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'

const OnboardingBack = ({ className }: { className: string }) => {
    const location = useRouter()
    const handleBack = () => {
        if (location.history) {
            location.history.back()
        }
    }
    return (
        <Button
            className={`flex aspect-square h-fit !p-2 items-center rounded-full ${className}`}
            onClick={handleBack}
            size="lg"
            variant="outline"
        >
            <BackIcon className="size-6" />
        </Button>
    )
}
export default OnboardingBack
