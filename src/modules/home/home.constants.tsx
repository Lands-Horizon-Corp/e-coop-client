import { BankIcon, CodeIcon, Users3FillIcon } from '@/components/icons'

import { IFeatureCardData, IFeatureItem, ILandsTeamMember } from './home.types'

export const SERVICES: IFeatureItem[] = [
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

export const KEY_FEATURES: IFeatureCardData[] = [
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

export const COOPERATIVE_ADVANTAGES: IFeatureCardData[] = [
    {
        id: 'development-speed',
        title: 'Accelerated Development Time',
        description:
            'Leverage the power of a proven cooperative banking infrastructure trusted by financial institutions. Integrate once, launch your cooperative in days with our comprehensive suite of pre-built banking modules.',
        icon: <CodeIcon className="inline size-10 mr-2" />,
        imageSrc: '/pictures/home/save-time.svg',
        imageAlt: 'Fast development and deployment',
        useImageMatch: true,
    },
    {
        id: 'cost-reduction',
        title: 'Reduce Operational Costs',
        description:
            'Our flexible pricing plans offer the best cost-to-performance ratio for cooperative banking. Get access to the full banking suite and member management features. Scale up or down based on your cooperative size.',
        icon: <BankIcon className="inline size-10 mr-2" />,
        imageSrc: '/pictures/home/reduce-cost.svg',
        imageAlt: 'Cost reduction and flexible pricing',
        useImageMatch: true,
    },
    {
        id: 'enterprise-security',
        title: 'Enterprise-Grade Security',
        description:
            'We apply bank-level encryption to all member data, transaction processing, and financial records. Multi-layer security with encryption at rest, in transit, and in memory for all sensitive cooperative information.',
        icon: <Users3FillIcon className="inline size-10 mr-2" />,
        imageSrc: '/pictures/home/security.svg',
        imageAlt: 'Enterprise security for cooperatives',
        useImageMatch: true,
    },
    {
        id: 'unified-dashboard',
        title: 'All-in-One Cooperative Dashboard',
        description:
            'One comprehensive dashboard for all your cooperative operations. Manage members, process loans, track shares, generate financial reports, setup automated workflows, monitor transactions, and access detailed analytics.',
        icon: <CodeIcon className="inline size-10 mr-2" />,
        imageSrc: '/pictures/home/dashboard.svg',
        imageAlt: 'Unified cooperative management dashboard',
        useImageMatch: true,
    },
]

export const LANDS_TEAM: ILandsTeamMember[] = [
    {
        name: 'Sajiron Dayao',
        image: '/pictures/team/vpsanty.webp',
        position: 'CFO (Chief Financial Officer) & Investor',
        description:
            "Financial strategist and key investor ensuring the company's fiscal health and growth. Leads marketing initiatives, provides life coaching for team development, and oversees funding strategies and business sustainability.",
        facebookUrl: 'https://www.facebook.com/vpsantyofficial',
    },
    {
        name: 'Danilo Dayao',
        image: '/pictures/team/danilo.webp',
        position: 'Lead Marketing',
        description:
            "Danilo is the driving force behind the company's marketing vision, serving as the Lead Marketing Strategist. With a solid background in both marketing and business, he brings a strategic edge to every campaign. His experience enables him to effectively market software solutions tailored for cooperatives, bridging the gap between complex technology and practical value. Danilo leads brand positioning and customer engagement efforts that deliver lasting impact helping the brand grow with purpose and precision.",
        facebookUrl: 'https://www.facebook.com/danilo.dayao.12',
    },
    {
        name: 'Rojan Yepes',
        image: '/pictures/team/rojan.webp',
        position: 'CTO (Chief Technology Officer)',
        description:
            'Creative technologist and UI/UX leader. Heads the frontend team to craft innovative, user-centric designs while aligning visual identity with functional requirements. Drives UI/UX strategies ensuring intuitive and engaging digital experiences.',
        linkedInUrl: 'https://www.linkedin.com/in/rojan-yepes-5a8395254/',
        instagramUrl:
            'https://www.instagram.com/rojanyepes?utm_source=ig_web_button_share_sheet&igsh=MWFyYjIwYjZvb3gzMg==',
    },
    {
        name: 'Nelma Dayao',
        image: '/pictures/team/nelma.webp',
        position: 'President & Co-Founder',
        description:
            'Dynamic executive and project management leader. Orchestrates the development and execution of strategic initiatives, particularly the cooperative project. Focuses on operational excellence, team synergy, and the realization of long-term company goals.',
        facebookUrl: 'https://www.facebook.com/nelma.dayao',
    },
    {
        name: 'Zalven Lemuel S. Dayao',
        image: '/pictures/team/zalven.webp',
        position: 'CEO & Founder',
        description:
            "Principal architect driving the company's technological direction. Oversees the design and optimization of backend infrastructures, ensures robust database management systems, and spearheads initiatives for high-performance, scalable, and secure systems across the organization.",
        linkedInUrl: 'https://www.linkedin.com/in/zalven-dayao-293b2a22a/',
        instagramUrl: 'https://www.instagram.com/zalven_blue/',
    },
    {
        name: 'Jerbee Paragas',
        image: '/pictures/team/jerbee.webp',
        position: 'CTO (Chief Technology Officer)',
        description:
            'Technical strategist and senior frontend engineering expert. Leads API integration processes, enhances application performance, and architects frontend systems with modern frameworks to deliver seamless, responsive, and highly optimized user experiences.',
        linkedInUrl: 'https://www.linkedin.com/in/jerbee-paragas-8970b024b/',
        instagramUrl: 'https://www.instagram.com/jerbcxz/',
    },
]
