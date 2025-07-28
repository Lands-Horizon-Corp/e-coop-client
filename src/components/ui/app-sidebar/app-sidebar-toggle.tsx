import { SidebarLeftIcon } from '@/components/icons'

import { Button } from '../button'
import { useSidebar } from '../sidebar'

const AppSidebarToggle = () => {
    const { toggleSidebar } = useSidebar()

    return (
        <Button
            onClick={() => toggleSidebar()}
            variant="secondary"
            className="size-fit p-2"
        >
            <SidebarLeftIcon />
        </Button>
    )
}

export default AppSidebarToggle
