import { useState } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

export type TPaperSize = 'A4' | 'Letter' | 'Legal'
export type TReportType = 'pdf' | 'excel'

export interface IReportFormatterProps {
    html: string
    fileName?: string
    reportType?: TReportType
    paperSize?: TPaperSize
    onExport?: (type: TReportType, format: string) => void
    showSignature?: boolean
    signatureLabel?: string
}

const PAPER_SIZES: Record<
    TPaperSize,
    { width: string; height: string; pixels: string }
> = {
    A4: { width: '210mm', height: '297mm', pixels: '794px' },
    Letter: { width: '8.5in', height: '11in', pixels: '816px' },
    Legal: { width: '8.5in', height: '14in', pixels: '1088px' },
}

export default function ReportFormatter({
    html,
    reportType: defaultReportType = 'pdf',
    paperSize: defaultPaperSize = 'A4',
    showSignature = true,
    signatureLabel = 'Authorized By',
}: IReportFormatterProps) {
    const [reportType, setReportType] = useState<TReportType>(defaultReportType)
    const [paperSize, setPaperSize] = useState<TPaperSize>(defaultPaperSize)
    const [signatureName, setSignatureName] = useState<string>('')
    const [reportTitle, setReportTitle] = useState<string>('Report')

    // const handleExportPDF = useCallback(async () => {
    //     try {
    //         // Dynamic import to avoid bundle bloat
    //         const html2pdf = (await import('html2pdf.js')).default

    //         const element = document.createElement('div')
    //         element.innerHTML = html

    //         const options = {
    //             margin: 10,
    //             filename: `${fileName}.pdf`,
    //             image: { type: 'jpeg', quality: 0.98 },
    //             html2canvas: { scale: 2 },
    //             jsPDF: {
    //                 orientation: paperSize === 'A4' ? 'portrait' : 'portrait',
    //                 unit: 'mm',
    //                 format: paperSize === 'Letter' ? 'letter' : paperSize === 'Legal' ? 'legal' : 'a4',
    //             },
    //         }

    //         html2pdf().set(options).from(element).save()
    //         toast.success('PDF exported successfully')
    //         onExport?.('pdf', 'pdf')
    //     } catch (err) {
    //         console.error('PDF export error:', err)
    //         toast.error('Failed to export PDF')
    //     }
    // }, [html, fileName, paperSize, onExport])

    // const handleExportExcel = useCallback(async () => {
    //     try {
    //         // Dynamic import for Excel generation
    //         const xlsx = await import('xlsx')

    //         // Parse table from HTML
    //         const parser = new DOMParser()
    //         const doc = parser.parseFromString(html, 'text/html')
    //         const table = doc.querySelector('table')

    //         if (!table) {
    //             toast.error('No table found in report')
    //             return
    //         }

    //         const workbook = xlsx.utils.table_to_book(table)
    //         xlsx.writeFile(workbook, `${fileName}.xlsx`)
    //         toast.success('Excel exported successfully')
    //         onExport?.('excel', 'xlsx')
    //     } catch (err) {
    //         console.error('Excel export error:', err)
    //         toast.error('Failed to export Excel')
    //     }
    // }, [html, fileName, onExport])

    return (
        <div className="space-y-4 p-4 border rounded-lg bg-card">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="report-type">Report Type</Label>
                    <Select
                        onValueChange={(v) => setReportType(v as TReportType)}
                        value={reportType}
                    >
                        <SelectTrigger id="report-type">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="excel">Excel</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="paper-size">Paper Size</Label>
                    <Select
                        onValueChange={(v) => setPaperSize(v as TPaperSize)}
                        value={paperSize}
                    >
                        <SelectTrigger
                            disabled={reportType === 'excel'}
                            id="paper-size"
                        >
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="A4">A4</SelectItem>
                            <SelectItem value="Letter">Letter</SelectItem>
                            <SelectItem value="Legal">Legal</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="report-title">Report Title</Label>
                    <Input
                        id="report-title"
                        onChange={(e) => setReportTitle(e.target.value)}
                        placeholder="Enter report title"
                        value={reportTitle}
                    />
                </div>
                {showSignature && (
                    <div>
                        <Label htmlFor="signature-name">Signature Name</Label>
                        <Input
                            id="signature-name"
                            onChange={(e) => setSignatureName(e.target.value)}
                            placeholder="Name of authorizer"
                            value={signatureName}
                        />
                    </div>
                )}
            </div>

            <div className="flex gap-2">
                {/* <Button
                    onClick={handleExportPDF}
                    variant="default"
                    disabled={reportType !== 'pdf'}
                >
                    Export as PDF
                </Button>
                <Button
                    onClick={handleExportExcel}
                    variant="default"
                    disabled={reportType !== 'excel'}
                >
                    Export as Excel
                </Button> */}
            </div>

            {/* Preview */}
            <div className="mt-6 border-t pt-4">
                <Label>Preview</Label>
                <div className="mt-2 flex justify-center overflow-auto bg-gray-100 p-4 rounded-lg max-h-[600px]">
                    <div
                        className="bg-white shadow-lg"
                        style={{
                            width:
                                reportType === 'pdf'
                                    ? PAPER_SIZES[paperSize].width
                                    : 'auto',
                            minHeight:
                                reportType === 'pdf'
                                    ? PAPER_SIZES[paperSize].height
                                    : 'auto',
                            padding: '40px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        }}
                    >
                        {/* Report Header */}
                        <div className="mb-8 text-center border-b pb-4">
                            <h1
                                style={{
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    margin: '0 0 8px 0',
                                }}
                            >
                                {reportTitle}
                            </h1>
                            <p
                                style={{
                                    fontSize: '12px',
                                    color: '#666',
                                    margin: 0,
                                }}
                            >
                                Generated on {new Date().toLocaleDateString()}
                            </p>
                        </div>

                        {/* Report Content */}
                        <div
                            className="mb-8"
                            dangerouslySetInnerHTML={{ __html: html }}
                        />

                        {/* Signature Area */}
                        {showSignature && (
                            <div className="mt-12 pt-4 border-t">
                                <div style={{ marginTop: '40px' }}>
                                    <div
                                        style={{
                                            borderTop: '1px solid #000',
                                            paddingTop: '8px',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <p
                                            style={{
                                                margin: 0,
                                                fontSize: '12px',
                                                minHeight: '60px',
                                            }}
                                        >
                                            {signatureName
                                                ? signatureName
                                                : '___________________'}
                                        </p>
                                        <p
                                            style={{
                                                margin: '4px 0 0 0',
                                                fontSize: '11px',
                                                color: '#666',
                                            }}
                                        >
                                            {signatureLabel}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Footer */}
                        <div
                            style={{
                                marginTop: '40px',
                                paddingTop: '12px',
                                borderTop: '1px solid #eee',
                                textAlign: 'center',
                            }}
                        >
                            <p
                                style={{
                                    fontSize: '10px',
                                    color: '#999',
                                    margin: 0,
                                }}
                            >
                                Page 1 | Paper Size: {paperSize}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
