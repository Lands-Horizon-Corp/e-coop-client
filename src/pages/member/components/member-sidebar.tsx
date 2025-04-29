import {
    UserIcon,
    SettingsIcon,
    MessagesIcon,
    DashboardIcon,
    NotificationIcon,
} from '@/components/icons'

export const memberSidebarItems = [
    {
        text: 'Dashboard',
        url: '/member/dashboard',
        Icon: DashboardIcon,
    },
    {
        text: 'Profile',
        url: '/member/profile',
        Icon: UserIcon,
    },
    {
        text: 'Notifications',
        url: '/member/notifications',
        Icon: NotificationIcon,
    },
    {
        text: 'Messages',
        url: '/member/messages',
        Icon: MessagesIcon,
    },
    {
        text: 'Settings',
        url: '/member/settings',
        Icon: SettingsIcon,
    },
]

const MemberSidebar = () => {
    return
}

export default MemberSidebar
