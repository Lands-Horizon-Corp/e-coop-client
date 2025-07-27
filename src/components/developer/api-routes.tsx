import Fuse from 'fuse.js'
import { useEffect, useMemo, useState } from 'react'

import { API_URL } from '@/constants'
import { cn } from '@/lib'

import { Markdown } from '@/components/ui/markdown'

import { useGroupRoutes } from '@/hooks/api-hooks/dev-api-hooks/use-route.dev'
import useDebounce from '@/hooks/use-debounce'

import { IAPIList, IClassProps, IGroupedRoute } from '@/types'

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
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '../ui/sheet'
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
        return (
            rawData?.grouped_routes.map((groupRoute) => ({
                ...groupRoute,
                routes: groupRoute.routes.map((route) => ({
                    ...route,
                    route: `/api${route.route}`,
                })),
            })) ?? []
        )
    }, [rawData])

    const fuse = useMemo(
        () =>
            new Fuse<IGroupedRoute>(data, {
                keys: ['key', 'routes.route'],
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
                        rawData={rawData}
                    />
                ))}
            </div>
        </div>
    )
}

const RouteCard = ({
    groupedRoute,
    showFullRoute,
    rawData,
}: {
    groupedRoute: IGroupedRoute
    rawData?: IAPIList
    showFullRoute?: boolean
}) => {
    const [openSheetIndex, setOpenSheetIndex] = useState<number | null>(null)

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
                                {groupedRoute.routes.map((route, index) => (
                                    <div
                                        key={`${route.route}-${index}`}
                                        className="p-4 border bg-card rounded-lg transition-colors"
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <APIRequestMethodBadge
                                                method={
                                                    route.method as (typeof REQUEST_METHOD)[number]
                                                }
                                            />
                                            <CopyWrapper className="w-full">
                                                <code className="text-sm w-full font-mono text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 px-2 py-1 rounded border border-gray-200 dark:border-gray-700 flex-1">
                                                    {showFullRoute
                                                        ? `${API_URL}${route.route}`
                                                        : route.route}
                                                </code>
                                            </CopyWrapper>
                                            <Sheet
                                                open={openSheetIndex === index}
                                                onOpenChange={(open) =>
                                                    setOpenSheetIndex(
                                                        open ? index : null
                                                    )
                                                }
                                            >
                                                <SheetTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="ml-2"
                                                        onClick={() =>
                                                            setOpenSheetIndex(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        Details
                                                    </Button>
                                                </SheetTrigger>
                                                <SheetContent
                                                    side="right"
                                                    className="min-w-[50vw] max-w-[90vw] h-full max-h-screen overflow-y-auto p-8 bg-gradient-to-br from-background via-card to-muted border-l shadow-xl flex flex-col gap-8"
                                                >
                                                    <SheetHeader>
                                                        <SheetTitle>
                                                            <span className="flex items-center gap-2">
                                                                <APIRequestMethodBadge
                                                                    method={
                                                                        route.method as (typeof REQUEST_METHOD)[number]
                                                                    }
                                                                />
                                                                <CopyWrapper>
                                                                    <span className="text-md font-md">
                                                                        {showFullRoute
                                                                            ? `${API_URL}${route.route}`
                                                                            : route.route}
                                                                    </span>
                                                                </CopyWrapper>
                                                            </span>
                                                        </SheetTitle>
                                                    </SheetHeader>
                                                    <div className="space-y-6">
                                                        {route.note && (
                                                            <div className="flex items-start gap-2 rounded-lg bg-muted/40 px-4 py-2 text-muted-foreground">
                                                                <MessagesIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                                                <p className="text-sm font-medium">
                                                                    {route.note}
                                                                </p>
                                                            </div>
                                                        )}
                                                        <div className="space-y-6">
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <PaperPlaneIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                                    <h4 className="text-md font-semibold text-green-800 dark:text-green-300">
                                                                        Request
                                                                        Type
                                                                    </h4>
                                                                </div>
                                                                <div>
                                                                    {route.request ? (
                                                                        <>
                                                                            <Markdown
                                                                                content={
                                                                                    route.request
                                                                                }
                                                                            />
                                                                            <RequestsList
                                                                                rawData={
                                                                                    rawData
                                                                                }
                                                                                route={
                                                                                    route
                                                                                }
                                                                            />
                                                                        </>
                                                                    ) : (
                                                                        <span className="text-xs text-muted-foreground italic">
                                                                            No
                                                                            request
                                                                            body
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <CurlyBracketIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                                    <h4 className="text-md font-semibold text-blue-800 dark:text-blue-300">
                                                                        Response
                                                                        Type
                                                                    </h4>
                                                                </div>
                                                                <div>
                                                                    {route.response ? (
                                                                        <>
                                                                            <Markdown
                                                                                content={
                                                                                    route.response
                                                                                }
                                                                            />

                                                                            <ResponsesList
                                                                                rawData={
                                                                                    rawData
                                                                                }
                                                                                route={
                                                                                    route
                                                                                }
                                                                            />
                                                                        </>
                                                                    ) : (
                                                                        <span className="text-xs text-muted-foreground italic">
                                                                            No
                                                                            response
                                                                            body
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </SheetContent>
                                            </Sheet>
                                        </div>
                                        {route.note && (
                                            <div className="flex items-start gap-2 rounded-lg text-muted-foreground my-4">
                                                <MessagesIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                                <p className="text-sm ">
                                                    {route.note}
                                                </p>
                                            </div>
                                        )}
                                        {/* Request on top, Response underneath */}
                                        <div className="space-y-6 mb-3">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <PaperPlaneIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        Request Type
                                                    </h4>
                                                </div>
                                                <div>
                                                    {route.request ? (
                                                        <Markdown
                                                            content={
                                                                route.request
                                                            }
                                                        />
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground italic">
                                                            No request body
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <CurlyBracketIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        Response Type
                                                    </h4>
                                                </div>
                                                <div>
                                                    {route.response ? (
                                                        <Markdown
                                                            content={
                                                                route.response
                                                            }
                                                        />
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground italic">
                                                            No response body
                                                        </span>
                                                    )}
                                                </div>
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

export function ResponsesList({
    rawData,
    route,
}: {
    rawData?: IAPIList
    route: IGroupedRoute['routes'][number]
}) {
    // Filter valid responses
    const validResponses = (rawData?.responses ?? []).filter(
        (response) => response.value && route.response?.includes(response.value)
    )

    // Toggle state for showing all connections
    const [showAll, setShowAll] = useState(false)
    // How many to show by default if not toggled
    const DEFAULT_COUNT = 0

    if (!validResponses.length) return null

    const responsesToShow = showAll
        ? validResponses
        : validResponses.slice(0, DEFAULT_COUNT)

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                    Response Type connections
                </h2>
                {validResponses.length > DEFAULT_COUNT && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAll((prev) => !prev)}
                    >
                        {showAll ? 'Hide' : 'Show all'}
                    </Button>
                )}
            </div>
            {responsesToShow.map((response, index) => (
                <Card key={index} className="w-full">
                    <CardHeader>
                        <CardTitle className="mb-2 text-base font-semibold text-primary">
                            {response.key}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-auto">
                        <Markdown content={response.value} />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export function RequestsList({
    rawData,
    route,
}: {
    rawData?: IAPIList
    route: IGroupedRoute['routes'][number]
}) {
    const validRequests = (rawData?.requests ?? []).filter(
        (request) => request.value && route.request?.includes(request.value)
    )

    const [showAll, setShowAll] = useState(false)
    const DEFAULT_COUNT = 0

    if (!validRequests.length) return null

    const requestsToShow = showAll
        ? validRequests
        : validRequests.slice(0, DEFAULT_COUNT)

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                    Request Types connections
                </h2>
                {validRequests.length > DEFAULT_COUNT && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAll((prev) => !prev)}
                    >
                        {showAll ? 'Hide' : 'Show all'}
                    </Button>
                )}
            </div>
            {requestsToShow.map((request, index) => (
                <Card key={index} className="w-full">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold text-primary">
                            {request.key}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-auto">
                        <Markdown content={request.value} />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
