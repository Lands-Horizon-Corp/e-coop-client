'use client'

import { cn } from '@/helpers'

import {
    DotBigIcon,
    DotsHorizontalIcon,
    FacebookIcon,
    InstagramIcon,
    LinkedInIcon,
    PlusIcon,
} from '@/components/icons'
import Image from '@/components/image'
import Modal from '@/components/modals/modal'
import { Button } from '@/components/ui/button'

import { useModalState } from '@/hooks/use-modal-state'

import type { IClassProps } from '@/types'

import type { ILandsTeamMember } from '../../home.types'

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
    teamMember: ILandsTeamMember
} & IClassProps) => {
    const viewMoreModal = useModalState()

    return (
        <div
            className={cn(
                'group cursor-pointer relative overflow-hidden rounded-2xl bg-card border-0 hover:shadow-sm transition-all duration-500 delay-150',
                'h-80 sm:h-96 md:h-[400px]',
                className
            )}
            onClick={() => viewMoreModal.onOpenChange(!viewMoreModal.open)}
        >
            <Image
                className="object-cover absolute top-0 left-0 size-full transition-transform duration-300 group-hover:scale-105"
                src={image || '/placeholder.svg'}
            />

            <Button
                className={cn(
                    'size-fit p-2 absolute bg-secondary/40 backdrop-blur-sm group-hover:bg-primary z-10 rounded-full',
                    'top-3 right-3 sm:top-4 sm:right-4 md:top-5 md:right-5'
                )}
                size="icon"
                variant="secondary"
            >
                <PlusIcon className="size-4 group-hover:rotate-45 duration-200 ease-in-out" />
            </Button>

            <div className="absolute bottom-0 left-0 right-0">
                <div className="absolute pointer-events-none inset-0 z-0 bg-gradient-to-t from-popover via-background/40 to-transparent" />
                <div
                    className="backdrop-blur-sm inset-0 w-full z-0 absolute bottom-0 left-0"
                    style={{
                        maskImage:
                            'linear-gradient(to top, rgb(0, 0, 0) 25%, transparent)',
                    }}
                />
                <div
                    className={cn(
                        'relative z-10',
                        'p-3 sm:p-4 md:pt-4 md:px-4 md:pb-2'
                    )}
                >
                    <h3
                        className={cn(
                            'mb-1 font-semibold',
                            'text-lg sm:text-xl'
                        )}
                    >
                        {name}
                    </h3>
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
                    className={cn(
                        'outline-none',
                        'max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-5xl',
                        'p-0 gap-0 py-0',
                        'max-h-[85vh] sm:max-h-[80vh] md:max-h-[70vh]',
                        'flex flex-col md:flex-row',
                        className
                    )}
                    descriptionClassName="hidden"
                    showCloseButton
                    titleClassName="hidden"
                >
                    <div
                        className={cn(
                            'shrink-0',
                            // Mobile: full width with fixed height, Desktop: half width
                            'w-full h-48 sm:h-56 md:w-1/2 md:h-auto'
                        )}
                    >
                        <Image
                            className="object-cover size-full transition-transform duration-300 group-hover:scale-105"
                            src={image || '/placeholder.svg'}
                        />
                    </div>

                    <div
                        className={cn(
                            'flex-1 min-h-0 max-h-full overflow-auto space-y-5',
                            // Responsive padding
                            'p-4 sm:p-6 md:p-8'
                        )}
                    >
                        <h3
                            className={cn(
                                'mb-1 font-semibold',
                                'text-lg sm:text-xl'
                            )}
                        >
                            {name}
                        </h3>

                        <p className="text-xs text-muted-foreground mb-2">
                            <DotBigIcon className="inline text-primary" />{' '}
                            {position}
                        </p>

                        <p
                            className={cn(
                                'leading-relaxed text-muted-foreground mb-2',
                                'text-sm sm:text-base'
                            )}
                        >
                            {description}
                        </p>

                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground">
                                Socials
                            </p>
                            <div
                                className={cn(
                                    'flex gap-1',
                                    'flex-wrap sm:flex-nowrap'
                                )}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {instagramUrl && (
                                    <Button
                                        asChild
                                        className={cn(
                                            'text-muted-foreground/70 hover:text-fuchsia-300 hover:bg-foreground/20 transition-colors',
                                            'size-fit p-2 sm:p-3'
                                        )}
                                        size="icon"
                                        variant="ghost"
                                    >
                                        <a
                                            href={instagramUrl}
                                            rel="noopener noreferrer"
                                            target="_blank"
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
                                        asChild
                                        className={cn(
                                            'text-muted-foreground/70 hover:text-blue-300 hover:bg-foreground/20 transition-colors',
                                            'size-fit p-2 sm:p-3'
                                        )}
                                        size="icon"
                                        variant="ghost"
                                    >
                                        <a
                                            href={linkedInUrl}
                                            rel="noopener noreferrer"
                                            target="_blank"
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
                                        asChild
                                        className={cn(
                                            'text-muted-foreground/70 hover:text-blue-400 hover:bg-foreground/20 transition-colors',
                                            'size-fit p-2 sm:p-3'
                                        )}
                                        size="icon"
                                        variant="ghost"
                                    >
                                        <a
                                            href={facebookUrl}
                                            rel="noopener noreferrer"
                                            target="_blank"
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

export default TeamMemberCard
