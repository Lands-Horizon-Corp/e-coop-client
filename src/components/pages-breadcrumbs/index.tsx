'use client'
import { Fragment, useMemo } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'

import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import PageNavigator from './page-navigator'
import { ChevronRightIcon, HomeFillIcon } from '../icons'

import { cn } from '@/lib/utils'

type Props = {
    homeUrl?: `/${string}`
    className?: string
}

type TCrumbPaths = { name: string; urlPath: string }

const generatePaths = (pathName: string, homeUrl?: string): TCrumbPaths[] => {
    const paths: TCrumbPaths[] = []
    const urlParts = pathName.split('/').filter((path) => path)

    let currentPath = ''

    urlParts.forEach((part) => {
        if ((part === '/' ? '' : '/') + part === homeUrl) {
            currentPath = homeUrl
            return
        }
        currentPath += '/' + part
        paths.push({
            name: part,
            urlPath: currentPath,
        })
    })

    return paths
}

const splitPaths = (paths: TCrumbPaths[], homeUrl?: string) => {
    let firstPart: TCrumbPaths
    let midPart: TCrumbPaths[] = []
    let lastPart: TCrumbPaths[] = []

    if (paths.length > 4) {
        firstPart = homeUrl ? { name: 'Home', urlPath: homeUrl } : paths[0]
        midPart = paths.slice(1, paths.length - 2)
        lastPart = paths.slice(-2)
    } else {
        firstPart = homeUrl ? { name: 'Home', urlPath: homeUrl } : paths[0]
        lastPart = paths.slice(1)
    }

    return { paths, firstPart, midPart, lastPart }
}

const PageBreadCrumb = ({ className, homeUrl }: Props) => {
    const router = useRouterState()
    const pathName = router.location.pathname

    const paths = useMemo(() => {
        const foundPaths = generatePaths(pathName, homeUrl)
        const groupSplit = splitPaths(foundPaths)
        return groupSplit
    }, [pathName, homeUrl])

    return (
        <Breadcrumb className={cn('capitalize', className)}>
            <BreadcrumbList className="text-xs">
                <PageNavigator />
                {homeUrl && (
                    <>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to={homeUrl as string}>
                                    <HomeFillIcon className="size-4" />
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        {paths.paths.length > 0 && (
                            <BreadcrumbSeparator>
                                <ChevronRightIcon className="size-4" />
                            </BreadcrumbSeparator>
                        )}
                    </>
                )}
                {paths.firstPart && (
                    <>
                        <BreadcrumbItem
                            data-id="Yes"
                            className="text-foreground/40"
                        >
                            <BreadcrumbLink asChild className="text-inherit">
                                <Link to={paths.firstPart.urlPath}>
                                    {paths.firstPart.name}
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        {paths.lastPart.length > 0 && (
                            <BreadcrumbSeparator>
                                <ChevronRightIcon className="size-4" />
                            </BreadcrumbSeparator>
                        )}
                    </>
                )}
                {paths.midPart.length > 0 && (
                    <>
                        <BreadcrumbItem className="text-foreground/40">
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-1">
                                    <BreadcrumbEllipsis className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="center"
                                    className="ecoop-scroll max-h-60 overflow-y-scroll [&::-webkit-scrollbar]:w-[1px]"
                                >
                                    {paths.midPart.map((path) => (
                                        <DropdownMenuItem
                                            key={path.urlPath}
                                            className="focus:bg-secondary focus:text-secondary-foreground"
                                        >
                                            <BreadcrumbItem className="w-full">
                                                <BreadcrumbLink asChild>
                                                    <Link to={path.urlPath}>
                                                        {path.name}
                                                    </Link>
                                                </BreadcrumbLink>
                                            </BreadcrumbItem>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>
                            <ChevronRightIcon className="size-4" />
                        </BreadcrumbSeparator>
                    </>
                )}
                {paths.lastPart.map((path, i) => {
                    return (
                        <Fragment key={path.urlPath}>
                            <BreadcrumbItem className="text-foreground/40">
                                {i !== paths.lastPart.length - 1 ? (
                                    <BreadcrumbLink
                                        asChild
                                        className="text-inherit"
                                    >
                                        <Link to={path.urlPath}>
                                            {path.name}
                                        </Link>
                                    </BreadcrumbLink>
                                ) : (
                                    <BreadcrumbPage className="cursor-default">
                                        {path.name}
                                    </BreadcrumbPage>
                                )}
                            </BreadcrumbItem>
                            {i < paths.lastPart.length - 1 && (
                                <BreadcrumbSeparator>
                                    <ChevronRightIcon className="size-4" />
                                </BreadcrumbSeparator>
                            )}
                        </Fragment>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default PageBreadCrumb
