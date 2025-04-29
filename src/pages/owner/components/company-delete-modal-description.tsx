const CompanyDeleteModalContent = () => {
    return (
        <div className="space-y-4 text-sm text-gray-200">
            <div className="space-y-4">
                <h3 className="font-medium text-white">
                    Operations/Transactions Will Be Disabled:
                </h3>
                <p>
                    Upon initiating the deletion request, all company-related
                    operations, transactions, and activities will be immediately
                    halted. This includes:
                </p>
                <ul className="list-disc space-y-1 pl-6">
                    <li>
                        Suspension of ongoing financial transactions such as
                        payments, invoices, or refunds.
                    </li>
                    <li>
                        Disabling all automated processes like recurring
                        billing, notifications, and scheduled tasks.
                    </li>
                    <li>
                        Termination of third-party integrations linked to the
                        company account.
                    </li>
                    <li>
                        Restricted access for users, employees, and
                        administrators to company-related data.
                    </li>
                </ul>
            </div>

            <h3 className="font-medium text-white">
                You Can Cancel Deletion Within 30 Days:
            </h3>
            <p>
                A <strong>30-day grace period</strong> is provided to allow
                users to reconsider their decision and cancel the deletion if
                necessary. During this period:
            </p>
            <ul className="list-disc space-y-1 pl-6">
                <li>
                    The company account will remain in a{' '}
                    <em>suspended state</em>, and no operations or transactions
                    can take place.
                </li>
                <li>
                    Data will remain intact but inaccessible for regular use.
                </li>
                <li>
                    Users can log in and reverse the deletion request via a
                    "Cancel Deletion" button, fully restoring the account and
                    its functionalities without any data loss.
                </li>
            </ul>

            <h3 className="font-medium text-white">
                All Data Will Be Deleted After 30 Days:
            </h3>
            <p>
                Once the 30-day grace period expires, all data associated with
                the company will be <strong>permanently deleted</strong>.
            </p>

            <p className="mt-4 text-sm text-foreground/80">
                If you wish to proceed, click delete.
            </p>
        </div>
    )
}

export default CompanyDeleteModalContent
