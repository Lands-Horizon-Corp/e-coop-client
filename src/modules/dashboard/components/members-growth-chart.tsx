import { useEffect, useMemo, useRef } from 'react'

import Chart from 'chart.js/auto'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const data = [
    { month: 'Jan', members: 1200 },
    { month: 'Feb', members: 1350 },
    { month: 'Mar', members: 1480 },
    { month: 'Apr', members: 1520 },
    { month: 'May', members: 1690 },
    { month: 'Jun', members: 1820 },
    { month: 'Jul', members: 1950 },
    { month: 'Aug', members: 2100 },
    { month: 'Sep', members: 2280 },
    { month: 'Oct', members: 2410 },
    { month: 'Nov', members: 2560 },
    { month: 'Dec', members: 2730 },
]

const formatMembers = (value: number) =>
    value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString()

const MembersGrowthChart = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const chartRef = useRef<Chart | null>(null)

    const theme = useMemo(() => {
        if (typeof window === 'undefined') return null

        const style = getComputedStyle(document.documentElement)

        return {
            primary: style.getPropertyValue('--primary').trim(),
            muted: style.getPropertyValue('--muted').trim(),
            mutedForeground: style
                .getPropertyValue('--muted-foreground')
                .trim(),
            card: style.getPropertyValue('--card').trim(),
            border: style.getPropertyValue('--border').trim(),
        }
    }, [])

    useEffect(() => {
        if (!canvasRef.current || !theme) return

        if (chartRef.current) {
            chartRef.current.destroy()
        }

        chartRef.current = new Chart(canvasRef.current, {
            type: 'line',
            data: {
                labels: data.map((item) => item.month),
                datasets: [
                    {
                        label: 'Members',
                        data: data.map((item) => item.members),
                        borderColor: theme.primary,
                        backgroundColor: `${theme.primary}`,
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: true,
                        tension: 0,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                        borderWidth: 1,
                        callbacks: {
                            label: (context) => {
                                const value = context.raw as number
                                return `Members: ${value.toLocaleString()}`
                            },
                        },
                    },
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                        },
                        ticks: {
                            color: theme.mutedForeground,
                            font: {
                                size: 12,
                            },
                        },
                    },
                    y: {
                        grid: {
                            color: theme.muted,
                        },
                        ticks: {
                            color: theme.mutedForeground,
                            font: {
                                size: 12,
                            },
                            callback: (value) => formatMembers(Number(value)),
                        },
                    },
                },
            },
        })

        return () => {
            chartRef.current?.destroy()
        }
    }, [theme])

    return (
        <Card className="bg-card shadow-sm w-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-muted-foreground">
                    Members Growth
                </CardTitle>
            </CardHeader>

            <CardContent className="pt-0">
                <div className="w-full h-[140px] sm:h-[180px] md:h-[220px]">
                    <canvas ref={canvasRef} />
                </div>
            </CardContent>
        </Card>
    )
}

export default MembersGrowthChart
