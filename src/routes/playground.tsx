import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/playground')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className="">
            {/* <HbsCompiler
                data={{ ...LoanTransactionSampleData, style: Style }}
                templatePath="/reports/bank/loan-release-voucher.hbs"
            /> */}
        </div>
    )
}
