import { cn } from '@/helpers/tw-utils'
import { Link } from '@tanstack/react-router'

import EcoopLogo from '@/components/ecoop-logo'

import { IClassProps } from '@/types'

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
