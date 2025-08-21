import { Link, useParams, useRouter } from '@tanstack/react-router'
import { useMemo } from 'react'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'

import EcoopLogo from '@/components/ecoop-logo'
import ActionTooltip from '@/components/tooltips/action-tooltip'
import AppSidebarItem from '@/components/ui/app-sidebar/app-sidebar-item'
import AppSidebarQruickNavigate from '@/components/ui/app-sidebar/app-sidebar-quick-navigate'
import AppSidebarUser from '@/components/ui/app-sidebar/app-sidebar-user'
import { flatSidebarGroupItem } from '@/components/ui/app-sidebar/app-sidebar-utils'
import { Badge } from '@/components/ui/badge'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/components/ui/sidebar'

import { IBaseProps, TUserType } from '@/types'

import { generateSidebarGroups } from './sidebar-routes'

const OrgBranchSidebar = (props: IBaseProps) => {
    const router = useRouter()
    const { orgname, branchname } = useParams({
        strict: false,
        // NOT ONLY USE THIS COMPONENT IN ROUTES WITHIN ORG/:orgname/branch/:branchname
    }) as {
        orgname?: string
        branchname?: string
    }
    const {
        currentAuth: { user_organization },
    } = useAuthUserWithOrgBranch()

    const baseUrl = `/org/${orgname}/branch/${branchname}`

    const currentUserType: TUserType = 'employee'

    const memoizedSidebarRouteGroup = useMemo(
        () => generateSidebarGroups(baseUrl, currentUserType),
        [baseUrl]
    )

    const item = useMemo(
        () =>
            flatSidebarGroupItem(memoizedSidebarRouteGroup).map((item) => ({
                ...item,
                items: item.items.map((itm) => ({
                    ...itm,
                    onClick: (self: typeof itm) => {
                        router.navigate({ to: self.url })
                    },
                })),
            })),
        [memoizedSidebarRouteGroup, router]
    )

    const orgLogo = user_organization.organization.media?.download_url

    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link to={baseUrl}>
                                <EcoopLogo
                                    lightUrl={orgLogo}
                                    darkUrl={orgLogo}
                                    className="size-9 rounded-md"
                                />
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {user_organization.organization.name}
                                    </span>
                                    <ActionTooltip
                                        tooltipContent={
                                            <>
                                                <span className="space-y-2 text-xs">
                                                    As{' '}
                                                    <Badge
                                                        variant="secondary"
                                                        className="capitalize"
                                                    >
                                                        {
                                                            user_organization.user_type
                                                        }
                                                    </Badge>{' '}
                                                    Role
                                                </span>
                                            </>
                                        }
                                    >
                                        <span className="truncate text-xs text-muted-foreground/80">
                                            <span>
                                                {
                                                    user_organization.branch
                                                        .name
                                                }{' '}
                                            </span>
                                            <Badge
                                                variant="outline"
                                                className="capitalize"
                                            >
                                                {user_organization.user_type}
                                            </Badge>
                                        </span>
                                    </ActionTooltip>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <AppSidebarQruickNavigate groups={item} />
            </SidebarHeader>
            <SidebarContent className="ecoop-scroll">
                {memoizedSidebarRouteGroup.map((navGroupItem, i) => {
                    if (!navGroupItem.userType.includes(currentUserType))
                        return null

                    return (
                        <SidebarGroup key={`${navGroupItem.title}-${i}`}>
                            <SidebarGroupLabel>
                                {navGroupItem.title}
                            </SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {navGroupItem.navItems
                                        .filter((item) =>
                                            item.userType.includes(
                                                currentUserType
                                            )
                                        )
                                        .map((navItem, index) => (
                                            <AppSidebarItem
                                                key={index}
                                                navItem={{
                                                    ...navItem,
                                                    depth: 1,
                                                }}
                                            />
                                        ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    )
                })}
                {memoizedSidebarRouteGroup.length === 0 && (
                    <SidebarGroupLabel className="px-4 text-xs text-muted-foreground">
                        No accessible
                    </SidebarGroupLabel>
                )}
            </SidebarContent>

            <SidebarFooter>
                <AppSidebarUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

export default OrgBranchSidebar
