import { useEffect, useState } from 'react'

import { Outlet, createFileRoute } from '@tanstack/react-router'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import TimeMachineTimeStatusBar from '@/modules/user-organization/components/time-machine-time-status-bar'
import GlobalHotkeysProvider from '@/providers/global-hotkeys-provider'
import { motion } from 'framer-motion'

import { CursorFillIcon } from '@/components/icons'
// import { CursorFillIcon } from '@/components/icons'
import UserNav from '@/components/nav/navs/user-nav'
import OrgBranchSidebar from '@/components/sidebar/org-branch-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import AuthGuard from '@/components/wrappers/auth-guard'
import OrgBranchUrlGuard from '@/components/wrappers/org-branch-guard'

export const Route = createFileRoute('/org/$orgname/branch/$branchname')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <AuthGuard>
            {/* <CursorFollow /> */}
            <OrgBranchUrlGuard>
                <SidebarProvider>
                    <OrgBranchSidebar />
                    <GlobalHotkeysProvider />
                    <SidebarInset className="ecoop-scroll min-h-screen max-h-screen w-full overflow-y-auto">
                        <UserNav className="sticky top-0 z-50 bg-background" />
                        <main className="flex-1">
                            <Outlet />
                        </main>
                        <TimeMachineTimeStatBar />
                    </SidebarInset>
                </SidebarProvider>
            </OrgBranchUrlGuard>
        </AuthGuard>
    )
}

export const CursorFollow = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY })
        }

        window.addEventListener('mousemove', updateMousePosition)

        return () => {
            window.removeEventListener('mousemove', updateMousePosition)
        }
    }, [])

    return (
        <motion.div
            animate={{
                x: mousePosition.x - 12,
                y: mousePosition.y - 12,
            }}
            className="fixed pointer-events-none z-9999 size-2 translate-y-full translate-x-full mix-blend-difference"
            transition={{
                type: 'spring',
                stiffness: 500,
                damping: 28,
                mass: 0.5,
            }}
        >
            <CursorFillIcon className=" -rotate-80" />
        </motion.div>
    )
}

const TimeMachineTimeStatBar = () => {
    const {
        currentAuth: {
            user_organization: { time_machine_time },
        },
    } = useAuthUserWithOrgBranch()

    if (!time_machine_time) return null

    return (
        <div className="sticky bottom-0 left-0 w-full">
            <div className="absolute pointer-events-none w-full top-0.5 z-5 h-16 from-40% -translate-y-full bg-linear-to-t from-primary/10 to-transparent" />
            <TimeMachineTimeStatusBar
                className="z-10"
                timeMachineTime={time_machine_time}
            />
        </div>
    )
}
