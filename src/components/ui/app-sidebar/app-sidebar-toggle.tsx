import { SidebarLeftIcon, SidebarLeftOpenIcon } from '@/components/icons'

import { Button } from '../button'
import { useSidebar } from '../sidebar'

const AppSidebarToggle = () => {
    const { open, toggleSidebar } = useSidebar()

    return (
        <Button
            hoverVariant="primary"
            onClick={() => toggleSidebar()}
            size="icon-sm"
            variant="outline"
        >
            {open ? (
                <SidebarLeftOpenIcon className="animate-in fade-in-30 duration-500" />
            ) : (
                <SidebarLeftIcon className="animate-in fade-in-30 duration-500" />
            )}
        </Button>
    )
}

export default AppSidebarToggle
