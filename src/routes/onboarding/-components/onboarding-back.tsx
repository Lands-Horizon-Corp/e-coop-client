import { BackIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { useRouter } from '@tanstack/react-router'

const LocationBack = ({ className }: { className: string }) => {
    const location = useRouter()
    const handleBack = () => {
        if (location.history) {
            location.history.back()
        }
    }
    return (
        <Button
            onClick={handleBack}
            variant="ghost"
            className={`flex w-fit items-center rounded-full ${className}`}
        >
            <BackIcon size={25} />
        </Button>
    )
}
export default LocationBack
