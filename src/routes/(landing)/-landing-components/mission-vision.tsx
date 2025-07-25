import { HandshakeIcon, Target } from 'lucide-react'

import { Separator } from '@/components/ui/separator'

interface InfoCardProps {
    icon: React.ReactNode
    title: string
    children: React.ReactNode
}

const InfoCard = ({ icon, title, children }: InfoCardProps) => (
    <div className="flex-1 min-w-[260px] backdrop-blur-sm max-w-md bg-gradient-to-b from-primary/10 to-transparent  rounded-xl p-5 flex flex-col items-center md:items-start text-center md:text-left">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary mb-3">
            {icon}
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1">
            {title}
        </h2>
        <Separator className="my-2  w-10 mx-auto md:mx-0" />
        <p className="text-sm md:text-base font-normal text-muted-foreground leading-relaxed">
            {children}
        </p>
    </div>
)

const MissionVisionSection = () => {
    return (
        <section className="relative py-10 md:py-16 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center items-stretch">
                    <InfoCard
                        icon={
                            <Target className="w-6 h-6 text-primary-foreground" />
                        }
                        title="Our Mission"
                    >
                        To{' '}
                        <span className="font-semibold text-foreground">
                            empower
                        </span>{' '}
                        cooperatives and their members globally through{' '}
                        <span className="font-semibold text-foreground">
                            secure, intuitive, and innovative digital solutions
                        </span>
                        , fostering{' '}
                        <span className="font-semibold text-foreground">
                            financial inclusion
                        </span>
                        , robust{' '}
                        <span className="font-semibold text-foreground">
                            transparency
                        </span>
                        , and sustainable,{' '}
                        <span className="font-semibold text-foreground">
                            community-driven growth
                        </span>
                        .
                    </InfoCard>
                    <InfoCard
                        icon={
                            <HandshakeIcon className="w-6 h-6 text-primary-foreground" />
                        }
                        title="Our Vision"
                    >
                        To be the{' '}
                        <span className="font-semibold text-foreground">
                            foremost digital platform
                        </span>{' '}
                        for cooperatives worldwide, cultivating a{' '}
                        <span className="font-semibold text-foreground">
                            dynamic ecosystem
                        </span>{' '}
                        where members and organizations{' '}
                        <span className="font-semibold text-foreground">
                            flourish
                        </span>{' '}
                        through cutting-edge,{' '}
                        <span className="font-semibold text-foreground">
                            trust-driven technology
                        </span>{' '}
                        and a commitment to{' '}
                        <span className="font-semibold text-foreground">
                            shared success
                        </span>
                        .
                    </InfoCard>
                </div>
            </div>
        </section>
    )
}

export default MissionVisionSection
