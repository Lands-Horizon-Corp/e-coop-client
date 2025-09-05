import { ReactNode } from 'react'

import { Link, useLocation } from '@tanstack/react-router'

import { cn } from '@/helpers/tw-utils'

import { CurlyBracketIcon } from '@/components/icons'
import NavAuthGroup from '@/components/nav/nav-components/nav-auth-group'
import NavEcoopLogo from '@/components/nav/nav-components/nav-ecoop-logo'
import NavThemeToggle from '@/components/nav/nav-components/nav-theme-toggle'
import NavContainer from '@/components/nav/nav-container'
import RootNav from '@/components/nav/root-nav'

type NavLink = {
    name: string
    path: string
    icon?: ReactNode
}

const navLinks: NavLink[] = [
    {
        name: 'Home',
        path: '/',
    },
    {
        name: 'About',
        path: '/about',
    },
    {
        name: 'Contact',
        path: '/contact',
    },
    {
        name: 'Subscription',
        path: '/subscription',
    },
    {
        name: 'FAQ',
        path: '/frequently-asked-questions',
    },
    {
        name: 'Developers',
        path: '/developers',
        icon: <CurlyBracketIcon />,
    },
]

const LandingNav = () => {
    const pathName = useLocation({
        select: (location) => location.pathname,
    })

    return (
        <RootNav>
            <NavEcoopLogo />
            <NavContainer>
                {navLinks.map((link, index) => {
                    const isCurrentTab = pathName === link.path
                    const isExternalLink = link.path?.charAt(0) !== '/'

                    return (
                        <div
                            key={index}
                            className="relative flex space-x-1 w-fit"
                        >
                            {isExternalLink ? (
                                <a
                                    href={link.path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(
                                        'scale-effects nav-links hidden items-center gap-x-2 font-normal sm:flex',
                                        isCurrentTab && 'font-bold'
                                    )}
                                >
                                    {link.name}
                                    <div className="self-center">
                                        {link.icon}
                                    </div>
                                </a>
                            ) : (
                                <Link
                                    className={cn(
                                        'scale-effects nav-links hidden items-center gap-x-2 font-normal sm:flex',
                                        isCurrentTab && 'font-bold'
                                    )}
                                    to={link.path}
                                >
                                    {link.name}
                                    <div className="self-center">
                                        {link.icon}
                                    </div>
                                </Link>
                            )}
                            {/* {isCurrentTab && ( */}
                            <div
                                className={cn(
                                    'absolute opacity-0 duration-500 -bottom-2 hidden h-[5px] w-0 !ml-0 rounded-full bg-primary sm:block',
                                    isCurrentTab && 'opacity-100 w-[20px]'
                                )}
                            ></div>
                            {/* )} */}
                        </div>
                    )
                })}
            </NavContainer>
            <NavContainer>
                <NavAuthGroup />
                <NavThemeToggle />
            </NavContainer>
        </RootNav>
    )
}

export default LandingNav
