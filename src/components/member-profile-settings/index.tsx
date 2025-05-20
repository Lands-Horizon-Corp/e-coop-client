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
            member_addresses: [
                {
                    id: 'a13c9302-4f1a-4e8b-9e8d-2ad49b637f9a',
                    member_profile_id: 'ef0329a6-b311-4ad5-9d6a-69d3b50223b7',
                    label: 'Home',
                    address: '123 Main Street, Westwood Village',
                    country_code: 'PH',
                    city: 'Quezon City',
                    postal_code: '1101',
                    province_state: 'Metro Manila',
                    barangay: 'Barangay Central',
                    landmark: 'Near City Hall',
                },
                {
                    id: 'f57de0b5-1f93-4b4b-a7e5-58a4f0e22e8d',
                    member_profile_id: 'b2d1b8e6-c3f1-4ad5-9e8b-1cfb9829c3c1',
                    label: 'Office',
                    address: 'Unit 45B, RCBC Plaza Tower 2',
                    country_code: 'PH',
                    city: 'Makati',
                    postal_code: '1226',
                    province_state: 'Metro Manila',
                    barangay: 'Barangay Bel-Air',
                    landmark: 'Near Ayala Avenue',
                },
            ],
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
            member_contact_number_references: [
                {
                    id: '7a5c7f92-301e-4d2d-b72e-0c7e894a6451',
                    member_profile_id: 'ef0329a6-b311-4ad5-9d6a-69d3b50223b7',

                    name: 'John Dela Cruz',
                    description: 'Emergency Contact',
                    contact_number: '+63 917 123 4567',
                    created_at: '2024-10-01T08:00:00Z',
                    updated_at: '2024-10-05T10:00:00Z',
                    created_by: 'admin_user_id',
                    updated_by: 'admin_user_id',
                },
                {
                    id: '75be72d7-c0bc-4148-9f88-ef3cc24b8ae2',
                    member_profile_id: 'ea94b02c-75e5-4eae-97cf-5a3c1e9ed9b4',
                    name: 'Maria Santos',
                    description: 'HR Manager at ABC Corp.',
                    contact_number: '+63 927 456 7890',
                    created_at: '2024-11-10T12:00:00Z',
                    updated_at: '2024-11-12T14:00:00Z',
                    created_by: 'admin_user_id',
                    updated_by: 'admin_user_id',
                },
            ],
            member_assets: [
                {
                    id: 'b1e7c8d2-4f3a-4e2e-9c1a-1a2b3c4d5e6f',
                    media_id: 'a2f8e7d6-5c4b-3a2e-8d1c-2b3a4c5d6e7f',
                    media: {
                        id: 'a2f8e7d6-5c4b-3a2e-8d1c-2b3a4c5d6e7f',
                        url: 'https://example.com/media/asset1.jpg',
                        download_url: 'https://i.redd.it/y3f72xvtbnub1.jpg',
                    },
                    member_profile_id: 'c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
                    branch_id: 'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a',
                    name: 'RAM Semi Truck',
                    entry_date: '2024-01-15',
                    description: 'A heavy-duty truck hauling containers.',
                    cost: 2410000,
                    created_at: '2024-01-16T10:00:00Z',
                    updated_at: '2024-01-16T10:00:00Z',
                    created_by: 'admin',
                    updated_by: 'admin',
                },
                {
                    id: 'e2f3a4b5-c6d7-8e9f-0a1b-2c3d4e5f6a7b',
                    media_id: 'b3c4d5e6-f7a8-9b0c-1d2e-3f4a5b6c7d8e',
                    media: {
                        id: 'b3c4d5e6-f7a8-9b0c-1d2e-3f4a5b6c7d8e',
                        url: 'https://example.com/media/asset2.jpg',
                        download_url:
                            'https://www.esquireme.com/wp-content/uploads/sites/9/cloud/2023/06/20/Range-Raptor-Fire_12914458.jpg',
                    },
                    member_profile_id: 'f4a5b6c7-d8e9-0a1b-2c3d-4e5f6a7b8c9d',
                    branch_id: 'a5b6c7d8-e9f0-1a2b-3c4d-5e6f7a8b9c0d',
                    name: 'Ford Raptor',
                    entry_date: '2023-11-20',
                    description: 'A modern 4x4 truck',
                    cost: 2000000,
                    created_at: '2023-11-21T09:30:00Z',
                    updated_at: '2023-11-21T09:30:00Z',
                    created_by: 'admin',
                    updated_by: 'admin',
                },
                {
                    id: 'e2f3a4b5-c6d7-8e9f-0a1b-2c3d4e5f6a7c',
                    media_id: 'b3c4d5e6-f7a8-9b0c-1d2e-3f4a5b6c7d8e',
                    media: {
                        id: 'b3c4d5e6-f7a8-9b0c-1d2e-3f4a5b6c7d8e',
                        url: 'https://example.com/media/asset2.jpg',
                        download_url:
                            'https://www.apple.com/newsroom/images/2023/09/apple-unveils-iphone-15-pro-and-iphone-15-pro-max/tile/Apple-iPhone-15-Pro-lineup-hero-230912.jpg.news_app_ed.jpg',
                    },
                    member_profile_id: 'f4a5b6c7-d8e9-0a1b-2c3d-4e5f6a7b8c9d',
                    branch_id: 'a5b6c7d8-e9f0-1a2b-3c4d-5e6f7a8b9c0d',
                    name: 'IPhone 15 Pro Max',
                    entry_date: '2023-11-20',
                    description:
                        'Flagship High performance, Elegant smartphone from Apple',
                    cost: 500000,
                    created_at: '2023-11-21T09:30:00Z',
                    updated_at: '2023-11-21T09:30:00Z',
                    created_by: 'admin',
                    updated_by: 'admin',
                },
            ],
            member_income: [
                {
                    id: 'a1b2c3d4-e5f6-7890-abcd-1234567890ab',
                    member_profile_id: '11111111-2222-3333-4444-555555555555',
                    member_profile: {
                        id: '11111111-2222-3333-4444-555555555555',
                        name: 'Juan Dela Cruz',
                    },
                    media_id: 'abcd1234-5678-90ef-abcd-1234567890ef',
                    media: {
                        id: 'abcd1234-5678-90ef-abcd-1234567890ef',
                        url: 'https://example.com/media/income1.jpg',
                    },
                    branch_id: '22222222-3333-4444-5555-666666666666',
                    branch: {
                        id: '22222222-3333-4444-5555-666666666666',
                        name: 'Central Branch',
                    },
                    name: 'Rice Sales',
                    amount: 120000,
                    release_date: '2024-03-01',
                    created_at: '2024-03-02T08:00:00Z',
                    updated_at: '2024-03-02T08:00:00Z',
                },
                {
                    id: 'b2c3d4e5-f6a7-8901-bcde-2345678901bc',
                    member_profile_id: '33333333-4444-5555-6666-777777777777',
                    member_profile: {
                        id: '33333333-4444-5555-6666-777777777777',
                        name: 'Maria Santos',
                    },
                    media_id: 'bcde2345-6789-01fa-bcde-2345678901fa',
                    media: {
                        id: 'bcde2345-6789-01fa-bcde-2345678901fa',
                        url: 'https://example.com/media/income2.jpg',
                    },
                    branch_id: '44444444-5555-6666-7777-888888888888',
                    branch: {
                        id: '44444444-5555-6666-7777-888888888888',
                        name: 'North Branch',
                    },
                    name: 'Vegetable Sales',
                    amount: 85000,
                    release_date: '2024-02-15',
                    created_at: '2024-02-16T09:30:00Z',
                    updated_at: '2024-02-16T09:30:00Z',
                },
                {
                    id: 'c3d4e5f6-a7b8-9012-cdef-3456789012cd',
                    member_profile_id: '55555555-6666-7777-8888-999999999999',
                    member_profile: {
                        id: '55555555-6666-7777-8888-999999999999',
                        name: 'Pedro Reyes',
                    },
                    media_id: 'cdef3456-7890-12ab-cdef-3456789012ab',
                    media: {
                        id: 'cdef3456-7890-12ab-cdef-3456789012ab',
                        url: 'https://example.com/media/income3.jpg',
                    },
                    branch_id: '66666666-7777-8888-9999-000000000000',
                    branch: {
                        id: '66666666-7777-8888-9999-000000000000',
                        name: 'South Branch',
                    },
                    name: 'Livestock Sales',
                    amount: 150000,
                    release_date: '2024-01-20',
                    created_at: '2024-01-21T10:15:00Z',
                    updated_at: '2024-01-21T10:15:00Z',
                },
            ],
            member_expenses: [
                {
                    id: 'e1f2a3b4-c5d6-7890-abcd-1234567890ef',
                    member_profile_id: '11111111-2222-3333-4444-555555555555',
                    branch_id: '22222222-3333-4444-5555-666666666666',
                    name: 'Fertilizer Purchase',
                    amount: 25000,
                    description:
                        'Purchased organic fertilizer for rice fields.',
                    date: '2024-03-10',
                    created_at: '2024-03-11T08:00:00Z',
                    updated_at: '2024-03-11T08:00:00Z',
                    created_by: 'admin',
                    updated_by: 'admin',
                },
                {
                    id: 'f3a4b5c6-d7e8-9012-bcde-2345678901ab',
                    member_profile_id: '33333333-4444-5555-6666-777777777777',
                    branch_id: '44444444-5555-6666-7777-888888888888',
                    name: 'Equipment Repair',
                    amount: 18000,
                    description: 'Repair cost for rice harvester.',
                    date: '2024-02-22',
                    created_at: '2024-02-23T09:30:00Z',
                    updated_at: '2024-02-23T09:30:00Z',
                    created_by: 'admin',
                    updated_by: 'admin',
                },
            ],
            member_government_benefits: [
                {
                    id: 'f1a2b3c4-d5e6-7890-abcd-1234567890ab',
                    member_profile_id: '11111111-2222-3333-4444-555555555555',
                    organization_id: '22222222-3333-4444-5555-666666666666',
                    branch_id: '33333333-4444-5555-6666-777777777777',
                    front_media: {
                        id: '44444444-5555-6666-7777-888888888888',
                        download_url:
                            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvkRcEbzTGfwfwU3lGbLwLaLeZ-Nez1y4ZbQ&s',
                    },
                    back_media: {
                        id: '55555555-6666-7777-8888-999999999999',
                        download_url:
                            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRssMGmskMEDHBlFqUL8TIZw2MQ0Xw4bgn6_Q&s',
                    },
                    name: 'PhilHealth',
                    country_code: 'PH',
                    value: 'PH123456789',
                    description:
                        'PhilHealth government health insurance benefit.',
                    created_at: '2024-03-01T10:00:00Z',
                    updated_at: '2024-03-01T10:00:00Z',
                },
                {
                    id: 'a2b3c4d5-e6f7-8901-bcde-2345678901bc',
                    member_profile_id: '66666666-7777-8888-9999-000000000000',
                    organization_id: '77777777-8888-9999-0000-111111111111',
                    branch_id: '88888888-9999-0000-1111-222222222222',
                    front_media: {
                        id: '99999999-0000-1111-2222-333333333333',
                        download_url:
                            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvkRcEbzTGfwfwU3lGbLwLaLeZ-Nez1y4ZbQ&s',
                    },
                    back_media: {
                        id: '00000000-1111-2222-3333-444444444444',
                        download_url:
                            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRssMGmskMEDHBlFqUL8TIZw2MQ0Xw4bgn6_Q&s',
                    },
                    name: 'SSS',
                    country_code: 'PH',
                    value: 'SSS-987654321',
                    description:
                        'Social Security System benefit for private employees.',
                    created_at: '2024-04-10T09:30:00Z',
                    updated_at: '2024-04-10T09:30:00Z',
                },
            ],
            member_joint_accounts: [
                {
                    id: '11111111-aaaa-bbbb-cccc-222222222222',
                    organization_id: 'org-1111-aaaa-bbbb-cccc-222222222222',
                    organization: {
                        id: 'org-1111-aaaa-bbbb-cccc-222222222222',
                        name: 'Sample Org',
                    },
                    branch_id: 'branch-1111-aaaa-bbbb-cccc-222222222222',
                    branch: {
                        id: 'branch-1111-aaaa-bbbb-cccc-222222222222',
                        name: 'Main Branch',
                    },
                    member_profile_id:
                        'profile-1111-aaaa-bbbb-cccc-222222222222',
                    member_profile: {
                        id: 'profile-1111-aaaa-bbbb-cccc-222222222222',
                        full_name: 'Juan Dela Cruz',
                        media: {
                            id: 'media-1111-aaaa-bbbb-cccc-222222222222',
                            download_url: '',
                        },
                    },
                    picture_media_id: 'media-1111-aaaa-bbbb-cccc-222222222222',
                    picture_media: {
                        id: 'media-1111-aaaa-bbbb-cccc-222222222222',
                        download_url:
                            'https://cdn.britannica.com/58/129958-050-C0EF01A4/Adolf-Hitler-1933.jpg',
                    },
                    signature_media_id:
                        'media-2222-aaaa-bbbb-cccc-222222222222',
                    signature_media: {
                        id: 'media-2222-aaaa-bbbb-cccc-222222222222',
                        download_url:
                            'https://www.gettysburgmuseumofhistory.com/wp-content/uploads/2023/11/A6B8D068-25EF-4473-9CE3-D30B7F146749-1024x414.webp',
                    },
                    description: 'Joint account for spouse',
                    first_name: 'Maria',
                    middle_name: 'Santos',
                    last_name: 'Dela Cruz',
                    full_name: 'Maria Santos Dela Cruz',
                    suffix: '',
                    birthday: '1990-05-10',
                    family_relationship: 'spouse',
                    created_at: '2024-01-01T10:00:00Z',
                    updated_at: '2024-01-01T10:00:00Z',
                    created_by: 'admin',
                    updated_by: 'admin',
                },
                {
                    id: '22222222-bbbb-cccc-dddd-333333333333',
                    organization_id: 'org-2222-bbbb-cccc-dddd-333333333333',
                    organization: {
                        id: 'org-2222-bbbb-cccc-dddd-333333333333',
                        name: 'Sample Org 2',
                    },
                    branch_id: 'branch-2222-bbbb-cccc-dddd-333333333333',
                    branch: {
                        id: 'branch-2222-bbbb-cccc-dddd-333333333333',
                        name: 'Branch 2',
                    },
                    member_profile_id:
                        'profile-2222-bbbb-cccc-dddd-333333333333',
                    picture_media_id: 'media-3333-bbbb-cccc-dddd-333333333333',
                    picture_media: {
                        id: 'media-3333-bbbb-cccc-dddd-333333333333',
                        download_url: 'https://i.redd.it/t20nfsv8guwe1.jpeg',
                    },
                    signature_media_id:
                        'media-4444-bbbb-cccc-dddd-333333333333',
                    signature_media: {
                        id: 'media-4444-bbbb-cccc-dddd-333333333333',
                        download_url:
                            'https://www.clipartkey.com/mpngs/m/196-1968543_signature-image-john-doe.png',
                    },
                    description: 'Joint account for child',
                    first_name: 'Juanito',
                    middle_name: 'Reyes',
                    last_name: 'Reyes',
                    full_name: 'Juanito Reyes Reyes',
                    suffix: '',
                    birthday: '2010-08-15',
                    family_relationship: 'child',
                    created_at: '2024-02-01T10:00:00Z',
                    updated_at: '2024-02-01T10:00:00Z',
                    created_by: 'admin',
                    updated_by: 'admin',
                },
            ],
            member_relative_accounts: [
                {
                    id: 'rel-1111-aaaa-bbbb-cccc-222222222222',
                    organization_id: 'org-1111-aaaa-bbbb-cccc-222222222222',
                    organization: {
                        id: 'org-1111-aaaa-bbbb-cccc-222222222222',
                        name: 'Sample Org',
                    },
                    branch_id: 'branch-1111-aaaa-bbbb-cccc-222222222222',
                    branch: {
                        id: 'branch-1111-aaaa-bbbb-cccc-222222222222',
                        name: 'Main Branch',
                    },
                    member_profile_id:
                        'profile-1111-aaaa-bbbb-cccc-222222222222',
                    member_profile: {
                        id: 'profile-1111-aaaa-bbbb-cccc-222222222222',
                        full_name: 'Juan Dela Cruz',
                        media: {
                            id: 'media-1111-aaaa-bbbb-cccc-222222222222',
                            download_url:
                                'https://cdn.britannica.com/58/129958-050-C0EF01A4/Adolf-Hitler-1933.jpg',
                        },
                    },
                    relative_member_profile_id:
                        'profile-3333-aaaa-bbbb-cccc-222222222222',
                    relative_member_profile: {
                        id: 'profile-3333-aaaa-bbbb-cccc-222222222222',
                        full_name: 'Jose Dela Cruz',
                        media: {
                            id: 'media-3333-aaaa-bbbb-cccc-222222222222',
                            download_url:
                                'https://i.redd.it/t20nfsv8guwe1.jpeg',
                        },
                    },
                    family_relationship: 'father',
                    description: 'Father of Juan',
                    created_at: '2024-01-01T10:00:00Z',
                    updated_at: '2024-01-01T10:00:00Z',
                    created_by: 'admin',
                    updated_by: 'admin',
                },
                {
                    id: 'rel-2222-bbbb-cccc-dddd-333333333333',
                    organization_id: 'org-2222-bbbb-cccc-dddd-333333333333',
                    organization: {
                        id: 'org-2222-bbbb-cccc-dddd-333333333333',
                        name: 'Sample Org 2',
                    },
                    branch_id: 'branch-2222-bbbb-cccc-dddd-333333333333',
                    branch: {
                        id: 'branch-2222-bbbb-cccc-dddd-333333333333',
                        name: 'Branch 2',
                    },
                    member_profile_id:
                        'profile-2222-bbbb-cccc-dddd-333333333333',
                    member_profile: {
                        id: 'profile-2222-bbbb-cccc-dddd-333333333333',
                        full_name: 'Pedro Reyes',
                        media: {
                            id: 'media-2222-bbbb-cccc-dddd-333333333333',
                            download_url: 'https://i.redd.it/ti3lgoce8wi91.jpg',
                        },
                    },
                    relative_member_profile_id:
                        'profile-4444-bbbb-cccc-dddd-333333333333',
                    relative_member_profile: {
                        id: 'profile-4444-bbbb-cccc-dddd-333333333333',
                        full_name: 'Maria Reyes',
                        status: 'verified',
                        media: {
                            id: 'media-4444-bbbb-cccc-dddd-333333333333',
                            download_url:
                                'https://i.redd.it/t20nfsv8guwe1.jpeg',
                        },
                        created_at: '2024-02-01T10:00:00Z',
                        updated_at: '2024-02-01T10:00:00Z',
                    },
                    family_relationship: 'mother',
                    description: 'Mother of Pedro',
                    created_at: '2024-02-01T10:00:00Z',
                    updated_at: '2024-02-01T10:00:00Z',
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
