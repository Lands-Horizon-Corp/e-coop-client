import React from 'react'

import {
    Banknote,
    BarChart3,
    FileLock,
    LifeBuoy,
    MessagesSquare,
    Puzzle,
    Users,
} from 'lucide-react'

import { GradientBackground } from '@/components/gradient-background/gradient-background'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type ServiceCardProps = {
    icon: React.ReactNode
    title: string
    description: string
    bgColor: string
}

const ServiceCard = ({
    icon,
    title,
    description,
    bgColor,
}: ServiceCardProps) => {
    return (
        <GradientBackground
            gradientOnly
            opacity={0.1}
            className=" hover:shadow-xl border-0 hover:scale-[1.03] transition-all duration-300"
        >
            <Card className=" dark:text-white h-full backdrop-blur-sm bg-transparent border-0 rounded-full text-black shadow-none">
                <CardHeader className="flex items-center justify-center">
                    <div
                        className={`w-16 h-16 ${bgColor} border-[.5px] border-primary rounded-full flex items-center justify-center text-white`}
                    >
                        {icon}
                    </div>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                    <CardTitle className="text-xl font-semibold">
                        {title}
                    </CardTitle>
                    <p className="dark:text-gray-400 text-gray-500 text-sm">
                        {description}
                    </p>
                </CardContent>
            </Card>
        </GradientBackground>
    )
}

const OurServices = () => {
    const services = [
        {
            title: 'Digital Cooperative Banking',
            description:
                'Secure online account management for members and cooperatives. Digital transactions, savings, loans, and payments. Real-time balance and transaction history.',
            bgColor: 'bg-primary/10',
            icon: <Banknote className="w-8 h-8 text-primary" />,
        },
        {
            title: 'Membership Management',
            description:
                'Easy onboarding and KYC (Know Your Customer) verification. Member records, profiles, and digital ID. Automated membership renewals and status tracking.',
            bgColor: 'bg-primary/10',
            icon: <Users className="w-8 h-8 text-primary" />,
        },
        {
            title: 'Financial Tools and Analytics',
            description:
                'Automated financial reports and statements. Loan processing, approvals, and management. Budgeting, forecasting, and customizable analytics dashboards.',
            bgColor: 'bg-primary/10',
            icon: <BarChart3 className="w-8 h-8 text-primary" />,
        },
        {
            title: 'Secure Document Management',
            description:
                'Digital storage and sharing of cooperative documents. Role-based access and encrypted file storage. E-signature support for approvals and agreements.',
            bgColor: 'bg-primary/10',
            icon: <FileLock className="w-8 h-8 text-primary" />,
        },
        {
            title: 'Communication & Collaboration',
            description:
                'Announcements, notifications, and messaging for members. Discussion boards and voting tools for cooperative decisions. Event scheduling and reminders.',
            bgColor: 'bg-primary/10',
            icon: <MessagesSquare className="w-8 h-8 text-primary" />,
        },
        {
            title: 'API & Integrations',
            description:
                'Developer API access for custom integrations (with organization membership). Seamless connection to third-party apps and services.',
            bgColor: 'bg-primary/10',
            icon: <Puzzle className="w-8 h-8 text-primary" />,
        },
        {
            title: 'Support & Training',
            description:
                'Dedicated customer support via email and phone. Help center, FAQs, and user guides. Training sessions for cooperative leaders and members.',
            bgColor: 'bg-primary/10',
            icon: <LifeBuoy className="w-8 h-8 text-primary" />,
        },
    ]

    return (
        <div className=" text-gray-100 font-inter antialiased">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <section className="mb-16">
                    <h2 className="text-4xl font-extrabold text-black dark:text-white text-center mb-10">
                        Our Services
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <ServiceCard
                                key={index}
                                icon={service.icon}
                                title={service.title}
                                description={service.description}
                                bgColor={service.bgColor}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}

export default OurServices
