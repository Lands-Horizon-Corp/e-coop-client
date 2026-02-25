import { useState } from 'react'

import { createFileRoute } from '@tanstack/react-router'

import { Activity, Clock, Layers, Wifi, WifiOff, Zap } from 'lucide-react'

import { useSubscribe } from '@/hooks/use-pubsub'

function RouteComponent() {
    const [liveData, setLiveData] = useState<{ timestamp: Date } | null>(null)

    const { isSyncing, pendingCount, isLive } = useSubscribe<{
        timestamp: Date
    }>(
        'test',
        'client-test',
        (data) => {
            console.log(data)
            setLiveData(data)
        },
        {
            debounceTime: 300,
            delay: 1000,
            maxQueueSize: 10,
        }
    )

    // Manual simulation for testing the logic locally
    const simulateBurst = () => {
        // We simulate the pusher store's behavior by manually dispatching events
        // or just calling the logic if you expose the pusher mock.
        // For now, this playground shows the UI state.
        console.log('Triggering burst simulation...')
    }

    return (
        <div className="min-h-screen bg-background p-8 font-sans text-foreground transition-colors duration-300">
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
                                    <div className="text-3xl font-mono font-bold tracking-tighter">
                                        {liveData
                                            ? new Date(
                                                  liveData.timestamp
                                              ).toLocaleTimeString()
                                            : '--:--:--'}
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
                                <div className="text-xl font-bold">
                                    {pendingCount}
                                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                                        msgs
                                    </span>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl border border-border bg-muted/20">
                                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                    <Clock size={14} />
                                    <span className="text-[10px] font-bold uppercase">
                                        Throttle
                                    </span>
                                </div>
                                <div className="text-xl font-bold">
                                    1.0
                                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                                        s
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Test Actions */}
                        <button
                            onClick={simulateBurst}
                            className="w-full py-3 px-4 rounded-xl bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold text-sm transition-colors flex items-center justify-center gap-2 border border-border"
                        >
                            <Zap size={16} />
                            Simulate Burst
                        </button>
                    </div>

                    {/* Dynamic Queue Progress */}
                    <div className="h-1.5 w-full bg-muted overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-500 ease-in-out"
                            style={{
                                width: `${Math.min((pendingCount / 10) * 100, 100)}%`,
                            }}
                        />
                    </div>
                </div>

                <footer className="mt-6">
                    <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                        <p className="text-[11px] text-muted-foreground text-center leading-relaxed italic">
                            FILO implementation ensures that during high-traffic
                            bursts, the newest data is processed immediately
                            after the 1s cooldown.
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export const Route = createFileRoute('/playground')({
    component: RouteComponent,
})
