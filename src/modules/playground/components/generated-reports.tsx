import { useState } from 'react'

import { z } from 'zod'

import { useReportViewerStore } from '@/modules/generated-report/components/generated-report-view/global-generate-report-viewer.store'
import API from '@/providers/api'
import { entityIdSchema } from '@/validation'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

import { useSubscribe } from '@/hooks/use-pubsub'

/**
 * 1. CONFIGURATION & DIMENSIONS
 */
const PAPER_SIZES = {
    A4: { label: 'A4 (Standard)', width: '210mm', height: '297mm' },
    LETTER: { label: 'US Letter', width: '8.5in', height: '11in' },
    LEGAL: { label: 'Legal', width: '8.5in', height: '14in' },
    TABLOID: { label: 'Tabloid', width: '11in', height: '17in' },
} as const

type PaperSizeKey = keyof typeof PAPER_SIZES

export const ReportProgressStatusSchema = z.enum([
    'pending',
    'in_progress',
    'formatting',
    'uploading',
    'completed',
    'failed',
])

export const CreateReportRequestSchema = z.object({
    module: z.string().min(1, 'Module is required'),
    template: z.string().min(1, 'Template content is required'),
    name: z.string().min(1, 'Name is required'),
    password: z.string().optional(),
    width: z.string().optional(),
    height: z.string().optional(),
    filters: z.record(z.string(), z.any()).optional(),
})

export const GeneratedReportSchema = z.object({
    id: entityIdSchema,
    module: z.string().optional(),
    template: z.string().optional(),
    filters: z.record(z.string(), z.any()).optional().nullable(),
    name: z.string(),
    media_id: z.string().uuid().optional().nullable(),
    media: z
        .object({
            url: z.string().optional(),
        })
        .optional()
        .nullable(),
    status: ReportProgressStatusSchema,
    system_message: z.string().optional().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
})

export type ICreateReportRequest = z.infer<typeof CreateReportRequestSchema>
export type IGeneratedReport = z.infer<typeof GeneratedReportSchema>

/**
 * 3. COMPONENT
 */
function GeneratedReports() {
    const [loading, setLoading] = useState(false)
    const [currentStatus, setCurrentStatus] = useState('IDLE')
    const [progress, setProgress] = useState(0)
    const [reportData, setReportData] = useState<IGeneratedReport | null>(null)
    const [selectedSize, setSelectedSize] = useState<PaperSizeKey>('A4')
    const handleGenerateReport = async () => {
        setLoading(true)
        setCurrentStatus('pending')
        setProgress(10)
        setReportData(null)
        const today = new Date().toISOString().split('T')[0]
        const dimensions = PAPER_SIZES[selectedSize]
        const requestPayload: ICreateReportRequest = {
            module: 'LoanTransaction',
            name: `Member_Report_${today}.pdf`,
            width: dimensions.width,
            height: dimensions.height,
            filters: {
                balance: '20',
            },
            template: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    @page {
                        size: ${dimensions.width} ${dimensions.height};
                        margin: 1cm;
                    }
                    body { font-family: sans-serif; padding: 20px; }
                    .filter-box { background: #eee; padding: 10px; margin-top: 20px; font-size: 12px; }
                </style>
            </head>
            <body>
                <h1>Report for {{module}}</h1>
                <p>Dimensions: ${dimensions.width} x ${dimensions.height}</p>
                <div class="filter-box">
                    <strong>Internal Reference:</strong> {{filters.report_type}}
                </div>
            </body>
            </html>
        `,
        }
        try {
            const response = await API.post<
                ICreateReportRequest,
                IGeneratedReport // Note: This type might still be useful for Intellisense
            >('/api/v1/generated-report', requestPayload)

            const data = response.data

            useReportViewerStore.getState().open({
                reportId: data.id,
            })

            setReportData(data) // Now the types match!
            setCurrentStatus(data.status)
            setProgress(data.status === 'completed' ? 100 : 50)
        } catch (err: any) {
            console.error('Generation failure:', err)
            setCurrentStatus('failed')
            alert(err.message || 'Failed to generate report')
        } finally {
            setLoading(false)
        }
    }
    const eventName = reportData?.id ? `live.${reportData.id}` : null
    useSubscribe('generated_report', eventName, () => {})

    return (
        <div className="p-8 space-y-6">
            <div className="border p-6 rounded-lg bg-card max-w-2xl mx-auto shadow-sm">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-primary">
                        Report Generator
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Select a format and generate your document.
                    </p>
                </div>

                {!reportData ? (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">
                                Paper Size
                            </label>
                            <Select
                                disabled={loading}
                                onValueChange={(val) =>
                                    setSelectedSize(val as PaperSizeKey)
                                }
                                value={selectedSize}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Choose a size" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(PAPER_SIZES).map(
                                        ([key, config]) => (
                                            <SelectItem key={key} value={key}>
                                                {config.label} ({config.width} ×{' '}
                                                {config.height})
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        {loading && (
                            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                <div className="flex justify-between items-center">
                                    <Badge
                                        className="uppercase"
                                        variant="secondary"
                                    >
                                        {currentStatus.replace(/_/g, ' ')}
                                    </Badge>
                                    <span className="text-sm font-mono font-bold">
                                        {Math.round(progress)}%
                                    </span>
                                </div>
                                <Progress className="h-2" value={progress} />
                            </div>
                        )}

                        <Button
                            className="w-full h-11"
                            disabled={loading}
                            onClick={handleGenerateReport}
                        >
                            {loading ? 'Processing...' : 'Generate PDF Report'}
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* <ReportViewer reportId={reportData.id} /> */}
                        {/* // <div className="space-y-4 animate-in zoom-in-95 duration-300">
                    //     <div className="flex items-center gap-2">
                    //         <Badge className="bg-green-600">SUCCESS</Badge>
                    //         <span className="text-sm text-muted-foreground">
                    //             Report Ready ({reportData.status})
                    //         </span>
                    //     </div>

                    //     <div className="p-4 bg-muted/50 border rounded-md font-mono text-[10px] break-all text-muted-foreground">
                    //         {reportData.media?.url ||
                    //             'The PDF is being generated in the background. Check back in a moment.'}
                    //     </div> */}

                        <div className="flex gap-3">
                            <Button
                                className="flex-1"
                                disabled={!reportData.media?.url}
                                onClick={() =>
                                    window.open(reportData.media?.url, '_blank')
                                }
                            >
                                View PDF
                            </Button>
                            <Button
                                onClick={() => {
                                    setReportData(null)
                                    setProgress(0)
                                    setCurrentStatus('IDLE')
                                }}
                                variant="outline"
                            >
                                New Report
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default GeneratedReports
