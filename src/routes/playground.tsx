// import { useSubscribe } from '@/hooks/use-pubsub'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/playground')({
    component: RouteComponent,
})

function RouteComponent() {
    // const templates: Array<{
    //     title: string
    //     templatePath: string
    //     data?: unknown
    // }> = [
    //     {
    //         title: 'COOP PESOS Financial Performance',
    //         templatePath: '/reports/coop-pesos/coop-pesos-statement.hbs',
    //         data: sampleCoopPesos,
    //     },
    //     {
    //         title: 'Account History Statement',
    //         templatePath: '/reports/account-history/ah-statement.hbs',
    //         data: sampleAccountHistory,
    //     },
    //     {
    //         title: 'GL vs SL Comparison',
    //         templatePath: '/reports/gl-sl-comparison/glsl-statement.hbs',
    //         data: sampleGLSLComparison,
    //     },
    //     {
    //         title: 'Statement of Operations',
    //         templatePath: '/reports/statement-of-operations/so-statement.hbs',
    //         data: sampleStatementOperations,
    //     },
    //     {
    //         title: 'Balance Sheet Statement',
    //         templatePath: '/reports/balance-sheet/bs-statement.hbs',
    //         data: sampleBalanceSheet,
    //     },
    //     {
    //         title: 'FS Notes Schedule Statement',
    //         templatePath: '/reports/fs-notes-schedule/fsns-statement.hbs',
    //         data: sampleFSNotesSchedule,
    //     },
    //     {
    //         title: 'Cash/Check Disbursement Statement',
    //         templatePath: '/reports/cash-check-disbursement/ccd-statement.hbs',
    //         data: sampleCashCheckDisbursement,
    //     },
    //     {
    //         title: 'Loan Release Voucher',
    //         templatePath: '/reports/loan-release-voucher/lrv-statement.hbs',
    //         data: sampleLoanReleaseVoucher,
    //     },
    //     {
    //         title: 'Daily Collection Book Statement',
    //         templatePath: '/reports/daily-collection-book/dcb-statement.hbs',
    //         data: sampleDailyCollectionBook,
    //     },
    //     {
    //         title: 'Income Statement',
    //         templatePath: '/reports/income-statement/is-statement.hbs',
    //         data: sampleIncomeStatement,
    //     },
    //     {
    //         title: 'Journal Entry Statement',
    //         templatePath: '/reports/journal-entry/je-statement.hbs',
    //         data: sampleJournalEntry,
    //     },
    //     {
    //         title: 'Trial Balance Statement',
    //         templatePath: '/reports/trial-balance/tb-statement.hbs',
    //         data: sampleTrialBalance,
    //     },
    // ]

    // useSubscribe('live-mode', (data) => console.log('RECEIVED!',data))

    return (
        <div className="size-full h-fit flex flex-col items-center p-8 gap-12 bg-gray-100">
            <div className="w-full max-w-6xl flex flex-col gap-8">
                {/* {templates.map((tpl) => (
                    <div key={tpl.templatePath} className="w-full flex flex-col gap-4 bg-white shadow-sm rounded-lg p-4">
                        <div className="w-full flex justify-center">
                            <HbsCompiler templatePath={tpl.templatePath} data={tpl.data} />
                        </div>
                    </div>
                ))} */}
            </div>
        </div>
    )
}
