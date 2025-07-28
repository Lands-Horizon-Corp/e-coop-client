import Fuse from 'fuse.js'
import { useEffect, useMemo, useState } from 'react'

import { API_URL } from '@/constants'
import { cn } from '@/lib'

import { useGroupRoutes } from '@/hooks/api-hooks/dev-api-hooks/use-route.dev'
import useDebounce from '@/hooks/use-debounce'

import { IClassProps, IGroupedRoute } from '@/types'

import APIRequestMethodBadge, {
    REQUEST_METHOD,
} from '../badges/api-request-method-badge'
import CopyWrapper from '../elements/copy-wrapper'
import {
    ArrowRightIcon,
    CurlyBracketIcon,
    MagnifyingGlassIcon,
    MessagesIcon,
    PaperPlaneIcon,
    RefreshIcon,
} from '../icons'
import LoadingSpinner from '../spinners/loading-spinner'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '../ui/accordion'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Input } from '../ui/input'
import { Switch } from '../ui/switch'

interface Props extends IClassProps {}

const SearchInput = ({
    onSearchChange,
}: {
    onSearchChange: (data: string) => void
}) => {
    const [rawSearch, setRawSearch] = useState('')
    const searchTerm = useDebounce(rawSearch, 300)

    useEffect(() => {
        onSearchChange(searchTerm)
    }, [onSearchChange, searchTerm])

    return (
        <div className="relative group/search">
            <Input
                value={rawSearch}
                placeholder="Search resource, route, description..."
                onChange={(e) => setRawSearch(e.target.value)}
            />
            <MagnifyingGlassIcon className="absolute top-1/2 -translate-y-1/2 right-5 text-muted-foreground group-hover/search:text-foreground" />
        </div>
    )
}

const APIRoutes = ({ className }: Props) => {
    const { data: rawData, isPending, isFetching, refetch } = useGroupRoutes()
    const [showFull, setShowFull] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    const data = useMemo(() => {
        return rawData.map((groupRoute) => ({
            ...groupRoute,
            routes: groupRoute.routes.map((route) => ({
                ...route,
                route: `/api${route.route}`,
            })),
        }))
    }, [rawData])

    const fuse = useMemo(
        () =>
            new Fuse<IGroupedRoute>(data, {
                keys: ['key', 'routes.route', 'routes.method', 'routes.note'],
                includeScore: true,
                threshold: 0.2,
            }),
        [data]
    )

    const filteredGroupRoutes = useMemo(() => {
        if (!searchTerm.trim()) {
            return data
        }
        const results = fuse.search(searchTerm)
        return results.map((r) => r.item)
    }, [searchTerm, fuse, data])

    return (
        <div className={cn('w-full p-4 space-y-4', className)}>
            <p className="text-2xl">API Routes</p>
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Search API Routes
                </p>
                <div className="inline-flex items-center gap-x-2">
                    <div
                        className="group inline-flex items-center gap-x-2"
                        data-state={showFull ? 'checked' : 'unchecked'}
                    >
                        <span
                            onClick={() => setShowFull(true)}
                            className="group-data-[state=checked]:text-primary text-muted-foreground/70 flex-1 cursor-pointer text-right text-sm font-medium"
                        >
                            Show Full URL
                        </span>
                        <Switch
                            checked={showFull}
                            onCheckedChange={setShowFull}
                        />
                    </div>
                    <Button
                        size="icon"
                        className="gap-x-2 bg-secondary/70 hover:bg-secondary"
                        disabled={isPending || isFetching}
                        onClick={() => refetch()}
                    >
                        {/* Refresh */}
                        {isFetching ? (
                            <LoadingSpinner />
                        ) : (
                            <RefreshIcon className="" />
                        )}
                    </Button>
                </div>
            </div>
            <SearchInput onSearchChange={setSearchTerm} />
            {isPending && <LoadingSpinner className="mx-auto" />}
            {data.length === 0 && (
                <p className="text-xs text-center text-muted-foreground">
                    No Routes
                </p>
            )}
            {filteredGroupRoutes.length === 0 && (
                <>
                    {
                        <p className="text-xs text-center text-muted-foreground">
                            {searchTerm.length <= 0
                                ? 'No Routes'
                                : `No Route matches your search '${searchTerm}'`}
                        </p>
                    }
                </>
            )}
            <div className="space-y-2">
                {filteredGroupRoutes.map((groupRoute) => (
                    <RouteCard
                        key={groupRoute.key}
                        showFullRoute={showFull}
                        groupedRoute={groupRoute}
                    />
                ))}
            </div>
        </div>
    )
}

const RouteCard = ({
    groupedRoute,
    showFullRoute,
}: {
    groupedRoute: IGroupedRoute
    showFullRoute?: boolean
}) => {
    return (
        <Card className="w-full mx-auto bg-popover/70 shadow-lg border-0">
            <CardContent className="p-0">
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem
                        value="route-group"
                        className="border rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                    >
                        <AccordionTrigger
                            disableIcon
                            className="px-6 py-4 hover:no-underline group"
                        >
                            <div className="flex items-center gap-3 w-full">
                                <div className="p-2 bg-secondary rounded-lg">
                                    <CurlyBracketIcon className="size-4 text-primary" />
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="text-xl">
                                        {groupedRoute.key}
                                    </h3>
                                    <p className="text-sm text-muted-foreground/80 mt-1">
                                        {groupedRoute.routes.length} endpoint
                                        {groupedRoute.routes.length !== 1
                                            ? 's'
                                            : ''}
                                    </p>
                                </div>
                                <Badge
                                    variant="secondary"
                                    className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                                >
                                    API Group
                                </Badge>
                                <ArrowRightIcon className="size-4 text-gray-400 dark:text-gray-500 group-data-[state=open]:rotate-90 transition-transform duration-200" />
                            </div>
                        </AccordionTrigger>

                        <AccordionContent className="px-4 pb-4">
                            <div className="space-y-3 pt-2">
                                {groupedRoute.routes.map((route, index) => {
                                    if (
                                        searchedRoute &&
                                        !route.route
                                            .toLowerCase()
                                            .includes(
                                                searchedRoute.toLowerCase()
                                            ) &&
                                        !(
                                            route.note &&
                                            route.note
                                                .toLowerCase()
                                                .includes(
                                                    searchedRoute.toLowerCase()
                                                )
                                        )
                                    )
                                        return null

                                    const apiRoute = showFullRoute
                                        ? `${API_URL}${route.route}`
                                        : route.route
                                    return (
                                        <div
                                            key={`${route.route}-${index}`}
                                            className="flex items-center gap-x-2 py-3 border bg-card rounded-lg transition-colors"
                                        >
                                            <RouteDetailsSheet
                                                route={route}
                                                showFullRoute={!!showFullRoute}
                                                rawData={rawData}
                                                open={openSheetIndex === index}
                                                onOpenChange={(open) =>
                                                    setOpenSheetIndex(
                                                        open ? index : null
                                                    )
                                                }
                                            />
                                            <div>
                                                <div className="flex items-center gap-3 mb-3">
                                                    <APIRequestMethodBadge
                                                        method={
                                                            route.method as (typeof REQUEST_METHOD)[number]
                                                        }
                                                    />
                                                    <CopyWrapper className="w-full">
                                                        <code className="text-sm w-full font-mono text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 px-2 py-1 rounded border border-gray-200 dark:border-gray-700 flex-1">
                                                            {highlightMatch(
                                                                apiRoute,
                                                                searchedRoute ??
                                                                    ''
                                                            )}
                                                        </code>
                                                    </CopyWrapper>
                                                </div>
                                                {route.note && (
                                                    <div className="flex items-start gap-2 rounded-lg text-muted-foreground my-4">
                                                        <MessagesIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                                        <p className="text-sm max-w-4xl">
                                                            {highlightMatch(
                                                                route.note,
                                                                searchedRoute ??
                                                                    ''
                                                            )}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    )
}

export default APIRoutes
