import { useState } from 'react'

import API from '@/providers/api'

// Assuming you have a UI progress bar
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

// Assuming you have a UI badge

// Types for the stream chunks
interface IStreamChunk {
    type: 'state' | 'progress' | 'completed' | 'error'
    value?: any
    message?: string
    url?: string
}

function GeneratedReports() {
    const [loading, setLoading] = useState(false)
    const [currentStatus, setCurrentStatus] = useState<string>('IDLE')
    const [progress, setProgress] = useState(0)
    const [reportData, setReportData] = useState<any>(null)

    const handleGenerateReport = async () => {
        setLoading(true)
        setProgress(0)
        setCurrentStatus('STARTING')

        const requestPayload = {
            name: 'Member_Contribution_Report',
            landscape: false,
            paper_size: 'A4',
            template: `<html>
<head>
    <style>
        /* CSS Variables for easy branding */
        :root {
            --primary: #1e40af;
            --secondary: #64748b;
            --accent: #0ea5e9;
            --border: #e2e8f0;
            --row-even: #f8fafc;
        }

        @page {
            margin: 20mm;
            /* Page numbers are handled via Gotenberg footer usually, 
               but we can style the content for high-density here */
        }

        body {
            font-family: 'Inter', 'Helvetica', 'Arial', sans-serif;
            font-size: 11px;
            color: #1e293b;
            line-height: 1.5;
            margin: 0;
            padding: 0;
        }

        /* --- Header Section --- */
        .brand-container {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 3px solid var(--primary);
            padding-bottom: 15px;
            margin-bottom: 30px;
        }

        .brand-logo {
            flex: 1;
        }

        .brand-logo h1 {
            color: var(--primary);
            font-size: 24px;
            margin: 0;
            letter-spacing: -0.5px;
        }

        .report-meta {
            text-align: right;
            flex: 1;
        }

        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            background: #dcfce7;
            color: #166534;
            border-radius: 99px;
            font-weight: bold;
            font-size: 10px;
            text-transform: uppercase;
        }

        /* --- Stats Grid --- */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin-bottom: 30px;
        }

        .stat-card {
            background: var(--row-even);
            padding: 12px;
            border: 1px solid var(--border);
            border-radius: 8px;
        }

        .stat-label {
            font-size: 9px;
            color: var(--secondary);
            text-transform: uppercase;
            display: block;
        }

        .stat-value {
            font-size: 16px;
            font-weight: bold;
            color: var(--primary);
        }

        /* --- Table Styling --- */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        thead {
            display: table-header-group; /* Crucial for multi-page header repeating */
        }

        th {
            background-color: var(--primary);
            color: white;
            text-align: left;
            padding: 10px 8px;
            font-weight: 600;
            font-size: 10px;
            text-transform: uppercase;
        }

        td {
            padding: 10px 8px;
            border-bottom: 1px solid var(--border);
        }

        tr:nth-child(even) {
            background-color: var(--row-even);
        }

        /* Accounting Styles */
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .font-bold { font-weight: bold; }
        
        .currency {
            font-family: 'Courier New', Courier, monospace;
            font-weight: 600;
        }

        /* Footer / Terms */
        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid var(--border);
            font-size: 9px;
            color: var(--secondary);
        }

        /* Prevent table rows from breaking across pages awkwardly */
        tr { page-break-inside: avoid; }

    </style>
</head>
<body>

    <div class="brand-container">
        <div class="brand-logo">
            <h1>{{title}}</h1>
            <div style="margin-top: 5px; color: var(--secondary);">
                {{company_name}}<br>
                TIN: <span class="font-bold">{{company_tin}}</span>
            </div>
        </div>
        <div class="report-meta">
            <div class="status-badge">Official Record</div>
            <p style="margin-top: 10px;">
                Issued on: <strong>{{generated_at}}</strong><br>
                Ref: <strong>#{{report_id}}</strong>
            </p>
        </div>
    </div>

    <div class="stats-grid">
        <div class="stat-card">
            <span class="stat-label">Total Contributions</span>
            <span class="stat-value">PHP {{total_amount}}</span>
        </div>
        <div class="stat-card">
            <span class="stat-label">Member Count</span>
            <span class="stat-value">{{member_count}}</span>
        </div>
        <div class="stat-card">
            <span class="stat-label">Fiscal Year</span>
            <span class="stat-value">{{fiscal_year}}</span>
        </div>
        <div class="stat-card">
            <span class="stat-label">Security Level</span>
            <span class="stat-value" style="color: #e11d48;">High</span>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th width="5%">#</th>
                <th width="40%">Member Name</th>
                <th width="15%" class="text-center">Status</th>
                <th width="20%">Join Date</th>
                <th width="20%" class="text-right">Contribution</th>
            </tr>
        </thead>
        <tbody>
            {{#each members}}
            <tr>
                <td>{{@index}}</td>
                <td>
                    <div class="font-bold">{{this.name}}</div>
                    <div style="font-size: 8px; color: var(--secondary);">ID: {{this.uid}}</div>
                </td>
                <td class="text-center">
                    <span style="color: {{#if this.active}}#166534{{else}}#991b1b{{/if}};">
                        ● {{this.status}}
                    </span>
                </td>
                <td>{{this.joined_at}}</td>
                <td class="text-right currency">PHP {{this.contribution}}</td>
            </tr>
            {{/each}}
        </tbody>
        <tfoot>
            <tr style="background-color: #eee;">
                <td colspan="4" class="text-right font-bold" style="padding: 12px;">GRAND TOTAL</td>
                <td class="text-right font-bold currency" style="font-size: 14px; border-bottom: 3px double #000;">
                    PHP {{total_amount}}
                </td>
            </tr>
        </tfoot>
    </table>

    <div class="footer">
        <p><strong>Confidentiality Notice:</strong> This document contains sensitive financial information. Unauthorized distribution is strictly prohibited. Printed from Horizon E-Coop Server system.</p>
        <p>Digital Signature Verification: <code>{{signature_hash}}</code></p>
    </div>

</body>
</html>`,
        }

        try {
            await API.stream(
                '/api/v1/generated-report',
                requestPayload,
                (data: { type: string; value: any }) => {
                    console.log(data)
                    switch (data.type) {
                        case 'state':
                            setCurrentStatus(data.value)
                            break
                        case 'progress':
                            setProgress(data.value.percentage)
                            break
                        case 'completed':
                            setCurrentStatus('COMPLETED')
                            setReportData({ url: data.value })
                            setLoading(false)
                            break
                        case 'error':
                            console.error('Report Error:', data.value)
                            alert('Error: ' + data.value)
                            setLoading(false)
                            break
                    }
                }
            )
        } catch (error) {
            console.error('Stream failed', error)
            setLoading(false)
        }
    }
    return (
        <div className="p-8 space-y-6">
            <div className="border p-6 rounded-lg bg-card">
                <h2 className="text-2xl font-bold mb-4">Report Generator</h2>

                {!reportData ? (
                    <div className="space-y-4">
                        <p className="text-muted-foreground">
                            Click below to start the real-time PDF generation
                            and S3 upload.
                        </p>

                        {loading && (
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Badge variant="outline">
                                        {currentStatus}
                                    </Badge>
                                    <span className="text-sm font-medium">
                                        {Math.round(progress)}%
                                    </span>
                                </div>
                                <Progress value={progress} className="w-full" />
                            </div>
                        )}

                        <Button
                            onClick={handleGenerateReport}
                            disabled={loading}
                            className="w-full"
                        >
                            {loading
                                ? 'Generating...'
                                : 'Generate Profile List (PDF)'}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in">
                        <Badge className="bg-green-500">SUCCESS</Badge>
                        <p>Your report is ready and stored in S3.</p>
                        <div className="p-4 bg-muted rounded font-mono text-xs break-all">
                            {reportData.url}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="default"
                                onClick={() =>
                                    window.open(reportData.url, '_blank')
                                }
                            >
                                View PDF
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setReportData(null)}
                            >
                                Create Another
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default GeneratedReports
