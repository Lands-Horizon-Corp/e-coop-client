import { useState } from 'react'

import API from '@/providers/api'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface ReportRequest {
    name: string
    landscape: boolean
    paper_size: string
    template: string
}

// Define the shape of our progress updates from the backend
interface ProgressData {
    phase?: string
    percentage?: number
    // any other fields from horizon.ProgressInfo
}

// Define the shape of our final return value
interface ReportResponse {
    url: string
}

function GeneratedReports() {
    const [loading, setLoading] = useState(false)
    const [currentStatus, setCurrentStatus] = useState('IDLE')
    const [progress, setProgress] = useState(0)
    const [reportData, setReportData] = useState<ReportResponse | null>(null)

    const handleGenerateReport = async () => {
        setLoading(true)
        setCurrentStatus('STARTING')
        setProgress(0)
        setReportData(null)

        const requestPayload: ReportRequest = {
            name: 'Member_Contribution_Report',
            landscape: false,
            paper_size: 'A4',
            template: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { 
                    font-family: 'Helvetica', 'Arial', sans-serif; 
                    margin: 0; 
                    padding: 20px; 
                    color: #333; 
                }
                .header { 
                    text-align: center; 
                    margin-bottom: 30px; 
                    border-bottom: 2px solid #444;
                    padding-bottom: 10px;
                }
                .company-info { font-size: 12px; color: #666; }
                
                table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    margin-top: 20px;
                    font-size: 11px;
                }
                th { 
                    background-color: #f2f2f2; 
                    color: #444; 
                    text-align: left; 
                    padding: 10px; 
                    border-bottom: 1px solid #ddd;
                }
                td { 
                    padding: 8px 10px; 
                    border-bottom: 1px solid #eee; 
                }
                tr:nth-child(even) { background-color: #fafafa; }
                
                .status { 
                    font-weight: bold; 
                    text-transform: uppercase; 
                    font-size: 9px;
                }
                .status-active { color: #27ae60; }
                .status-inactive { color: #e74c3c; }
                .status-pending { color: #f39c12; }
                
                .amount { text-align: right; font-family: 'Courier', monospace; }

                /* Page Numbering for PDF engines */
                @page {
                    margin: 1cm;
                }
                .footer {
                    position: fixed;
                    bottom: 0;
                    width: 100%;
                    text-align: center;
                    font-size: 10px;
                    color: #999;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Member Contribution Report</h1>
                <div class="company-info">
                    TIN: {{company_tin}} | Generated: {{generated_at}}
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Member Name</th>
                        <th>Status</th>
                        <th class="amount">Contribution</th>
                    </tr>
                </thead>
                <tbody>
                    {{#each members}}
                    <tr>
                        <td>{{@index}}</td>
                        <td>{{this.name}}</td>
                        <td><span class="status status-{{lower this.status}}">{{this.status}}</span></td>
                        <td class="amount">{{formatCurrency this.contribution}}</td>
                    </tr>
                    {{/each}}
                </tbody>
            </table>

            <div class="footer">
                Page <span class="pageNumber"></span> of <span class="totalPages"></span>
            </div>
        </body>
        </html>
    `,
        }

        try {
            await API.streamer<ReportRequest, ProgressData, ReportResponse>(
                '/api/v1/generated-report',
                requestPayload,
                {
                    onStarted: () => {
                        setCurrentStatus('CONNECTED')
                    },
                    onProcess: (data) => {
                        if (data.phase) {
                            setCurrentStatus(data.phase)
                        }
                        if (typeof data.percentage === 'number') {
                            const safeValue = Math.min(
                                100,
                                Math.max(0, data.percentage)
                            )
                            setProgress(safeValue)
                        }
                    },
                    onEnd: (result) => {
                        if (result?.url) {
                            setReportData({ url: result.url })
                        }
                        setCurrentStatus('COMPLETED')
                        setProgress(100)
                        setLoading(false)
                    },
                }
            )
        } catch (err: any) {
            console.error('Stream failure:', err)
            setCurrentStatus('FAILED')
            setLoading(false)
            alert(err.message || 'Failed to generate report')
        }
    }

    return (
        <div className="p-8 space-y-6">
            <div className="border p-6 rounded-lg bg-card max-w-2xl mx-auto shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-primary">
                    Report Generator
                </h2>

                {!reportData ? (
                    <div className="space-y-4">
                        <p className="text-muted-foreground">
                            Generate real-time PDF reports with sensitive member
                            data.
                        </p>

                        {loading && (
                            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                <div className="flex justify-between items-center">
                                    <Badge
                                        variant="secondary"
                                        className="uppercase tracking-wider"
                                    >
                                        {currentStatus.replace(/_/g, ' ')}
                                    </Badge>
                                    <span className="text-sm font-mono font-bold text-primary">
                                        {Math.round(progress)}%
                                    </span>
                                </div>
                                <Progress
                                    value={progress}
                                    className="w-full h-2"
                                />
                            </div>
                        )}

                        <Button
                            onClick={handleGenerateReport}
                            disabled={loading}
                            className="w-full h-11"
                        >
                            {loading
                                ? 'Generating Report...'
                                : 'Generate Profile List (PDF)'}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-2">
                            <Badge className="bg-green-600">SUCCESS</Badge>
                            <span className="text-sm text-muted-foreground">
                                Report Ready
                            </span>
                        </div>
                        <div className="p-4 bg-muted/50 border rounded-md font-mono text-[10px] break-all text-muted-foreground">
                            {reportData.url}
                        </div>
                        <div className="flex gap-3">
                            <Button
                                className="flex-1"
                                onClick={() =>
                                    window.open(reportData.url, '_blank')
                                }
                            >
                                View PDF Document
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setReportData(null)
                                    setProgress(0)
                                    setCurrentStatus('IDLE')
                                }}
                            >
                                Reset
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default GeneratedReports
