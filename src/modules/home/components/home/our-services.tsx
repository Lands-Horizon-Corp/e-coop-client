import ImageMatch from '@/components/image-match'

import { SERVICES } from '../../home.constants'
import { IFeatureItem } from '../../home.types'

const ServiceCard = ({ icon, title, description, alt }: IFeatureItem) => {
    return (
        <div className="bg-card dark:bg-background dark:shadow-none shadow backdrop-blur-sm hover:border-primary border border-border/50 rounded-2xl p-6 hover:bg-card/95 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
            {/* Icon at the top */}
            <div className="flex justify-center mb-4">
                <div className="relative">
                    {/* Glow effect */}

                    <ImageMatch
                        alt={alt || `${title} feature icon`}
                        containerClassName="size-12 flex-shrink-0"
                        glow
                        src={icon}
                    />
                </div>
            </div>

            {/* Title */}
            <h3 className="font-bold text-lg md:text-xl text-card-foreground text-center my-6 antialiased font-smooth">
                {title}
            </h3>

            {/* Description */}
            <p className="text-muted-foreground text-sm text-center leading-relaxed antialiased">
                {description}
            </p>
        </div>
    )
}

const OurServices = () => {
    return (
        <div className="py-16 px-4">
            <div className="absolute inset-0 -z-10 h-full w-full bg-radial-[ellipse_at_120%_90%] from-primary/20 via-background/0 to-background/0 to-10%" />

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SERVICES.map((service, index) => (
                    <ServiceCard
                        alt={service.alt}
                        description={service.description}
                        icon={service.icon}
                        key={index}
                        title={service.title}
                    />
                ))}
            </div>
        </div>
    )
}

export default OurServices
