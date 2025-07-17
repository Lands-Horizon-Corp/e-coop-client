import { useQueryClient } from '@tanstack/react-query'
import { ReactNode } from 'react'

import { cn } from '@/lib'
import { IconType } from 'react-icons/lib'

import { useMemberProfile } from '@/hooks/api-hooks/member/use-member-profile'
import { useSubscribe } from '@/hooks/use-pubsub'

import { IClassProps } from '@/types'
import { IMemberProfile, TEntityId } from '@/types'

import {
    BankIcon,
    CreditCardIcon,
    FolderFillIcon,
    UserCogIcon,
    UserIcon,
    UserPlusIcon,
    UserTagIcon,
} from '../icons'
import Modal, { IModalProps } from '../modals/modal'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import MemberCloseAccountBanner from './banners/member-closed-account-banner'
import MemberInfoBanner from './banners/member-info-banner'
import MemberAccountsLoans from './member-accounts-loans'
import MemberFinancialInfo from './member-financial-info'
import MemberMembershipInfo from './member-general-membership-info'
import MemberGovernmentBenefits from './member-government-benefits-info'
import MemberMediasInfo from './member-medias-info'
import MemberPersonalInfo from './member-personal-info'
import RecruitedMembers from './recruited-members'

interface MemberOverallInfoProps {
    memberProfileId: TEntityId
    defaultMemberProfile?: IMemberProfile
}

const memberInfoTabs: {
    value: string
    title: string
    Icon?: IconType
    Component: (
        props: IClassProps & {
            profileId: TEntityId
            defaultData?: IMemberProfile
        }
    ) => ReactNode
}[] = [
    {
        value: 'accounts-loans',
        title: 'Accounts & Loans',
        Icon: BankIcon,
        Component: (props) => (
            <MemberAccountsLoans memberProfileId={props.profileId} {...props} />
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
        value: 'government-benefits',
        title: 'Government Benefits',
        Icon: UserCogIcon,
        Component: (props) => <MemberGovernmentBenefits {...props} />,
    },
    {
        value: 'medias',
        title: "Member Media's",
        Icon: FolderFillIcon,
        Component: (props) => <MemberMediasInfo {...props} />,
    },
    {
        value: 'financial',
        title: 'Financial',
        Icon: CreditCardIcon,
        Component: (props) => <MemberFinancialInfo {...props} />,
    },
    {
        value: 'recruited-members',
        title: 'Recruited Members',
        Icon: UserPlusIcon,
        Component: (props) => <RecruitedMembers {...props} />,
    },
]

const MemberOverallInfo = ({ memberProfileId }: MemberOverallInfoProps) => {
    const queryClient = useQueryClient()

    const { data: memberProfile } = useMemberProfile({
        profileId: memberProfileId,
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
        <div className="min-h-[80vh] min-w-[80vw] space-y-4 pt-4">
            {memberProfile && (
                <>
                    <MemberInfoBanner memberProfile={memberProfile} />
                    {memberProfile.is_closed && (
                        <MemberCloseAccountBanner
                            showRemarksList
                            closeRemarks={memberProfile.member_close_remarks}
                        />
                    )}
                </>
            )}
            <Tabs
                defaultValue="accounts-loans"
                className="mt-2 flex-1 flex-col"
            >
                <ScrollArea>
                    <TabsList className="mb-3 h-auto min-w-full justify-start gap-2 rounded-none border-b bg-transparent px-0 py-1 text-foreground">
                        {memberInfoTabs.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 after:duration-300 after:ease-in-out hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                            >
                                {tab.Icon && (
                                    <tab.Icon
                                        className="-ms-0.5 me-1.5 opacity-60"
                                        size={16}
                                        aria-hidden="true"
                                    />
                                )}
                                {tab.title}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
                {memberInfoTabs.map((tab) => (
                    <TabsContent value={tab.value} key={tab.value} asChild>
                        {tab.Component({ profileId: memberProfileId })}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}

export default MemberOverallInfo

export const MemberOverallInfoModal = ({
    overallInfoProps,
    className,
    ...props
}: IModalProps & { overallInfoProps: MemberOverallInfoProps }) => {
    return (
        <Modal
            {...props}
            titleClassName="hidden"
            descriptionClassName="hidden"
            closeButtonClassName="hidden"
            className={cn('!max-w-[90vw] p-3', className)}
        >
            <MemberOverallInfo {...overallInfoProps} />
        </Modal>
    )
}
