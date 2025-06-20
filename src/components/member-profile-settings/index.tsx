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
import { ScrollArea, ScrollBar } from '../ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

import MemberProfileSettingsBanner, {
    MemberProfileSettingsBannerSkeleton,
} from './member-profile-settings-banner'
import MembershipInfo from './settings-tab-pages/membership-info'
import MemberUserAccount from './settings-tab-pages/member-user-account'
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
    {
        value: 'use-account',
        title: 'User Account',
        Icon: UserIcon,
        Component: (props) => <MemberUserAccount {...props} />,
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
        refetchOnWindowFocus: false,
        // initialData: {
        //     id: '1c7b72ef-6678-4607-9c65-77e889916ce8',
        //     created_at: '2025-06-16T18:26:56+08:00',
        //     created_by_id: '4ec1156b-2b46-4d05-9f90-ab7261ddb72c',
        //     created_by: {
        //         id: '4ec1156b-2b46-4d05-9f90-ab7261ddb72c',
        //         media_id: '8903fe0f-7362-4e6e-90f1-2b9105af7d1c',
        //         signature_media_id: null,
        //         signature_media: null,
        //         birthdate: '1990-01-01',
        //         user_name: 'sampleuser',
        //         description: null,
        //         first_name: 'Sample',
        //         middle_name: 'T.',
        //         last_name: 'User',
        //         full_name: 'Sample User',
        //         suffix: 'J',
        //         email: 'sample@example.com',
        //         is_email_verified: true,
        //         contact_number: '+639123456789',
        //         is_contact_verified: true,
        //         created_at: '2025-06-16T18:20:53+08:00',
        //         updated_at: '2025-06-16T18:20:53+08:00',
        //         qr_code: {
        //             data: '0CN2rvZeFLCmgbRM3VcMHRJDnhNVHlttZG9Cn+BXwABgcaLP3QOIeWNq9xjujNGWmmqOLDpBaZ1+nlQZMoQx/0wLZeMejLHsA2huAUakz/BnMc+3o7o0qMJIBzk5cvL0lm/dGyb7gz5fDIzznW8JCK54q/yl+/bgpHBj3XOpnSQkfpXlYwOwHQhB/OeoHcqem26b7HEw2t4m5iBcd0iyfgkR1UtcJsx513cTaMo8raF7UPwqv+DV8UtSQgqSN2KfeBCKwHlnr79gZw7xeeQVuXeRk44DJHxWhEC3TXrR+99ZzVIOoe0N8tuOJA==',
        //             type: 'user-qr',
        //         },
        //         footstep: [],
        //         generated_reports: [],
        //         notications: [],
        //     },
        //     updated_at: '2025-06-16T18:41:52+08:00',
        //     updated_by_id: '4ec1156b-2b46-4d05-9f90-ab7261ddb72c',
        //     updated_by: {
        //         id: '4ec1156b-2b46-4d05-9f90-ab7261ddb72c',
        //         media_id: '8903fe0f-7362-4e6e-90f1-2b9105af7d1c',
        //         signature_media_id: null,
        //         signature_media: null,
        //         birthdate: '1990-01-01',
        //         user_name: 'sampleuser',
        //         description: null,
        //         first_name: 'Sample',
        //         middle_name: 'T.',
        //         last_name: 'User',
        //         full_name: 'Sample User',
        //         suffix: 'J',
        //         email: 'sample@example.com',
        //         is_email_verified: true,
        //         contact_number: '+639123456789',
        //         is_contact_verified: true,
        //         created_at: '2025-06-16T18:20:53+08:00',
        //         updated_at: '2025-06-16T18:20:53+08:00',
        //         qr_code: {
        //             data: 'Q1ZJ7oAr2gwuIMuHKZrfgHJTvyqq3jxzd/ssiQ0o0nNRqOgc2Y7/55M/ODMfs9DZzaEm6NumiIjGjrovCv8kXeJlS92xNSrqpWBF/LcZzsM0ewxMSguJr3ex3IJPIkbtMIz3Ulvw6G95omatfePdfE9aoJmUTzIMWIUPlTz+mIuPD3D2HJi1Em1CRyhT86wwYeMISst+y4TXB/l+Z7p+EfR7exuOtpZZHqx9m08+e7pq+5tNJYg1pvReiHv07nI4hktIcOET0EzxZcsmvjXlU6nUcrTwrBB3jt8Dpx6BhjsMo0YoIfCSwKd+jA==',
        //             type: 'user-qr',
        //         },
        //         footstep: [],
        //         generated_reports: [],
        //         notications: [],
        //     },
        //     organization_id: '0f398437-34ad-43eb-991f-436ab583b249',
        //     organization: {
        //         id: '0f398437-34ad-43eb-991f-436ab583b249',
        //         created_at: '2025-06-16T18:20:59+08:00',
        //         created_by_id: '4ec1156b-2b46-4d05-9f90-ab7261ddb72c',
        //         updated_at: '2025-06-16T18:20:59+08:00',
        //         updated_by_id: '4ec1156b-2b46-4d05-9f90-ab7261ddb72c',
        //         name: 'Org 5 - Sample',
        //         address: '106 Main Street, Testville',
        //         email: 'org5@example.com',
        //         contact_number: '+63917001050005',
        //         description: 'A seeded example organization for testing.',
        //         color: '#ff582d',
        //         terms_and_conditions:
        //             'These are seeded terms and conditions...',
        //         privacy_policy: 'Seeded privacy policy content...',
        //         cookie_policy: 'Seeded cookie policy content...',
        //         refund_policy: 'Seeded refund policy content...',
        //         user_agreement: 'Seeded user agreement content...',
        //         media_id: '6bc7c68d-b7ce-439c-b83f-c223612f9600',
        //         subscription_plan_max_branches: 10,
        //         subscription_plan_max_employees: 100,
        //         subscription_plan_max_member_per_branch: 10,
        //         subscription_plan_id: '66ffbb3d-912f-423a-9f74-bea08c9a1ba2',
        //         subscription_start_date: '2025-06-16T18:20:59+08:00',
        //         subscription_end_date: '2025-07-16T18:20:59+08:00',
        //     },
        //     branch_id: 'a861da11-4b3d-4469-bb50-c9dc47e63722',
        //     branch: {
        //         id: 'a861da11-4b3d-4469-bb50-c9dc47e63722',
        //         created_at: '2025-06-16T18:20:59+08:00',
        //         created_by_id: '4ec1156b-2b46-4d05-9f90-ab7261ddb72c',
        //         updated_at: '2025-06-16T18:20:59+08:00',
        //         updated_by_id: '4ec1156b-2b46-4d05-9f90-ab7261ddb72c',
        //         media_id: '6bc7c68d-b7ce-439c-b83f-c223612f9600',
        //         type: 'main',
        //         name: 'Branch 3 - Org 5 - Sample',
        //         email: 'branch5.3@organization.com',
        //         country_code: 'PH',
        //         contact_number: '+63918000030005',
        //         address: 'Branch 3 Street, City',
        //         province: 'Test Province',
        //         city: 'Test City',
        //         region: 'Test Region',
        //         barangay: 'Test Barangay',
        //         postal_code: '11003',
        //     },
        //     media_id: '7da850f1-93bc-4867-9130-89283bd0fcf9',
        //     media: {
        //         id: '7da850f1-93bc-4867-9130-89283bd0fcf9',
        //         created_at: '2025-06-16T18:32:46+08:00',
        //         updated_at: '2025-06-16T18:32:46+08:00',
        //         file_name: '1750069966362119653-undefined.jpg',
        //         file_size: 180212,
        //         file_type: 'image/png',
        //         storage_key: '1750069966362119653-undefined.jpg',
        //         url: 'http://127.0.0.1:9000/lands-horizon/1750069966362119653-undefined.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=5pMiSk03Lt7yft5gXwe8L4EMXKXduE%2F20250616%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20250616T103246Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026X-Amz-Signature=6748f2d55a0351ff4ce2aa50fca587a3514938a56b7282ad98b38ea1617e8b68',
        //         key: '',
        //         download_url:
        //             'http://127.0.0.1:9000/lands-horizon/1750069966362119653-undefined.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=5pMiSk03Lt7yft5gXwe8L4EMXKXduE%2F20250617%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20250617T073801Z\u0026X-Amz-Expires=3600\u0026X-Amz-SignedHeaders=host\u0026X-Amz-Signature=3938928862e189a70c5de0c6de89e3890a71590e404631f87e74e4cac7867e65',
        //         bucket_name: 'lands-horizon',
        //         status: 'comppleted',
        //         progress: 100,
        //     },
        //     signature_media_id: '43c4f1c8-24bf-4946-9257-0d3c9d5e3735',
        //     signature_media: {
        //         id: '43c4f1c8-24bf-4946-9257-0d3c9d5e3735',
        //         created_at: '2025-06-16T18:33:22+08:00',
        //         updated_at: '2025-06-16T18:33:22+08:00',
        //         file_name:
        //             '1750070002207203147-SIGNATURE_PAD_SIGN_20250616_183321',
        //         file_size: 8607,
        //         file_type: 'image/png',
        //         storage_key:
        //             '1750070002207203147-SIGNATURE_PAD_SIGN_20250616_183321',
        //         url: 'http://127.0.0.1:9000/lands-horizon/1750070002207203147-SIGNATURE_PAD_SIGN_20250616_183321?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=5pMiSk03Lt7yft5gXwe8L4EMXKXduE%2F20250616%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20250616T103322Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026X-Amz-Signature=8fc4bf0e1e6f306af439d0b0a9c23f53328194acb10ca1ad46c01be1c518707c',
        //         key: '',
        //         download_url:
        //             'http://127.0.0.1:9000/lands-horizon/1750070002207203147-SIGNATURE_PAD_SIGN_20250616_183321?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=5pMiSk03Lt7yft5gXwe8L4EMXKXduE%2F20250617%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20250617T073801Z\u0026X-Amz-Expires=3600\u0026X-Amz-SignedHeaders=host\u0026X-Amz-Signature=3368d4e422cf7cfc1d70234307adb4397e5bbbcfdd3ab5fec2b45bbe66caaaa6',
        //         bucket_name: 'lands-horizon',
        //         status: 'comppleted',
        //         progress: 100,
        //     },
        //     member_type_id: 'd54e3417-21a7-4c2d-97f7-55de99d09895',
        //     member_type: {
        //         id: 'd54e3417-21a7-4c2d-97f7-55de99d09895',
        //         created_at: '2025-06-16T18:20:59+08:00',
        //         created_by_id: '4ec1156b-2b46-4d05-9f90-ab7261ddb72c',
        //         updated_at: '2025-06-16T18:20:59+08:00',
        //         updated_by_id: '4ec1156b-2b46-4d05-9f90-ab7261ddb72c',
        //         organization_id: '0f398437-34ad-43eb-991f-436ab583b249',
        //         branch_id: 'a861da11-4b3d-4469-bb50-c9dc47e63722',
        //         prefix: 'NEW',
        //         name: 'New',
        //         description: 'Recently registered member, no activity yet.',
        //     },
        //     member_gender_id: '07505d06-74b0-4b0b-8ad2-1fe735581184',
        //     member_gender: {
        //         id: '07505d06-74b0-4b0b-8ad2-1fe735581184',
        //         created_at: '2025-06-16T18:20:59+08:00',
        //         created_by_id: '4ec1156b-2b46-4d05-9f90-ab7261ddb72c',
        //         updated_at: '2025-06-16T18:20:59+08:00',
        //         updated_by_id: '4ec1156b-2b46-4d05-9f90-ab7261ddb72c',
        //         organization_id: '0f398437-34ad-43eb-991f-436ab583b249',
        //         branch_id: 'a861da11-4b3d-4469-bb50-c9dc47e63722',
        //         name: 'Female',
        //         description: 'Identifies as female.',
        //     },
        //     member_occupation_id: '18df4cd0-db86-4f84-924e-eca814b1aa0e',
        //     member_occupation: {
        //         id: '18df4cd0-db86-4f84-924e-eca814b1aa0e',
        //         created_at: '2025-06-16T18:20:59+08:00',
        //         created_by_id: '4ec1156b-2b46-4d05-9f90-ab7261ddb72c',
        //         updated_at: '2025-06-16T18:20:59+08:00',
        //         updated_by_id: '4ec1156b-2b46-4d05-9f90-ab7261ddb72c',
        //         organization_id: '0f398437-34ad-43eb-991f-436ab583b249',
        //         branch_id: 'a861da11-4b3d-4469-bb50-c9dc47e63722',
        //         name: 'Fisherfolk',
        //         description: 'Involved in fishing and aquaculture activities.',
        //     },
        //     user_id: 'b9a7b0e2-3d74-438e-9e60-8d4b5c2e394a',
        //     user: {
        //         id: 'b9a7b0e2-3d74-438e-9e60-8d4b5c2e394a',
        //         media_id: '0cdaa8a9-1ccc-4f5a-9b9b-0d6a1d1bfa21',
        //         media: {
        //             id: '0cdaa8a9-1ccc-4f5a-9b9b-0d6a1d1bfa21',
        //             url: 'https://example.com/media/user-profile.jpg',
        //             type: 'image/jpeg',
        //         },
        //         api_key: '6d8e3aad-0955-4d1b-84c9-1ec46d771d3b',
        //         password: 'hashed_password_value',
        //         birthdate: '1992-03-12T00:00:00.000Z',
        //         user_name: 'janedoe92',
        //         first_name: 'Jane',
        //         middle_name: 'Marie',
        //         last_name: 'Doe',
        //         full_name: 'Jane Marie Doe',
        //         suffix: 'Jr.',
        //         email: 'jane.doe@example.com',
        //         is_email_verified: true,
        //         type: 'admin',
        //         contact_number: '+1234567890',
        //         is_contact_verified: false,
        //         qr_code: {
        //             result: 'user:b9a7b0e2-3d74-438e-9e60-8d4b5c2e394a',
        //             type: 'user-qr',
        //         },
        //         created_at: '2025-06-15T09:30:00.000Z',
        //         updated_at: '2025-06-16T10:15:00.000Z',
        //         created_by: 'system',
        //         updated_by: 'system',
        //     },
        //     is_closed: false,
        //     is_mutual_fund_member: true,
        //     is_micro_finance_member: true,
        //     first_name: 'Johnny',
        //     middle_name: 'SAYRE',
        //     last_name: 'DVB',
        //     full_name: 'Johnny SAYRE DVB As',
        //     suffix: 'As',
        //     birthdate: '2025-06-16',
        //     status: 'for review',
        //     description: '\u003cp\u003easdasda\u003c/p\u003e',
        //     notes: '\u003cp\u003eTest Note\u003c/p\u003e',
        //     contact_number: '+639997654876',
        //     old_reference_id: '',
        //     passbook: 'XAF',
        //     business_address: 'Canlaon St.',
        //     business_contact_number: 'business@gmail.com',
        //     civil_status: 'single',
        // } as unknown as IMemberProfile,
    })

    useSubscribe(
        `member-profile.${memberProfileId}.update`,
        (newMemberProfileData) => {
            queryClient.setQueryData(
                ['member-profile', memberProfileId],
                newMemberProfileData
            )
        }
    )

    const [value, handleChange] = useInternalState(
        SettingsTabs[0].value,
        activeTab,
        onTabChange
    )

    return (
        <div className={cn('w-full flex-1 space-y-4', className)}>
            <p className="my-4 text-muted-foreground">Edit Member Profile</p>
            {!memberProfile && isPending && (
                <MemberProfileSettingsBannerSkeleton />
            )}
            {memberProfile && (
                <>
                    <MemberProfileSettingsBanner
                        memberProfile={memberProfile}
                    />
                    {memberProfile.is_closed && (
                        <MemberCloseAccountBanner
                            showRemarksList
                            closeRemarks={memberProfile.member_close_remarks}
                        />
                    )}
                </>
            )}
            {/* <Separator className="mb-2" /> */}
            <Tabs
                value={value}
                className="flex w-full gap-x-4"
                onValueChange={handleChange}
            >
                <ScrollArea>
                    <TabsList className="border-bx mb-3 h-auto min-w-full flex-col justify-start gap-x-2 gap-y-1 rounded-none bg-transparent px-0 py-1 text-foreground">
                        {SettingsTabs.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="dara-[state=active]:border relative w-full justify-start rounded-md from-primary/20 to-transparent text-muted-foreground after:absolute after:inset-y-0 after:left-0 after:w-0.5 after:content-[''] hover:text-foreground data-[state=active]:bg-secondary data-[state=active]:bg-gradient-to-r data-[state=active]:shadow-none data-[state=active]:after:bg-primary dark:bg-transparent"
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
                    {memberProfile &&
                        SettingsTabs.map((tab) => (
                            <TabsContent
                                value={tab.value}
                                key={tab.value}
                                asChild
                            >
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
