import { Link } from '@tanstack/react-router'

import { cn } from '@/lib'
import { IClassProps } from '@/types'
import EcoopLogo from '@/components/ecoop-logo'

interface Props extends IClassProps {
    linkUrl?: string
}

const NavEcoopLogo = ({ linkUrl = '/', className }: Props) => {
    return (
        <Link to={linkUrl}>
            <EcoopLogo className={cn('size-[46px]', className)} />
        </Link>
    )
}

export default NavEcoopLogo
