import { ReactNode } from 'react'
import { IconType } from 'react-icons/lib'
import { useQueryClient } from '@tanstack/react-query'

import {
    UserIcon,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import MemberCloseAccountBanner from '../member-infos/banners/member-closed-account-banner'

import { cn } from '@/lib'
import { useSubscribe } from '@/hooks/use-pubsub'
import { useInternalState } from '@/hooks/use-internal-state'
import { useMemberProfile } from '@/hooks/api-hooks/member/use-member-profile'

import { IClassProps, IMemberProfile, TEntityId } from '@/types'
import MemberProfilePersonalInfo from './settings-tab-pages/member-profile-personal-info'
import MembershipInfo from './settings-tab-pages/membership-info'
import MemberEducationalAttainment from './settings-tab-pages/member-educational-attainment'

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
        value: 'financial',
        title: 'Financial Info',
        Icon: HandCoinsIcon,
        Component: () => <div></div>,
    },
    {
        value: 'addresses-contacts',
        title: 'Addresses & Contacts',
        Icon: MapMarkedIcon,
        Component: () => <div></div>,
    },
    {
        value: 'account-relationships',
        title: 'Account Relationships',
        Icon: Users3Icon,
        Component: () => <div></div>,
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
        initialData: {
            first_name: 'Jerbee',
            middle_name: 'S',
            last_name: 'Paragas',
            full_name: 'Jerbeee S Paragas jerbas gasgasopg pasghi apsgasg ',
            is_micro_finance_member: false,
            is_mutual_fund_member: false,
            passbook: 'R-0001215',
            id: 'ef0329a6-b311-4ad5-9d6a-69d3b50223b7',
            old_reference_id: 'C-0000156',
            media: {
                id: 'ef2915125',
                download_url:
                    'http://minio:9000/my-bucket/20250514220627-189-user-14cb9d4f-9019-4606-9d27-b819372ea68e.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20250515%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250515T013309Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=e9922d0776dd9094cbffa340cb0c08a7ea1f2eb4d868727e5a1d4832b22fc1f5',
                file_name: '',
                file_type: '',
                bucket_name: '',
                created_at: '',
                file_size: 10,
                storage_key: '',
                url: '',
            },
            member_educational_attainment: [
                {
                    id: 'ef0329a6-b311-4ad5-9d6a-69d3b50223b7',
                    branch_id: 'ef0329a6-b311-4ad5-9d6a-69d3b50223b7',
                    branch: {
                        id: 'ef0329a6-b311-4ad5-9d6a-69d3b50223b7',
                        name: 'Main Branch',
                    },
                    member_profile_id: 'ef0329a6-b311-4ad5-9d6a-69d3b50223b7',
                    member_profile: {} as unknown as IMemberProfile,
                    name: 'Bachelor of Science in Computer Science',
                    school_name: 'University of Example',
                    school_year: 2022,
                    program_course: 'Computer Science',
                    educational_attainment: 'college graduate',
                    description: 'Graduated with honors.',
                    created_at: '2023-01-01T10:00:00Z',
                    updated_at: '2023-01-01T10:00:00Z',
                    created_by: 'admin',
                    updated_by: 'admin',
                },
                {
                    id: 'ef0329a6-b311-4ad5-9d6a-69d3b50223b6',
                    branch_id: 'ef0329a6-b311-4ad5-9d6a-69d3b50223b7',
                    branch: {
                        id: 'ef0329a6-b311-4ad5-9d6a-69d3b50223b7',
                        name: 'Main Branch',
                    },
                    member_profile_id: 'ef0329a6-b311-4ad5-9d6a-69d3b50223b7',
                    member_profile: {} as unknown as IMemberProfile,
                    name: 'High School Diploma',
                    school_name: 'Sample High School',
                    school_year: 2018,
                    program_course: 'General Curriculum',
                    educational_attainment: 'high school graduate',
                    description: undefined,
                    created_at: '2019-06-15T08:30:00Z',
                    updated_at: '2019-06-15T08:30:00Z',
                    created_by: 'admin',
                    updated_by: 'admin',
                },
            ],
        } as unknown as IMemberProfile,
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
                                className="relative w-full justify-start rounded-md text-muted-foreground after:absolute after:inset-y-0 after:left-0 after:w-0.5 after:content-[''] hover:text-foreground data-[state=active]:bg-popover data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
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
