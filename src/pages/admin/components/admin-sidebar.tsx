import {
    UserIcon,
    Users3Icon,
    SettingsIcon,
    FeedbackIcon,
    DashboardIcon,
    FootstepsIcon,
    NotificationIcon,
    BuildingBranchIcon,
} from '@/components/icons'

export const adminSidebarItems = [
    {
        text: 'Dashboard',
        url: '/admin/dashboard',
        Icon: DashboardIcon,
    },
    {
        text: 'Members Management',
        Icon: Users3Icon,
        baseUrl: '/admin/members-management',
        subItems: [
            {
                text: 'View Members',
                url: '/view-members',
                Icon: UserIcon,
            },
        ],
    },
    {
        text: 'Companies Management',
        Icon: BuildingBranchIcon,
        baseUrl: '/admin/companies-management',
        subItems: [
            {
                text: 'View Companies',
                url: '/view-companies',
                Icon: BuildingBranchIcon,
            },
        ],
    },
    {
        text: 'Footstep Tracking',
        url: '/admin/footstep-tracking',
        Icon: FootstepsIcon,
    },
    {
        text: 'Profile',
        url: '/admin/profile',
        Icon: UserIcon,
    },
    {
        text: 'Notifications',
        url: '/admin/notifications',
        Icon: NotificationIcon,
    },
    {
        text: 'Feedbacks',
        url: '/admin/feedbacks',
        Icon: FeedbackIcon,
    },
    {
        text: 'Settings',
        url: '/admin/settings',
        Icon: SettingsIcon,
    },
]

const AdminSidebar = () => {
    return
}

export default AdminSidebar
