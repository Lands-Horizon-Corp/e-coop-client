import { BankIcon, CodeIcon, Users3FillIcon } from '@/components/icons'

export const featureItems = [
    {
        icon: 'pictures/icons/wallet.svg',
        title: 'Account Wallets',
        alt: 'Account Wallets feature',
        description:
            'Manage multiple savings, checking, and investment accounts with real-time balance tracking and transaction history.',
    },
    {
        icon: 'pictures/icons/graph.svg',
        title: 'Forecasting',
        alt: 'Forecasting feature',
        description:
            'AI-powered financial forecasting using machine learning to predict trends and optimize cooperative growth.',
    },
    {
        icon: 'pictures/icons/bank.svg',
        title: 'Digital Banking',
        alt: 'Digital Banking feature',
        description:
            'Complete digital banking suite with transfers, payments, mobile check deposits, and bill pay services.',
    },
    {
        icon: 'pictures/icons/security.svg',
        title: 'Secure Cooperative',
        alt: 'Secure Cooperative feature',
        description:
            'Enterprise-grade security with encryption, multi-factor authentication, and regulatory compliance for cooperatives.',
    },
    {
        icon: 'pictures/icons/cpu.svg',
        title: 'High performance',
        alt: 'High performance processing feature',
        description:
            'Lightning-fast processing powered by Golang backend, handling millions of transactions with sub-second response times.',
    },
    {
        icon: 'pictures/icons/borrow.svg',
        title: 'Loans & Grants',
        alt: 'Loans & Grants feature',
        description:
            'Automated loan processing, grant management, and credit scoring with flexible terms tailored for cooperatives.',
    },
    {
        icon: 'pictures/icons/money.svg',
        title: 'Membership & Shares',
        alt: 'Membership & Shares feature',
        description:
            'Comprehensive member management system with share tracking, dividend calculations, and voting rights administration.',
    },
    {
        icon: 'pictures/icons/storage.svg',
        title: 'Data Storage & APIs',
        alt: 'Data Storage & APIs feature',
        description:
            'Secure cloud storage with RESTful APIs for seamless integration with existing systems and third-party applications.',
    },
]

export const featureCardsData = [
    {
        id: 'membership',
        title: 'Membership Management',
        description:
            'Easy onboarding and KYC verification. Member records, profiles, and digital ID. Automated membership renewals and status tracking.',
        icon: <Users3FillIcon className="inline size-5 mr-2" />,
        imageSrc: '/pictures/home/membership-poster.png',
        imageAlt: 'Membership management',
        useImageMatch: true,
    },
    {
        id: 'api',
        title: 'API & Integrations',
        description:
            'Developer API access for custom integrations (with organization membership). Seamless connection to third-party apps and services.',
        icon: <CodeIcon className="inline size-4 mr-2" />,
        imageSrc: '/pictures/home/api-poster.png',
        imageAlt: 'API & Integrations feature',
        useImageMatch: true,
    },
    {
        id: 'banking',
        title: 'Digital Cooperative Banking',
        description:
            'Secure online account management for members and cooperatives. Digital transactions, savings, loans, and payments. Real-time balance and transaction history.',
        icon: <BankIcon className="inline size-4 mr-2" />,
        imageSrc: '/pictures/home/bank-poster.png',
        imageAlt: 'Digital cooperative banking',
        useImageMatch: true,
    },
]
