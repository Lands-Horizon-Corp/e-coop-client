import { SidebarLeftIcon } from '@/components/icons'

import { Button } from '../button'
import { useSidebar } from '../sidebar'

const AppSidebarToggle = () => {
    const { toggleSidebar } = useSidebar()

    return (
        <Button
            className="size-fit p-2"
            onClick={() => toggleSidebar()}
            variant="secondary"
        >
            <SidebarLeftIcon />
        </Button>
    )
}

export default AppSidebarToggle
