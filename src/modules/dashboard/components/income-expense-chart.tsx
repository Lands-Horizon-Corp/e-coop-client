import { useEffect, useMemo, useRef, useState } from 'react'

import Chart from 'chart.js/auto'

import { Button } from '@/components/ui/button'
import { ButtonGroup, ButtonGroupSeparator } from '@/components/ui/button-group'
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

    const [range, setRange] = useState<'3m' | '30d' | '7d'>('7d')

    // Filter data based on range
    const filteredData = useMemo(() => {
        if (range === '3m') return data.slice(-3)
        if (range === '30d') return data.slice(-6)
        return data.slice(-3) // simulate 7d
    }, [range])

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
                labels: filteredData.map((item) => item.month),
                datasets: [
                    {
                        label: 'Income',
                        data: filteredData.map((item) => item.income),
                        borderColor: theme.primary,
                        borderWidth: 2,
                        pointRadius: 0,
                        tension: 0.3,
                    },
                    {
                        label: 'Expense',
                        data: filteredData.map((item) => item.expense),
                        borderColor: theme.secondary,
                        borderWidth: 2,
                        pointRadius: 0,
                        tension: 0.3,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end',
                        labels: {
                            color: theme.mutedForeground,
                            boxWidth: 12,
                        },
                    },
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: theme.mutedForeground },
                    },
                    y: {
                        grid: { color: theme.muted },
                        ticks: {
                            color: theme.mutedForeground,
                            callback: (value) => formatCurrency(Number(value)),
                        },
                    },
                },
            },
        })

        return () => chartRef.current?.destroy()
    }, [theme, filteredData])

    return (
        <Card className="bg-card shadow-sm w-full">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-semibold text-muted-foreground">
                    Income vs Expense
                </CardTitle>

                <ButtonGroup>
                    <Button
                        onClick={() => setRange('3m')}
                        size="sm"
                        variant={range === '3m' ? 'default' : 'ghost'}
                    >
                        Last 3 months
                    </Button>

                    <ButtonGroupSeparator />

                    <Button
                        onClick={() => setRange('30d')}
                        size="sm"
                        variant={range === '30d' ? 'default' : 'ghost'}
                    >
                        Last 30 days
                    </Button>

                    <ButtonGroupSeparator />

                    <Button
                        onClick={() => setRange('7d')}
                        size="sm"
                        variant={range === '7d' ? 'default' : 'ghost'}
                    >
                        Last 7 days
                    </Button>
                </ButtonGroup>
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
