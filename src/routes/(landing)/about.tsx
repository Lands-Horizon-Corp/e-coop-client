import { createFileRoute } from '@tanstack/react-router'

import { cn } from '@/helpers/tw-utils'

import PageContainer from '@/components/containers/page-container'
import {
    DotBigIcon,
    DotsHorizontalIcon,
    FacebookIcon,
    InstagramIcon,
    LinkedInIcon,
    PeopleGroupIcon,
    PlusIcon,
} from '@/components/icons'
import Image from '@/components/image'
import Modal from '@/components/modals/modal'
import { Button } from '@/components/ui/button'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps } from '@/types'

interface LandsTeamMember {
    name: string
    image: string
    position: string
    description: string
    linkedInUrl?: string
    instagramUrl?: string
    facebookUrl?: string
}
export const LANDS_TEAM: LandsTeamMember[] = [
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
        name: 'Nelma Dayao',
        image: '/pictures/team/nelma.webp',
        position: 'President & Co-Founder',
        description:
            'Dynamic executive and project management leader. Orchestrates the development and execution of strategic initiatives, particularly the cooperative project. Focuses on operational excellence, team synergy, and the realization of long-term company goals.',
        facebookUrl: 'https://www.facebook.com/nelma.dayao',
    },
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
        name: 'Jerbee Paragas',
        image: '/pictures/team/jerbee.webp',
        position: 'CTO (Chief Technology Officer)',
        description:
            'Technical strategist and senior frontend engineering expert. Leads API integration processes, enhances application performance, and architects frontend systems with modern frameworks to deliver seamless, responsive, and highly optimized user experiences.',
        linkedInUrl: 'https://www.linkedin.com/in/jerbee-paragas-8970b024b/',
        instagramUrl: 'https://www.instagram.com/jerbcxz/',
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
]

const AboutPage = () => {
    return (
        <PageContainer className="space-y-16 py-0 px-0 bg-background/70 font-inter">
            <div className="mt-3 flex lg:max-w-[1000px] px-8 sm:px-0 flex-col items-center justify-center space-y-8 md:mt-5 lg:mt-16 lg:space-y-12 xl:space-y-16">
                <h1 className="flex text-center justify-center items-center text-[min(52px,6vw)] font-bold leading-tight ">
                    <PeopleGroupIcon className="inline mr-4 text-muted-foreground" />
                    About Lands Horizon Corp
                </h1>
                <p className="max-w-5xl text-center text-[min(18px,4.5vw)] font-medium text-muted-foreground">
                    Lands Horizon Corp is dedicated to empowering cooperatives
                    with secure, innovative, and user-friendly digital solutions
                    through the{' '}
                    <span className="font-semibold text-foreground">
                        e-coop-suite
                    </span>{' '}
                    platform. We prioritize transparency, trust, and member
                    success in every service we provide.
                </p>
                <div className="relative mt-20 w-full">
                    <h3 className="text-[min(25px,3.5vw)] font-bold lg:h-5">
                        Get to know us
                    </h3>
                    <div className="h-fit w-full space-y-5 self-center">
                        <div>
                            <p className="mt-10 text-justify indent-8 text-[min(18px,4.5vw)] dark:text-[#cccccc] xl:leading-[41px]">
                                At Lands Horizon Corp, we are passionate about
                                empowering cooperatives and their members.
                                Through our innovative e-coop-suite platform, we
                                provide secure, transparent, and user-friendly
                                digital solutions to help cooperatives thrive in
                                the modern world.
                            </p>
                        </div>
                    </div>
                    <div className="h-fit w-full space-y-5 self-center">
                        <div>
                            <p className="mt-10 text-justify indent-8 text-[min(18px,4.5vw)] dark:text-[#cccccc] xl:leading-[41px]">
                                We believe in the values of cooperation,
                                integrity, and shared success. Our dedicated
                                team works tirelessly to deliver technology that
                                enhances financial inclusion, operational
                                efficiency, and community prosperity. Join us on
                                our journey to transform the cooperative
                                experience—where your growth, security, and
                                trust are always at the heart of what we do.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-background w-screen flex flex-col items-center">
                <div className="px-8 sm:px-24 py-16 space-y-4 max-w-6xl w-full">
                    <p className="text-5xl text-left">Meet Our Team</p>
                    <p className="text-muted-foreground">
                        Meet our team of experts dedicated to helping
                        cooperatives transition to modern, cloud-based
                        technologies.
                    </p>
                    <div className="grid grid-cols-3 py-8 gap-6">
                        {LANDS_TEAM.map((member) => (
                            <TeamMemberCard
                                key={`${member.name}${member.position}`}
                                teamMember={member}
                                className="even:mt-8 odd:mb-8"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </PageContainer>
    )
}

const TeamMemberCard = ({
    className,
    teamMember: {
        name,
        image,
        position,
        description,
        facebookUrl,
        linkedInUrl,
        instagramUrl,
    },
}: {
    teamMember: LandsTeamMember
} & IClassProps) => {
    const viewMoreModal = useModalState()

    return (
        <div
            onClick={() => viewMoreModal.onOpenChange(!viewMoreModal.open)}
            className={cn(
                'group cursor-pointer group relative overflow-hidden rounded-2xl bg-card border-0 hover:shadow-sm transition-all duration-500 delay-150',
                className
            )}
        >
            <Image
                src={image || '/placeholder.svg'}
                className="object-cover absolute top-0 left-0 size-full transition-transform duration-300 group-hover:scale-105"
            />
            <Button
                size="icon"
                variant="secondary"
                className="size-fit p-2 absolute bg-secondary/40 backdrop-blur-sm top-5 group-hover:bg-primary right-5 z-10 rounded-full"
            >
                <PlusIcon className="size-4 group-hover:rotate-45 duration-200 ease-in-out" />
            </Button>
            <div className="relative mt-[300px] pt-16">
                <div className="absolute pointer-events-none inset-0 z-0 bg-gradient-to-t from-popover via-background/40 to-transparent" />
                <div
                    className="backdrop-blur-sm inset-0 w-full z-0 absolute bottom-0 left-0"
                    style={{
                        maskImage:
                            'linear-gradient(to top, rgb(0, 0, 0) 25%, transparent)',
                    }}
                />
                <div className="pt-4 px-4 pb-2 relative z-10">
                    <h3 className="text-xl mb-1">{name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">
                        <DotBigIcon className="inline text-primary" />{' '}
                        {position}
                    </p>
                    <p className="text-muted-foreground text-xs hover:underline">
                        <DotsHorizontalIcon className="ml-1 inline" />
                    </p>
                </div>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
                <Modal
                    {...viewMoreModal}
                    showCloseButton
                    titleClassName="hidden"
                    descriptionClassName="hidden"
                    className={cn(
                        'max-w-4xl p-0 flex outline-none gap-x-0 py-0 max-h-[70vh]',
                        className
                    )}
                >
                    <div className="w-1/2 shrink-0">
                        <Image
                            src={image || '/placeholder.svg'}
                            className="object-cover size-full transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                    <div className="flex-1 min-h-0 max-h-full overflow-auto ecoop-scroll p-8 space-y-5">
                        <h3 className="text-xl mb-1">{name}</h3>
                        <p className="text-xs text-muted-foreground mb-2">
                            <DotBigIcon className="inline text-primary" />{' '}
                            {position}
                        </p>
                        <p className="text-sm leading-relaxed text-muted-foreground mb-2">
                            {description}
                        </p>
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground">
                                Socials
                            </p>
                            <div
                                className="flex gap-1"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {instagramUrl && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-fit p-2 text-muted-foreground/70 hover:text-fuchsia-300 hover:bg-foreground/20 transition-colors"
                                        asChild
                                    >
                                        <a
                                            href={instagramUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <InstagramIcon className="size-4" />
                                            <span className="sr-only">
                                                Instagram
                                            </span>
                                        </a>
                                    </Button>
                                )}
                                {linkedInUrl && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-fit p-2 text-muted-foreground/70 hover:text-blue-300 hover:bg-foreground/20 transition-colors"
                                        asChild
                                    >
                                        <a
                                            href={linkedInUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <LinkedInIcon className="size-4" />
                                            <span className="sr-only">
                                                LinkedIn
                                            </span>
                                        </a>
                                    </Button>
                                )}
                                {facebookUrl && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-fit p-2 text-muted-foreground/70 hover:text-blue-400 hover:bg-foreground/20 transition-colors"
                                        asChild
                                    >
                                        <a
                                            href={facebookUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <FacebookIcon className="size-4" />
                                            <span className="sr-only">
                                                Facebook
                                            </span>
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    )
}

export const Route = createFileRoute('/(landing)/about')({
    component: AboutPage,
})

export default AboutPage
