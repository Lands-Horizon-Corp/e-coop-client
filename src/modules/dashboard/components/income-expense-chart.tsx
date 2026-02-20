import { useEffect, useMemo, useRef } from 'react'

import Chart from 'chart.js/auto'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const data = [
    { month: 'Jan', income: 42000, expense: 28000 },
    { month: 'Feb', income: 45000, expense: 30000 },
    { month: 'Mar', income: 48000, expense: 27000 },
    { month: 'Apr', income: 51000, expense: 32000 },
    { month: 'May', income: 47000, expense: 29000 },
    { month: 'Jun', income: 53000, expense: 31000 },
    { month: 'Jul', income: 58000, expense: 34000 },
    { month: 'Aug', income: 55000, expense: 33000 },
    { month: 'Sep', income: 60000, expense: 35000 },
    { month: 'Oct', income: 62000, expense: 36000 },
    { month: 'Nov', income: 59000, expense: 34000 },
    { month: 'Dec', income: 65000, expense: 38000 },
]

const formatCurrency = (value: number) => `₱${(value / 1000).toFixed(0)}k`

const IncomeExpenseChart = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const chartRef = useRef<Chart | null>(null)

    const theme = useMemo(() => {
        if (typeof window === 'undefined') return null

        const style = getComputedStyle(document.documentElement)

        return {
            primary: style.getPropertyValue('--primary').trim(),
            secondary: style.getPropertyValue('--secondary').trim(),
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
                        label: 'Income',
                        data: data.map((item) => item.income),
                        borderColor: theme.primary,
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        pointRadius: 0,
                        tension: 0,
                    },
                    {
                        label: 'Expense',
                        data: data.map((item) => item.expense),
                        borderColor: theme.secondary,
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        pointRadius: 0,
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
                        position: 'top',
                        align: 'end',
                        labels: {
                            color: theme.mutedForeground,
                            boxWidth: 12,
                        },
                    },
                    tooltip: {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                        borderWidth: 1,
                        callbacks: {
                            label: (context) => {
                                const label = context.dataset.label
                                const value = context.raw as number
                                return `${label}: ₱${value.toLocaleString()}`
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
                            // borderDash: [3, 3],
                        },
                        ticks: {
                            color: theme.mutedForeground,
                            font: {
                                size: 12,
                            },
                            callback: (value) => formatCurrency(Number(value)),
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
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base font-semibold text-muted-foreground">
                    Income vs Expense
                </CardTitle>

                {/* Filter Buttons */}
                <div className="flex items-center gap-2 bg-muted rounded-md p-1">
                    <button className="px-3 py-1 text-xs rounded-md hover:bg-background transition">
                        Last 3 months
                    </button>

                    <button className="px-3 py-1 text-xs rounded-md hover:bg-background transition">
                        Last 30 days
                    </button>

                    <button className="px-3 py-1 text-xs rounded-md bg-background shadow-sm">
                        Last 7 days
                    </button>
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                <div className="w-full h-[140px] sm:h-[180px] md:h-[210px]">
                    <canvas ref={canvasRef} />
                </div>
            </CardContent>
        </Card>
    )
}

export default IncomeExpenseChart
