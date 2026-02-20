import { IMemberProfileDashboardSummaryResponse } from '@/modules/member-profile'

export const MOCK_MEMBER_PROFILE_DASHBOARD_SUMMARY: IMemberProfileDashboardSummaryResponse =
    {
        total_members: 480,
        total_male_members: 260,
        total_female_members: 220,

        member_type_counts: [
            {
                member_type_id: '9708d42d-a77d-40ae-8ba0-b19bbeeaee25',
                count: 150,
                member_type: {
                    id: '9708d42d-a77d-40ae-8ba0-b19bbeeaee25',
                    prefix: 'REG',
                    name: 'Regular',
                    description:
                        'Standard member with full rights and privileges.',
                },
            },
            {
                member_type_id: 'e32c24f8-501f-43bf-9186-c8fd666e3934',
                count: 90,
                member_type: {
                    id: 'e32c24f8-501f-43bf-9186-c8fd666e3934',
                    prefix: 'ASC',
                    name: 'Associate',
                    description:
                        'Member with limited rights, typically non-voting.',
                },
            },
            {
                member_type_id: '21a41184-88ae-4543-a253-c09f408cb36a',
                count: 70,
                member_type: {
                    id: '21a41184-88ae-4543-a253-c09f408cb36a',
                    prefix: 'SPD',
                    name: 'Special Depositor',
                    description:
                        'Member allowed to deposit but without full membership benefits.',
                },
            },
            {
                member_type_id: '507df175-8c4a-441c-9a8e-915ab24658ec',
                count: 60,
                member_type: {
                    id: '507df175-8c4a-441c-9a8e-915ab24658ec',
                    prefix: 'KID',
                    name: 'Kiddie Savers',
                    description:
                        'Savings account for children, usually managed by a guardian.',
                },
            },
            {
                member_type_id: '57c2077f-2b4f-4bc5-ac7f-fa5ff886a588',
                count: 50,
                member_type: {
                    id: '57c2077f-2b4f-4bc5-ac7f-fa5ff886a588',
                    prefix: 'YTH',
                    name: 'Youth Savers',
                    description: 'Savings account designed for youth members.',
                },
            },
            {
                member_type_id: '725bb026-20dc-479c-bbab-3c8c2c4ebbb7',
                count: 35,
                member_type: {
                    id: '725bb026-20dc-479c-bbab-3c8c2c4ebbb7',
                    prefix: 'CLS',
                    name: 'Closed',
                    description: 'Account officially closed.',
                },
            },
            {
                member_type_id: 'bb90905c-b5c4-44a8-ac0b-844bfe4055e3',
                count: 25,
                member_type: {
                    id: 'bb90905c-b5c4-44a8-ac0b-844bfe4055e3',
                    prefix: 'WDR',
                    name: 'Withdrawn',
                    description: 'Member has voluntarily withdrawn membership.',
                },
            },
        ],
    }
