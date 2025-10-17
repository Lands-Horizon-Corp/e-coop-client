import { SidebarLeftIcon, SidebarLeftOpenIcon } from '@/components/icons'

import { Button } from '../button'
import { useSidebar } from '../sidebar'

const AppSidebarToggle = () => {
    const { open, toggleSidebar } = useSidebar()

    return (
        <Button
            className="size-fit p-2 px-0"
            onClick={() => toggleSidebar()}
            variant="secondary"
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
