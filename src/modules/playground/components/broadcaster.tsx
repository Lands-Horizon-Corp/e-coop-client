import { useState } from 'react'

import {
    Activity,
    Clock,
    Layers,
    Minus,
    Plus,
    Wifi,
    WifiOff,
    Zap,
} from 'lucide-react'

import { useSubscribe } from '@/hooks/use-pubsub'

export interface TSubscribeOptions {
    delay?: number
    maxQueueSize?: number
    debounceTime?: number
}

export interface TLivePayload {
    timestamp: string
    date?: string
    time?: string
    second?: number
    milliseconds?: number
}
function Broadcaster() {
    const [liveData, setLiveData] = useState<TLivePayload | null>(null)

    const [subOptions, setSubOptions] = useState<TSubscribeOptions>({
        debounceTime: 0,
        delay: 1000,
        maxQueueSize: 10,
    })

    const { isSyncing, pendingCount, isLive } = useSubscribe<TLivePayload>(
        'test',
        'client-test',
        (data) => {
            setLiveData(data)
        },
        subOptions
    )

    const simulateBurst = () => {
        console.log('Switching to Burst Mode options...')
        setSubOptions({
            debounceTime: 0,
            delay: 250,
            maxQueueSize: 100,
        })
    }

    const adjustThrottle = (amount: number) => {
        setSubOptions((prev) => ({
            ...prev,
            delay: Math.max(100, (prev.delay || 1000) + amount),
        }))
    }

    const currentMaxQueue = subOptions.maxQueueSize || 10
    const currentDelay = subOptions.delay || 1000

    return (
        <div className="max-w-md mx-auto">
            <header className="mb-8 space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">
                    Monitoring Lab
                </h1>
                <p className="text-muted-foreground text-sm">
                    FILO Queue + Rate Limiting
                </p>
            </header>

            <div className="rounded-2xl shadow-lg border border-border bg-card overflow-hidden">
                {/* Status Header */}
                <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
                    <div className="flex items-center gap-2">
                        <div className="relative flex h-3 w-3">
                            {isLive && (
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            )}
                            <span
                                className={`relative inline-flex rounded-full h-3 w-3 ${isLive ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                            ></span>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            {isLive ? 'Live' : 'Paused'}
                        </span>
                    </div>

                    {isSyncing && (
                        <div className="flex items-center gap-1.5 text-primary animate-pulse">
                            <Activity size={14} />
                            <span className="text-[10px] font-bold uppercase">
                                Processing
                            </span>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="p-6 space-y-6">
                    {/* Data Display */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                            Last Payload
                        </label>
                        <div className="flex items-center gap-4">
                            <div
                                className={`p-3 rounded-xl border ${liveData ? 'border-primary/20 bg-primary/5 text-primary' : 'border-border bg-muted text-muted-foreground'}`}
                            >
                                {liveData ? (
                                    <Wifi size={24} />
                                ) : (
                                    <WifiOff size={24} />
                                )}
                            </div>
                            <div>
                                <div className="flex items-baseline font-mono tracking-tighter">
                                    {liveData ? (
                                        <>
                                            <span className="text-3xl font-bold">
                                                {new Date(
                                                    liveData.timestamp
                                                ).toLocaleTimeString()}
                                            </span>
                                            <span className="text-lg font-bold text-muted-foreground ml-1">
                                                .
                                                {String(
                                                    liveData.milliseconds ||
                                                        new Date(
                                                            liveData.timestamp
                                                        ).getMilliseconds()
                                                ).padStart(3, '0')}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-3xl font-bold">
                                            --:--:--
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground font-medium">
                                    {liveData
                                        ? 'Synchronized'
                                        : 'Waiting for signal...'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
                        <div className="p-4 rounded-xl border border-border bg-muted/20">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <Layers size={14} />
                                <span className="text-[10px] font-bold uppercase">
                                    Stack
                                </span>
                            </div>
                            <div className="text-xl font-bold mt-1">
                                {pendingCount}
                                <span className="ml-1 text-xs font-normal text-muted-foreground">
                                    / {currentMaxQueue}
                                </span>
                            </div>
                        </div>

                        {/* Updated Throttle Card */}
                        <div className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col justify-between">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <Clock size={14} />
                                <span className="text-[10px] font-bold uppercase">
                                    Throttle
                                </span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                                <div className="text-xl font-bold">
                                    {(currentDelay / 1000).toFixed(2)}
                                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                                        s
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        className="p-1 rounded-md bg-background border border-border text-muted-foreground hover:bg-secondary hover:text-secondary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        disabled={currentDelay <= 100}
                                        onClick={() => adjustThrottle(-250)}
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <button
                                        className="p-1 rounded-md bg-background border border-border text-muted-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors"
                                        onClick={() => adjustThrottle(250)}
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Test Actions */}
                    <button
                        className="w-full py-3 px-4 rounded-xl bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold text-sm transition-colors flex items-center justify-center gap-2 border border-border"
                        onClick={simulateBurst}
                    >
                        <Zap size={16} />
                        Set Burst Options
                    </button>
                </div>

                {/* Dynamic Queue Progress */}
                <div className="h-1.5 w-full bg-muted overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-500 ease-in-out"
                        style={{
                            width: `${Math.min((pendingCount / currentMaxQueue) * 100, 100)}%`,
                        }}
                    />
                </div>
            </div>

            <footer className="mt-6">
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <p className="text-[11px] text-muted-foreground text-center leading-relaxed italic">
                        FILO implementation ensures that during high-traffic
                        bursts, the newest data is processed immediately after
                        the cooldown.
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default Broadcaster
