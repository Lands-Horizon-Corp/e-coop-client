import ImageMatch from '@/components/image-match'

interface FeatureItemProps {
    icon: string
    title: string
    alt?: string
}

const FeatureItem = ({ icon, title, alt }: FeatureItemProps) => {
    return (
        <div className="flex items-center space-x-3 p-2">
            <ImageMatch
                alt={alt || `${title} feature icon`}
                containerClassName="shadow-card overflow-hidden rounded-2xl size-12 flex-shrink-0"
                src={icon}
            />
            <p className="font-bold text-sm md:text-base antialiased font-smooth">
                {title}
            </p>
        </div>
    )
}

export default FeatureItem
