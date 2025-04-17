import {
    UserIcon,
    Users3Icon,
    ReportsIcon,
    SettingsIcon,
    DashboardIcon,
    FootstepsIcon,
    NotificationIcon,
    BuildingBranchIcon,
} from '@/components/icons'

export const employeeSidebarItems = [
    {
        text: 'Dashboard',
        url: '/employee/dashboard',
        Icon: DashboardIcon,
    },
    {
        text: 'Users',
        Icon: Users3Icon,
        baseUrl: '/employee/users',
        subItems: [
            {
                text: 'Members',
                url: '/members',
                Icon: UserIcon,
            },
        ],
    },
    {
        text: 'Branch',
        url: '/employee/branch',
        Icon: BuildingBranchIcon,
    },
    {
        text: 'Reports',
        url: '/employee/reports',
        Icon: ReportsIcon,
    },
    {
        text: 'Notifications',
        url: '/employee/notifications',
        Icon: NotificationIcon,
    },
    {
        text: 'Footsteps',
        url: '/employee/footsteps',
        Icon: FootstepsIcon,
    },
    {
        text: 'Profile',
        url: '/employee/profile',
        Icon: UserIcon,
    },
    {
        text: 'Settings',
        url: '/employee/settings',
        Icon: SettingsIcon,
    },
]

const EmployeeSidebar = () => {
    return
}

export default EmployeeSidebar
