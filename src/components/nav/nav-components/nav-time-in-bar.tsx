import { useState, useEffect, useMemo } from 'react'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
// import UserAvatar from '@/components/user-avatar'
import ActionTooltip from '@/components/action-tooltip'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import TimeInCounter from '@/components/time-in-out/time-in-counter'
import TimeInTimeOut, { TTImeInEntry } from '@/components/time-in-out'

import { cn } from '@/lib/utils'
import { IClassProps, IEmployee } from '@/types'
import { randomEndOfDayQuoute, randomStartOfDayQuoute } from '@/constants'

interface Props extends IClassProps {
    currentUser: IEmployee | null
}

const NavTimeInBar = ({ className, currentUser }: Props) => {
    const [loading, setLoading] = useState(true)
    const [showTimeInOut, setShowTimeInOut] = useState(false)
    const [timeInEntry, setTimeInEntry] = useState<TTImeInEntry | undefined>(
        undefined
    )

    const quote = useMemo(() => {
        return !timeInEntry ? randomStartOfDayQuoute() : randomEndOfDayQuoute()
    }, [timeInEntry])

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000)
    }, [])

    const handleClick = () => {
        setShowTimeInOut(true)
    }

    if (!currentUser) return

    return (
        <>
            <ActionTooltip
                side="bottom"
                align="center"
                tooltipContent={timeInEntry ? 'Time out' : 'Time in now'}
            >
                <Button
                    onClick={handleClick}
                    variant="secondary"
                    size={loading ? 'icon' : 'default'}
                    className={cn(
                        'pointer-events-none relative flex cursor-not-allowed items-center gap-x-2 rounded-full border-2 border-secondary bg-popover text-sm text-foreground/70 delay-150 duration-300 ease-in-out',
                        className,
                        timeInEntry && 'border-primary/40',
                        !loading && 'pointer-events-auto cursor-pointer pr-3'
                    )}
                >
                    {loading && <LoadingSpinner />}
                    {!loading && (
                        <>
                            {/* <UserAvatar
                                src={currentUser.media?.download_url ?? ''}
                                fallback={currentUser.username.charAt(0) ?? '-'}
                            /> */}
                            {!timeInEntry && <span>Time-in</span>}
                            {timeInEntry && (
                                <span>
                                    Onshift :{' '}
                                    <TimeInCounter
                                        className="font-medium"
                                        timeEntry={timeInEntry}
                                    />
                                </span>
                            )}
                        </>
                    )}
                </Button>
            </ActionTooltip>
            <Dialog
                open={showTimeInOut}
                onOpenChange={(state) => setShowTimeInOut(state)}
            >
                <DialogContent
                    hideCloseButton
                    overlayClassName="backdrop-blur-sm"
                    className="w-full max-w-sm overflow-hidden !rounded-3xl border bg-popover p-0 shadow-center-md"
                >
                    <DialogHeader className="hidden">
                        <DialogTitle>Time In Out Form</DialogTitle>
                        <DialogDescription>Shows time in out</DialogDescription>
                    </DialogHeader>
                    <div className="ecoop-scroll max-h-screen overflow-x-hidden overflow-y-scroll [&::-webkit-scrollbar]:size-0">
                        <TimeInTimeOut
                            timeEntry={timeInEntry}
                            currentUser={currentUser}
                            message={quote}
                            onTimeOut={() => {
                                setTimeInEntry(undefined)
                                setShowTimeInOut(false)
                            }}
                            onTimeInEntry={(data) => {
                                setTimeInEntry(data)
                                setShowTimeInOut(false)
                            }}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default NavTimeInBar
