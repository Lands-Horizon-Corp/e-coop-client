import { useEffect, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { cn } from '@/helpers'
import { dateAgo, toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import { CurrencyCombobox } from '@/modules/currency'
import { CurrencyBadge } from '@/modules/currency/components/currency-badge'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { setYear as dateFnsSetYear } from 'date-fns'

import {
    CalendarNumberIcon,
    ChevronDownIcon,
    CopyIcon,
    PlusIcon,
    RefreshIcon,
    TrashIcon,
    XIcon,
} from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps, TEntityId } from '@/types'

import {
    holidayBaseKey,
    logger,
    useCopyYearHoliday,
    useDeleteHolidayById,
    useGetAllHolidays,
    useGetHolidayAvailableYears,
} from '../holiday.service'
import { IHoliday } from '../holiday.types'
import { normalizeHolidayMode } from '../holiday.utils'
import { HolidayCreateUpdateFormModal } from './forms/holiday-create-update-form'

type Props = {} & IClassProps

const HolidayEditor = ({ className }: Props) => {
    const {
        currentAuth: {
            user_organization: {
                branch: {
                    branch_setting: { currency: defaultCurrency },
                },
            },
        },
    } = useAuthUserWithOrgBranch()

    const createModal = useModalState(false)
    const [selectedCurrency, setSelectedCurrency] = useState<
        typeof defaultCurrency | undefined
    >(defaultCurrency)
    const [year, setYear] = useState<number>(new Date().getFullYear())
    const [templateYear, setTemplateYear] = useState<number | undefined>()

    const yearMode = !selectedCurrency ? 'all' : 'currency'

    const {
        data: availableYears = [],
        isPending: isPendingYears,
        isRefetching: isRefetchingYears,
        refetch: refetchYears,
    } = useGetHolidayAvailableYears({
        mode: yearMode,
        currencyId: selectedCurrency?.id,
    })

    const mode = normalizeHolidayMode(year, selectedCurrency?.id)
    const templateMode = normalizeHolidayMode(
        templateYear,
        selectedCurrency?.id
    )

    const { data: holidays = [] } = useGetAllHolidays({
        mode,
        year,
        currencyId: selectedCurrency?.id,
    })

    const yearAvailable = availableYears.filter((years) => years.count > 0)

    useEffect(() => {
        if (templateYear !== undefined) {
            return
        }

        const lastYearWithHolidays = availableYears.find(
            (availableYear) => availableYear.count > 0
        )

        setTemplateYear(lastYearWithHolidays?.year)
    }, [availableYears, templateYear, setTemplateYear])

    const {
        data: templateHolidays = [],
        // isPending: isPendingTemplate,
        // isRefetching: isRefetchingTemplate,
    } = useGetAllHolidays({
        mode: templateMode,
        year: templateYear,
        currencyId: selectedCurrency?.id,
        options: {
            enabled: templateYear !== undefined && holidays.length > 0,
        },
    })

    const copyYearHolidayMutation = useCopyYearHoliday()

    const handleCopyYearHoliday = (
        year: number,
        currencyId: TEntityId,
        copyYear: number
    ) => {
        toast.promise(
            copyYearHolidayMutation.mutateAsync({
                copyYear,
                currencyId,
                year,
            }),
            {
                loading: 'Copying holidays...',
                success: () => {
                    return 'Holidays copied successfully.'
                },
                error: (e) => {
                    const errorMessage = `Failed to copy holidays from year ${templateYear} to year ${year}. ${serverRequestErrExtractor(
                        { error: e }
                    )}`
                    logger.error(errorMessage)
                    return errorMessage
                },
            }
        )
    }

    return (
        <div className={cn('flex flex-1 flex-col gap-y-2', className)}>
            <HolidayCreateUpdateFormModal
                {...createModal}
                formProps={{
                    defaultValues: {
                        entry_date: dateFnsSetYear(
                            new Date(),
                            year
                        ).toISOString(),
                        currency: selectedCurrency,
                        currency_id: selectedCurrency?.id,
                    },
                    onSuccess: () => {
                        refetchYears()
                    },
                }}
            />
            <div className="flex items-center justify-between">
                <p className="text-lg">
                    <CalendarNumberIcon className="inline mr-1" />
                    Holidays
                </p>
                <Button
                    className="size-fit p-2"
                    disabled={isPendingYears || isRefetchingYears}
                    onClick={() => refetchYears()}
                    size="icon"
                    variant="secondary"
                >
                    {isRefetchingYears ? (
                        <LoadingSpinner className="size-3" />
                    ) : (
                        <RefreshIcon className="size-3" />
                    )}
                </Button>
            </div>
            {/* ADD BTN, CURRENCY CMBBX, X-BTN */}
            <div className="flex items-center gap-x-2">
                <Button
                    className="w-fit shrink-0"
                    onClick={() => createModal.onOpenChange(true)}
                >
                    <PlusIcon /> Add
                </Button>
                <CurrencyCombobox
                    className="flex-1"
                    formatDisplay="country"
                    onChange={(newCurrency) => setSelectedCurrency(newCurrency)}
                    value={selectedCurrency?.id}
                />
                <Button
                    className="size-fit p-2 w-fit shrink-0"
                    onClick={() => setSelectedCurrency(undefined)}
                    size="icon"
                    variant="destructive"
                >
                    <XIcon />
                </Button>
            </div>
            {/* YEARS DISPLAYS */}
            <div className="relative flex items-center bg-popover px-4 py-2 rounded-xl gap-x-4">
                <Carousel className="flex-1 min-w-0">
                    <CarouselContent className="-ml-2">
                        {availableYears.map((availableYear) => (
                            <CarouselItem
                                className="pl-2 basis-auto"
                                key={availableYear.year}
                            >
                                <Button
                                    className={cn(
                                        'cursor-pointer whitespace-nowrap',
                                        availableYear.count === 0 &&
                                            'border border-dashed',
                                        year === availableYear.year &&
                                            'border-primary border-2'
                                    )}
                                    onClick={() => setYear(availableYear.year)}
                                    size="sm"
                                    variant={
                                        availableYear.count === 0
                                            ? 'ghost'
                                            : 'secondary'
                                    }
                                >
                                    {availableYear.year}{' '}
                                    {availableYear.count === 0 && <PlusIcon />}
                                </Button>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="-left-14" />
                    <CarouselNext className="-right-14" />
                </Carousel>
            </div>

            {/* Holidays */}
            <div>
                {holidays.map((holiday) => (
                    <HolidayItem
                        holiday={holiday}
                        isGhost={false}
                        key={holiday.id}
                    />
                ))}{' '}
                {templateHolidays.length > 0 && holidays.length === 0 && (
                    <>
                        {/*  Template Control  */}
                        <div className="flex items-center gap-x-2 mb-4">
                            <ButtonGroup className="flex-1 items-center p-4 border border-primary rounded-xl">
                                <ButtonGroup className="w-full flex flex-col">
                                    <span className="block">
                                        Copy {templateYear} holidays for this
                                        year
                                    </span>
                                    <span className="text-xs block text-muted-foreground">
                                        Holidays from year&apos; {year} holidays
                                        will be copied to {templateYear}
                                    </span>
                                </ButtonGroup>
                                <ButtonGroup>
                                    <Button
                                        className="flex"
                                        disabled={
                                            copyYearHolidayMutation.isPending
                                        }
                                        onClick={() =>
                                            handleCopyYearHoliday(
                                                year,
                                                selectedCurrency?.id as TEntityId,
                                                templateYear!
                                            )
                                        }
                                        variant="default"
                                    >
                                        {copyYearHolidayMutation.isPending ? (
                                            <LoadingSpinner className="size-4" />
                                        ) : (
                                            <>
                                                <CopyIcon className="size-4 mr-2" />
                                                Copy Holidays
                                            </>
                                        )}
                                    </Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                className="!pl-2"
                                                variant="outline"
                                            >
                                                <ChevronDownIcon />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            className="[--radius:1rem]"
                                        >
                                            {yearAvailable.map(
                                                (availableYear) => (
                                                    <DropdownMenuItem
                                                        key={availableYear.year}
                                                        onClick={() =>
                                                            setTemplateYear(
                                                                availableYear.year
                                                            )
                                                        }
                                                    >
                                                        {availableYear.year}
                                                    </DropdownMenuItem>
                                                )
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </ButtonGroup>
                            </ButtonGroup>
                        </div>
                        {templateHolidays.map((holiday) => (
                            <HolidayItem
                                holiday={holiday}
                                isGhost={true}
                                key={holiday.id}
                            />
                        ))}
                    </>
                )}
            </div>
        </div>
    )
}

const HolidayItem = ({
    holiday,
    className,
    isGhost = false,
}: { holiday: IHoliday; isGhost: boolean } & IClassProps) => {
    const { onOpen: onOpenConfirm } = useConfirmModalStore()
    const queryClient = useQueryClient()

    const deleteHolidayMutation = useDeleteHolidayById()

    const handleDelete = () => {
        onOpenConfirm({
            title: 'Delete Holiday',
            description: `Are you sure you want to delete the holiday "${holiday.name}"? This action cannot be undone.`,
            onConfirm: () => {
                toast.promise(deleteHolidayMutation.mutateAsync(holiday.id), {
                    loading: 'Deleting holiday...',
                    success: () => {
                        queryClient.invalidateQueries({
                            queryKey: [holidayBaseKey, 'all'],
                        })
                        return 'Holiday deleted successfully.'
                    },
                    error: (e) => {
                        const errorMessage = `Failed to delete holiday ${holiday.id}. ${serverRequestErrExtractor({ error: e })}`
                        logger.error(errorMessage)
                        return errorMessage
                    },
                })
            },
        })
    }

    return (
        <div
            className={cn('flex items-start gap-x-2', isGhost && 'opacity-60')}
            key={holiday.id}
        >
            <CurrencyBadge
                currency={holiday.currency}
                displayFormat="country"
                size="sm"
            />
            <div
                className={cn(
                    'p-4 mb-2 flex-1 border border-border rounded-lg',
                    className,
                    isGhost && 'border border-dashed'
                )}
            >
                <div className="flex items-center justify-between">
                    <p className="font-medium">{holiday.name}</p>
                    {!isGhost && (
                        <Button
                            className="size-fit p-2 "
                            disabled={deleteHolidayMutation.isPending}
                            onClick={() => handleDelete()}
                            size="icon"
                            variant="destructive"
                        >
                            <TrashIcon className="size-4" />
                        </Button>
                    )}
                </div>
                <p className="text-sm text-muted-foreground">
                    {toReadableDate(holiday.entry_date)} -{' '}
                    {dateAgo(holiday.entry_date)}
                </p>
            </div>
        </div>
    )
}

export default HolidayEditor
