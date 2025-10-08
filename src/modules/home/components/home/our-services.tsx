import {
    Banknote,
    BarChart3,
    FileLock,
    LifeBuoy,
    MessagesSquare,
    Puzzle,
    Users,
} from 'lucide-react'
import { LucideIcon } from 'lucide-react'

type ServiceCardProps = {
    icon: LucideIcon
    title: string
    description: string
}

const ServiceCard = ({ icon: Icon, title, description }: ServiceCardProps) => {
    return (
        <div className="group relative overflow-hidden rounded-xl bg-card shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border max-w-md">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Content with icon on left */}
            <div className="relative flex items-center p-4 gap-4">
                {/* Icon container */}
                <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                        <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                </div>

                {/* Text content */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
                        {title}
                    </h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>

            {/* Decorative left accent */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/20 via-primary to-primary/20 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
        </div>
    )
}

const OurServices = () => {
    const services = [
        {
            icon: Banknote,
            title: 'Digital Banking',
            description:
                'Secure online account management with real-time transactions and comprehensive financial tools.',
        },
        {
            icon: Users,
            title: 'Membership Management',
            description:
                'Easy onboarding and KYC verification. Member records, profiles, and digital ID management.',
        },
        {
            icon: BarChart3,
            title: 'Financial Analytics',
            description:
                'Automated financial reports and statements. Loan processing, approvals, and management tools.',
        },
        {
            icon: FileLock,
            title: 'Document Management',
            description:
                'Digital storage and sharing of cooperative documents with role-based access control.',
        },
        {
            icon: MessagesSquare,
            title: 'Communication Hub',
            description:
                'Announcements, notifications, and messaging for members. Discussion boards and voting tools.',
        },
        {
            icon: Puzzle,
            title: 'API & Integrations',
            description:
                'Developer API access for custom integrations. Seamless connection to third-party services.',
        },
        {
            icon: LifeBuoy,
            title: 'Support & Training',
            description:
                'Dedicated customer support via email and phone. Help center, FAQs, and user guides.',
        },
    ]

    return (
        <div className="py-12 px-4">
            <div className="absolute inset-0 -z-10 h-full w-full bg-radial-[ellipse_at_120%_90%] from-primary/20 via-background/0 to-background/0 to-10%" />

            <div className="max-w-5xl mx-auto">
                <h2 className="text-4xl font-extrabold text-foreground text-center mb-10">
                    Our Services
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <ServiceCard
                            description={service.description}
                            icon={service.icon}
                            key={index}
                            title={service.title}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default OurServices
