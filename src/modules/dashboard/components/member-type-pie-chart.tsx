import { useEffect, useMemo, useRef } from 'react'

import PIE_ARTWORK_GIF from '@/assets/gifs/pie-artwork-loading.gif'
import { IMemberProfileDashboardSummaryResponse } from '@/modules/member-profile'
import Chart from 'chart.js/auto'

import { EmptyIcon } from '@/components/icons'
import ImageMatch from '@/components/image-match'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Empty } from '@/components/ui/empty'

import { MOCK_MEMBER_PROFILE_DASHBOARD_SUMMARY } from './member-profile-dashboard.mock'

interface MemberTypePieChartProps {
    data?: IMemberProfileDashboardSummaryResponse
    isLoading?: boolean
}

const MemberTypePieChart = ({ isLoading }: MemberTypePieChartProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const chartRef = useRef<Chart | null>(null)

    const chartData = useMemo(() => {
        return (
            MOCK_MEMBER_PROFILE_DASHBOARD_SUMMARY.member_type_counts?.map(
                (item) => ({
                    name: item.member_type?.name || 'No Member Type Data',
                    value: item.count,
                })
            ) ?? []
        )
    }, [])

    const theme = useMemo(() => {
        if (typeof window === 'undefined') return null

        const style = getComputedStyle(document.documentElement)

        return {
            colors: [
                style.getPropertyValue('--chart-1').trim(),
                style.getPropertyValue('--chart-2').trim(),
                style.getPropertyValue('--chart-3').trim(),
                style.getPropertyValue('--chart-4').trim(),
                style.getPropertyValue('--chart-5').trim(),
            ],
            card: style.getPropertyValue('--card').trim(),
            border: style.getPropertyValue('--border').trim(),
            muted: style.getPropertyValue('--muted-foreground').trim(),
        }
    }, [])

    useEffect(() => {
        if (!canvasRef.current || chartData.length === 0 || !theme) return

        // Destroy existing chart before creating new one
        if (chartRef.current) {
            chartRef.current.destroy()
        }

        chartRef.current = new Chart(canvasRef.current, {
            type: 'doughnut',
            data: {
                labels: chartData.map((item) => item.name),
                datasets: [
                    {
                        data: chartData.map((item) => item.value),
                        backgroundColor: chartData.map(
                            (_, index) =>
                                theme.colors[index % theme.colors.length]
                        ),
                        borderWidth: 0,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: theme.muted,
                            boxWidth: 8,
                        },
                    },
                    tooltip: {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                        borderWidth: 1,
                        callbacks: {
                            label: (context) => {
                                const value = context.raw as number
                                return `${value.toLocaleString()} members`
                            },
                        },
                    },
                },
            },
        })

        return () => {
            chartRef.current?.destroy()
        }
    }, [chartData, theme])

    return (
        <Card className="bg-card shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-muted-foreground">
                    Members by Type
                </CardTitle>
            </CardHeader>

            <CardContent className="pt-0">
                <div className="w-full h-[140px] sm:h-[180px] md:h-[220px] flex items-center justify-center">
                    {isLoading ? (
                        <Empty className="text-muted-foreground">
                            <ImageMatch
                                alt="loading-gif"
                                className="block size-40 bg-transparent"
                                src={PIE_ARTWORK_GIF}
                            />
                            Loading members...
                        </Empty>
                    ) : chartData.length === 0 ? (
                        <Empty className="text-muted-foreground">
                            <EmptyIcon className="size-7" />
                            No Data Available
                        </Empty>
                    ) : (
                        <canvas ref={canvasRef} />
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default MemberTypePieChart
