import { ReactNode } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { cn } from '@/helpers'
import { IconType } from 'react-icons/lib'

import {
    BankIcon,
    CompressedFileFillIcon,
    CreditCardIcon,
    FolderFillIcon,
    UserCogIcon,
    UserIcon,
    UserPlusIcon,
    UserTagIcon,
    Users3FillIcon,
} from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { useSubscribe } from '@/hooks/use-pubsub'

import { IClassProps, TEntityId } from '@/types'

import { IMemberProfile, useGetMemberProfileById } from '../..'
import MemberCloseAccountBanner from './banners/member-closed-account-banner'
import MemberInfoBanner from './banners/member-info-banner'
import MemberFileArchiveDisplay from './displays/member-file-archives-display'
import MemberAccountsLoans from './member-accounts-loans'
import MemberComakers from './member-comakers'
import MemberFinancials from './member-financial-info'
import MemberMembershipInfo from './member-general-membership-info'
import MemberGovernmentBenefits from './member-government-benefits-info'
import MemberMediasInfo from './member-medias-info'
import MemberPersonalInfo from './member-personal-info'
import MemberRecruits from './recruited-members'

interface MemberOverallInfoProps {
    memberProfileId: TEntityId
    defaultMemberProfile?: IMemberProfile
    className?: string
}

const memberInfoTabs: {
    value: string
    title: string
    Icon?: IconType
    Component: (
        props: IClassProps & {
            profileId: TEntityId
            memberAccountingLedgerId?: TEntityId
            defaultData?: IMemberProfile
        }
    ) => ReactNode
}[] = [
    {
        value: 'accounts-loans',
        title: 'Accounts & Loans',
        Icon: BankIcon,
        Component: (props) => (
            <MemberAccountsLoans
                memberAccountingLedgerId={props.memberAccountingLedgerId!}
                memberProfileId={props.profileId}
                {...props}
            />
        ),
    },
    {
        value: 'general-infos',
        title: 'General/Membership',
        Icon: UserTagIcon,
        Component: (props) => <MemberMembershipInfo {...props} />,
    },
    {
        value: 'personal-infos',
        title: 'Personal Info',
        Icon: UserIcon,
        Component: (props) => <MemberPersonalInfo {...props} />,
    },
    {
        value: 'comakers',
        title: 'Comakers',
        Icon: Users3FillIcon,
        Component: (props) => <MemberComakers {...props} />,
    },

    {
        value: 'government-benefits',
        title: 'Government Benefits',
        Icon: UserCogIcon,
        Component: (props) => <MemberGovernmentBenefits {...props} />,
    },
    {
        value: 'medias',
        title: 'Files',
        Icon: FolderFillIcon,
        Component: (props) => <MemberMediasInfo {...props} />,
    },
    {
        value: 'archives',
        title: 'Archives',
        Icon: CompressedFileFillIcon,
        Component: (props) => <MemberFileArchiveDisplay {...props} />,
    },
    {
        value: 'financial',
        title: 'Financial',
        Icon: CreditCardIcon,
        Component: (props) => <MemberFinancials {...props} />,
    },
    {
        value: 'recruited-members',
        title: 'Recruited Members',
        Icon: UserPlusIcon,
        Component: (props) => <MemberRecruits {...props} />,
    },
]

const MemberOverallInfo = ({
    memberProfileId,
    className,
}: MemberOverallInfoProps) => {
    const queryClient = useQueryClient()

    const { data: memberProfile } = useGetMemberProfileById({
        id: memberProfileId,
    })

    useSubscribe(
        `member_profile.update.${memberProfileId}`,
        (newMemberProfileData) => {
            queryClient.setQueryData(
                ['member-profile', memberProfileId],
                newMemberProfileData
            )
        }
    )

    return (
        <div
            className={cn(
                'min-h-[80vh] min-w-[80vw] ${className} space-y-4 pt-4',
                className
            )}
        >
            {memberProfile && (
                <>
                    <MemberInfoBanner memberProfile={memberProfile} />
                    {memberProfile.is_closed && (
                        <MemberCloseAccountBanner
                            closeRemarks={memberProfile.member_close_remarks}
                            showRemarksList
                        />
                    )}
                </>
            )}
            <Tabs
                className="mt-2 flex-1 flex-col"
                defaultValue="accounts-loans"
            >
                <ScrollArea>
                    <TabsList className="mb-3 h-auto min-w-full justify-start gap-2 rounded-none border-b bg-transparent px-0 py-1 text-foreground">
                        {memberInfoTabs.map((tab) => (
                            <TabsTrigger
                                className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 after:duration-300 after:ease-in-out hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                                key={tab.value}
                                value={tab.value}
                            >
                                {tab.Icon && (
                                    <tab.Icon
                                        aria-hidden="true"
                                        className="-ms-0.5 me-1.5 opacity-60"
                                        size={16}
                                    />
                                )}
                                {tab.title}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
                {memberInfoTabs.map((tab) => (
                    <TabsContent asChild key={tab.value} value={tab.value}>
                        {tab.Component({ profileId: memberProfileId })}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}

export const SectionHeader = ({
    icon: Icon,
    title,
    subtitle,
}: {
    icon: IconType
    title: string
    subtitle?: string
}) => (
    <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="size-4 text-primary" />
        </div>
        <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            {subtitle && (
                <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
        </div>
    </div>
)

export default MemberOverallInfo

export const MemberOverallInfoModal = ({
    overallInfoProps,
    className,
    ...props
}: IModalProps & { overallInfoProps: MemberOverallInfoProps }) => {
    return (
        <Modal
            {...props}
            className={cn('!max-w-[90vw] px-6', className)}
            closeButtonClassName="top-1.5 right-1.5"
            descriptionClassName="hidden"
            titleClassName="hidden"
        >
            <MemberOverallInfo {...overallInfoProps} />
        </Modal>
    )
}
