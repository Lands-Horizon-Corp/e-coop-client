import React from 'react'

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
        <Card className=" dark:text-white text-black hover:shadow-xl hover:scale-[1.03] transition-all duration-300">
            <CardHeader className="flex items-center justify-center">
                <div
                    className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center text-white`}
                >
                    {icon}
                </div>
            </CardHeader>
            <CardContent className="text-center space-y-2">
                <CardTitle className="text-xl font-semibold">{title}</CardTitle>
                <p className="dark:text-gray-400 text-gray-500 text-sm">{description}</p>
            </CardContent>
        </Card>
    )
}
const OurServices = () => {
    const services = [
        {
            title: 'Digital Cooperative Banking',
            description:
                'Secure online account management for members and cooperatives. Digital transactions, savings, loans, and payments. Real-time balance and transaction history.',
            bgColor: 'bg-blue-500',
            icon: (
                <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 10v11h18V10M3 10a2 2 0 012-2h14a2 2 0 012 2M3 10a2 2 0 002 2h14a2 2 0 002-2M7 4h10a2 2 0 012 2v2H5V6a2 2 0 012-2z"
                    ></path>
                </svg>
            ),
        },
        {
            title: 'Membership Management',
            description:
                'Easy onboarding and KYC (Know Your Customer) verification. Member records, profiles, and digital ID. Automated membership renewals and status tracking.',
            bgColor: 'bg-green-500',
            icon: (
                <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 20h-10a2 2 0 01-2-2V9a2 2 0 012-2h10a2 2 0 012 2v9a2 2 0 01-2 2zM12 11a3 3 0 100-6 3 3 0 000 6z"
                    ></path>
                </svg>
            ),
        },
        {
            title: 'Financial Tools and Analytics',
            description:
                'Automated financial reports and statements. Loan processing, approvals, and management. Budgeting, forecasting, and customizable analytics dashboards.',
            bgColor: 'bg-purple-500',
            icon: (
                <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    ></path>
                </svg>
            ),
        },
        {
            title: 'Secure Document Management',
            description:
                'Digital storage and sharing of cooperative documents. Role-based access and encrypted file storage. E-signature support for approvals and agreements.',
            bgColor: 'bg-red-500',
            icon: (
                <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.485L20.5 13"
                    ></path>
                </svg>
            ),
        },
        {
            title: 'Communication & Collaboration',
            description:
                'Announcements, notifications, and messaging for members. Discussion boards and voting tools for cooperative decisions. Event scheduling and reminders.',
            bgColor: 'bg-yellow-500',
            icon: (
                <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    ></path>
                </svg>
            ),
        },
        {
            title: 'API & Integrations',
            description:
                'Developer API access for custom integrations (with organization membership). Seamless connection to third-party apps and services.',
            bgColor: 'bg-teal-500',
            icon: (
                <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    ></path>
                </svg>
            ),
        },
        {
            title: 'Support & Training',
            description:
                'Dedicated customer support via email and phone. Help center, FAQs, and user guides. Training sessions for cooperative leaders and members.',
            bgColor: 'bg-orange-500',
            icon: (
                <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M18.364 5.636l-3.536 3.536m0 0A9 9 0 0112 15c-1.657 0-3-1.343-3-3s1.343-3 3-3c.518 0 1.01.157 1.432.447l3.536-3.536m-4.364 12.001h.01M12 21a9 9 100-18 9 9 0018 0z"
                    ></path>
                </svg>
            ),
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
