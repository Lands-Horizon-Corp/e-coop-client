import { Button } from '../ui/button'
import { SidebarLeftIcon } from '../icons'
import { useSidebar } from '../ui/sidebar'

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
