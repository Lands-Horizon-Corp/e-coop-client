import { ReactNode, useState } from 'react'

import { Link, useLocation } from '@tanstack/react-router'

import { cn } from '@/helpers/tw-utils'
import { HiBars3 } from 'react-icons/hi2'

import NavAuthGroup from '@/components/nav/nav-components/nav-auth-group'
import NavEcoopLogo from '@/components/nav/nav-components/nav-ecoop-logo'
import NavThemeToggle from '@/components/nav/nav-components/nav-theme-toggle'
import NavContainer from '@/components/nav/nav-container'
import RootNav from '@/components/nav/root-nav'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'

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
]

const LandingNav = () => {
    const [isOpen, setIsOpen] = useState(false)
    const pathName = useLocation({
        select: (location) => location.pathname,
    })

    const handleLinkClick = () => {
        setIsOpen(false)
    }

    return (
        <RootNav>
            <NavEcoopLogo />

            {/* Desktop Navigation */}
            <NavContainer>
                {navLinks.map((link, index) => {
                    const isCurrentTab = pathName === link.path
                    const isExternalLink = link.path?.charAt(0) !== '/'

                    return (
                        <div
                            className="relative flex space-x-1 w-fit"
                            key={index}
                        >
                            {isExternalLink ? (
                                <a
                                    className={cn(
                                        'scale-effects nav-links hidden items-center gap-x-2 font-normal sm:flex',
                                        isCurrentTab && 'font-bold'
                                    )}
                                    href={link.path}
                                    rel="noopener noreferrer"
                                    target="_blank"
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
                            {/* Desktop active indicator */}
                            <div
                                className={cn(
                                    'absolute opacity-0 duration-500 -bottom-2 hidden h-[5px] w-0 !ml-0 rounded-full bg-primary sm:block',
                                    isCurrentTab && 'opacity-100 w-[20px]'
                                )}
                            ></div>
                        </div>
                    )
                })}
            </NavContainer>

            {/* Mobile Navigation */}
            <div className="sm:hidden">
                <Sheet onOpenChange={setIsOpen} open={isOpen}>
                    <SheetTrigger asChild>
                        <button
                            aria-label="Open mobile menu"
                            className="p-2 rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <HiBars3 className="w-6 h-6" />
                        </button>
                    </SheetTrigger>
                    <SheetContent
                        className="w-[300px] sm:w-[400px]"
                        side="right"
                    >
                        <SheetHeader>
                            <SheetTitle>Navigation</SheetTitle>
                        </SheetHeader>
                        <div className="flex flex-col gap-4 mt-6">
                            {navLinks.map((link, index) => {
                                const isCurrentTab = pathName === link.path
                                const isExternalLink =
                                    link.path?.charAt(0) !== '/'

                                return (
                                    <div key={index}>
                                        {isExternalLink ? (
                                            <a
                                                className={cn(
                                                    'flex items-center gap-x-3 p-3  font-medium transition-colors hover:bg-muted',
                                                    isCurrentTab &&
                                                        'bg-primary/10 text-primary font-bold'
                                                )}
                                                href={link.path}
                                                onClick={handleLinkClick}
                                                rel="noopener noreferrer"
                                                target="_blank"
                                            >
                                                {link.icon && (
                                                    <div className="self-center">
                                                        {link.icon}
                                                    </div>
                                                )}
                                                {link.name}
                                            </a>
                                        ) : (
                                            <SheetClose asChild>
                                                <Link
                                                    className={cn(
                                                        'flex items-center gap-x-3 p-3 font-medium transition-colors hover:bg-muted',
                                                        isCurrentTab &&
                                                            'bg-primary/10 text-primary font-bold'
                                                    )}
                                                    onClick={handleLinkClick}
                                                    to={link.path}
                                                >
                                                    {link.icon && (
                                                        <div className="self-center">
                                                            {link.icon}
                                                        </div>
                                                    )}
                                                    {link.name}
                                                </Link>
                                            </SheetClose>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Auth and Theme */}
            <NavContainer>
                <NavAuthGroup />
                <NavThemeToggle />
            </NavContainer>
        </RootNav>
    )
}

export default LandingNav
