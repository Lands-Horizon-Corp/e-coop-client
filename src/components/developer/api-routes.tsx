import Fuse from 'fuse.js'
import { useEffect, useMemo, useState } from 'react'

import { API_URL } from '@/constants'
import { cn } from '@/lib'
import { SearchIcon } from 'lucide-react'

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
import { Card, CardContent } from '../ui/card'
import { Checkbox } from '../ui/checkbox'
import { Input } from '../ui/input'
import { Separator } from '../ui/separator'
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

const InfoSection = ({
    icon,
    title,
    body,
    listComponent,
}: {
    icon: React.ReactNode
    title: string
    body?: string
    listComponent?: React.ReactNode
}) => (
    <div className="space-y-2">
        <div className="flex items-center gap-2">
            {icon}
            <h4 className="text-md font-semibold">{title}</h4>
        </div>
        {body ? (
            <Markdown content={body} />
        ) : (
            <span className="text-xs text-muted-foreground italic">
                No {title.toLowerCase()}
            </span>
        )}
        {listComponent}
    </div>
)

const ListConnections = <T extends { key: string; value: string }>({
    title,
    items,
    showAll,
    setShowAll,
}: {
    title: string
    items: T[]
    showAll: boolean
    setShowAll: (show: boolean) => void
}) => {
    const DEFAULT_COUNT = 0
    const toShow = showAll ? items : items.slice(0, DEFAULT_COUNT)
    if (!items.length) return null
    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-md font-semibold">{title}</h2>
                {items.length > DEFAULT_COUNT && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAll(!showAll)}
                    >
                        {showAll ? 'Hide' : 'Show all'}
                    </Button>
                )}
            </div>
            <Accordion type="multiple" className="w-full">
                {toShow.map((item, i) => (
                    <AccordionItem
                        key={i}
                        value={item.key}
                        className="border rounded-md mb-1"
                    >
                        <AccordionTrigger className="px-3 py-2 text-sm font-medium bg-muted hover:bg-muted/70 rounded-md">
                            {item.key}
                        </AccordionTrigger>
                        <AccordionContent className="px-3 py-2 text-xs">
                            <Markdown content={item.value} />
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}

const RouteDetailsSheet = ({
    route,
    showFullRoute,
    rawData,
    open,
    onOpenChange,
}: {
    route: IGroupedRoute['routes'][number]
    showFullRoute: boolean
    rawData?: IAPIList
    open: boolean
    onOpenChange: (open: boolean) => void
}) => {
    const [showAllReq, setShowAllReq] = useState(false)
    const [showAllResp, setShowAllResp] = useState(false)
    const validRequests = (rawData?.requests ?? []).filter(
        (r) => r.key && route.request?.includes(r.key)
    )
    const validResponses = (rawData?.responses ?? []).filter(
        (r) => r.key && route.response?.includes(r.key)
    )

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
                <SearchIcon className="p-1 m-3 cursor-pointer hover:text-primary" />
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
                            <p className="text-sm font-medium">{route.note}</p>
                        </div>
                    )}
                    <InfoSection
                        icon={
                            <PaperPlaneIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                        }
                        title="Request Type"
                        body={route.request}
                        listComponent={
                            <ListConnections
                                title="Request Types connections"
                                items={validRequests}
                                showAll={showAllReq}
                                setShowAll={setShowAllReq}
                            />
                        }
                    />
                    <Separator />
                    <InfoSection
                        icon={
                            <CurlyBracketIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        }
                        title="Response Type"
                        body={route.response}
                        listComponent={
                            <ListConnections
                                title="Response Type connections"
                                items={validResponses}
                                showAll={showAllResp}
                                setShowAll={setShowAllResp}
                            />
                        }
                    />
                </div>
            </SheetContent>
        </Sheet>
    )
}

const RouteCard = ({
    groupedRoute,
    showFullRoute,
    rawData,
    searchedRoute,
}: {
    groupedRoute: IGroupedRoute
    rawData?: IAPIList
    showFullRoute?: boolean
    searchedRoute?: string
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
                                    )
                                })}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    )
}

const APIRoutes = ({ className }: Props) => {
    const { data: rawData, isPending, isFetching, refetch } = useGroupRoutes()
    const [showFull, setShowFull] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedMethods, setSelectedMethods] = useState<string[]>([])

    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']

    const handleMethodToggle = (method: string) => {
        setSelectedMethods((prev) =>
            prev.includes(method)
                ? prev.filter((m) => m !== method)
                : [...prev, method]
        )
    }

    const data = useMemo(
        () =>
            rawData?.grouped_routes.map((groupRoute) => ({
                ...groupRoute,
                routes: groupRoute.routes.map((route) => ({
                    ...route,
                    route: `${route.route}`,
                })),
            })) ?? [],
        [rawData]
    )

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
        let filtered = data

        // Filter by search term
        if (searchTerm.trim()) {
            filtered = fuse.search(searchTerm).map((r) => r.item)
        }

        // Filter by selected methods
        if (selectedMethods.length > 0) {
            filtered = filtered
                .map((group) => ({
                    ...group,
                    routes: group.routes.filter((route) =>
                        selectedMethods.includes(route.method.toUpperCase())
                    ),
                }))
                .filter((group) => group.routes.length > 0)
        }

        return filtered
    }, [searchTerm, fuse, data, selectedMethods])

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
                        {isFetching ? <LoadingSpinner /> : <RefreshIcon />}
                    </Button>
                </div>
            </div>

            {/* Method Filter Checkboxes */}
            <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium text-muted-foreground">
                    Filter by method:
                </span>
                {methods.map((method) => (
                    <div key={method} className="flex items-center space-x-2">
                        <Checkbox
                            id={method}
                            checked={selectedMethods.includes(method)}
                            onCheckedChange={() => handleMethodToggle(method)}
                        />
                        <label htmlFor={method} className="cursor-pointer">
                            <APIRequestMethodBadge
                                method={
                                    method as (typeof REQUEST_METHOD)[number]
                                }
                            />
                        </label>
                    </div>
                ))}
                {selectedMethods.length > 0 && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedMethods([])}
                        className="ml-2"
                    >
                        Clear all
                    </Button>
                )}
            </div>

            <SearchInput onSearchChange={setSearchTerm} />
            {isPending && <LoadingSpinner className="mx-auto" />}
            {!data.length && (
                <p className="text-xs text-center text-muted-foreground">
                    No Routes
                </p>
            )}
            {!filteredGroupRoutes.length && (
                <p className="text-xs text-center text-muted-foreground">
                    {searchTerm.length <= 0 && selectedMethods.length <= 0
                        ? 'No Routes'
                        : `No routes match your filters`}
                </p>
            )}

            <div className="space-y-2">
                {filteredGroupRoutes.map((groupRoute) => (
                    <RouteCard
                        searchedRoute={searchTerm}
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
function highlightMatch(text: string, search: string) {
    if (!search) return text
    const regex = new RegExp(`(${search})`, 'ig')
    return text.split(regex).map((part, i) =>
        regex.test(part) ? (
            <span
                key={i}
                className="bg-primary/50  text-foreground rounded  py-0.5"
            >
                {part}
            </span>
        ) : (
            part
        )
    )
}

export default APIRoutes
