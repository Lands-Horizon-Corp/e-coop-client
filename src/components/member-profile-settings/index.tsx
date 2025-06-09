import { ReactNode } from 'react'
import { IconType } from 'react-icons/lib'
import { useQueryClient } from '@tanstack/react-query'

import {
    UserIcon,
    IdCardIcon,
    Users3Icon,
    UserTagIcon,
    HandCoinsIcon,
    MapMarkedIcon,
    GraduationCapIcon,
} from '../icons'
import MemberProfileSettingsBanner, {
    MemberProfileSettingsBannerSkeleton,
} from './member-profile-settings-banner'
import { Separator } from '../ui/separator'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'
import MembershipInfo from './settings-tab-pages/membership-info'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import MemberFinancial from './settings-tab-pages/member-financial-info'
import MemberAddressContact from './settings-tab-pages/member-address-contact'
import MemberAccountRelationship from './settings-tab-pages/account-relationship'
import MemberGovernmentBenefits from './settings-tab-pages/member-government-benefits'
import MemberProfilePersonalInfo from './settings-tab-pages/member-profile-personal-info'
import MemberCloseAccountBanner from '../member-infos/banners/member-closed-account-banner'
import MemberEducationalAttainment from './settings-tab-pages/member-educational-attainment'

import { cn } from '@/lib'
import { useSubscribe } from '@/hooks/use-pubsub'
import { useInternalState } from '@/hooks/use-internal-state'
import { useMemberProfile } from '@/hooks/api-hooks/member/use-member-profile'

import { IClassProps, IMemberProfile, TEntityId } from '@/types'

const SettingsTabs: {
    value: string
    title: string
    Icon?: IconType
    Component: (
        props: IClassProps & {
            memberProfile: IMemberProfile
        }
    ) => ReactNode
}[] = [
    {
        value: 'personal-info',
        title: 'Identity / Personal Info',
        Icon: UserTagIcon,
        Component: (props) => <MemberProfilePersonalInfo {...props} />,
    },
    {
        value: 'membership',
        title: 'Membership',
        Icon: UserIcon,
        Component: (props) => <MembershipInfo {...props} />,
    },
    {
        value: 'education',
        title: 'Education',
        Icon: GraduationCapIcon,
        Component: (props) => <MemberEducationalAttainment {...props} />,
    },
    {
        value: 'government-benefits',
        title: 'Government Benefits / IDs',
        Icon: IdCardIcon,
        Component: (props) => <MemberGovernmentBenefits {...props} />,
    },
    {
        value: 'financial',
        title: 'Financial Info',
        Icon: HandCoinsIcon,
        Component: (props) => <MemberFinancial {...props} />,
    },
    {
        value: 'addresses-contacts',
        title: 'Addresses & Contacts',
        Icon: MapMarkedIcon,
        Component: (props) => <MemberAddressContact {...props} />,
    },
    {
        value: 'account-relationships',
        title: 'Account Relationships',
        Icon: Users3Icon,
        Component: (props) => <MemberAccountRelationship {...props} />,
    },
]

interface Props extends IClassProps {
    activeTab?: string
    memberProfileId: TEntityId
    onTabChange?: (settingsTab: string) => void
}

const MemberProfileSettings = ({
    activeTab,
    className,
    memberProfileId,
    onTabChange,
}: Props) => {
    const queryClient = useQueryClient()

    const { data: memberProfile, isPending } = useMemberProfile({
        profileId: memberProfileId,
    })

    useSubscribe(
        `member-profile.${memberProfileId}.update`,
        (newMemberProfileData) => {
            queryClient.setQueryData(
                ['member-profile', memberProfileId, 'current-user'],
                newMemberProfileData
            )
        }
    )

    const [value, handleChange] = useInternalState(
        activeTab,
        onTabChange,
        SettingsTabs[0].value
    )

    return (
        <div className={cn('w-full flex-1', className)}>
            <p className="my-4 text-muted-foreground">Edit Member Profile</p>
            <Tabs
                value={value}
                className="flex w-full gap-x-4"
                onValueChange={handleChange}
            >
                <ScrollArea>
                    <TabsList className="border-bx mb-3 h-auto min-w-full flex-col justify-start gap-x-2 gap-y-1 rounded-none bg-transparent px-0 py-1 text-foreground">
                        {!memberProfile && isPending && (
                            <MemberProfileSettingsBannerSkeleton />
                        )}
                        {memberProfile && (
                            <>
                                <MemberProfileSettingsBanner
                                    memberProfile={memberProfile}
                                />
                                {memberProfile.is_close && (
                                    <MemberCloseAccountBanner
                                        showRemarksList
                                        closeRemarks={
                                            memberProfile.member_close_remarks
                                        }
                                    />
                                )}
                            </>
                        )}
                        <Separator className="mb-2" />
                        {SettingsTabs.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="dara-[state=active]:border relative w-full justify-start rounded-md text-muted-foreground after:absolute after:inset-y-0 after:left-0 after:w-0.5 after:content-[''] hover:text-foreground data-[state=active]:bg-secondary data-[state=active]:shadow-none data-[state=active]:after:bg-primary dark:bg-transparent data-[state=active]:dark:bg-popover"
                            >
                                {tab.Icon && (
                                    <tab.Icon
                                        className={cn(
                                            '-ms-0.5 me-1.5 opacity-60 duration-300',
                                            tab.value === value && 'opacity-100'
                                        )}
                                        size={16}
                                        aria-hidden="true"
                                    />
                                )}
                                {tab.title}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <ScrollBar orientation="vertical" />
                </ScrollArea>
                <div className="tst flex-1 rounded-md bg-secondary p-4 text-start dark:bg-popover/70">
                    {SettingsTabs.map((tab) => (
                        <TabsContent value={tab.value} key={tab.value} asChild>
                            {tab.Component({
                                memberProfile:
                                    memberProfile as unknown as IMemberProfile,
                            })}
                        </TabsContent>
                    ))}
                </div>
            </Tabs>
        </div>
    )
}

export default MemberProfileSettings
