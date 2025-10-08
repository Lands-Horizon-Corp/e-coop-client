import { formatCurrency, formatDate } from '@/helpers/common-helper'
import { toReadableDateTime } from '@/helpers/date-utils'
import { ITransaction } from '@/modules/transaction'

import ImageDisplay from '@/components/image-display'
import { Separator } from '@/components/ui/separator'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { TransactionUserInfoGrid } from './transaction-user-info-grid'

interface TransactionDetailsCardProps {
    transaction: ITransaction
}
export const TransactionCardItem = ({
    transaction,
}: TransactionDetailsCardProps) => {
    const {
        reference_number,
        created_at,
        description,
        amount,
        member_profile,
        loan_balance,
        loan_due,
        fines_due,
        total_loan,
    } = transaction

    const userName = member_profile?.full_name || 'N/A'
    const passbook = member_profile?.passbook || 'Not Available'
    const userPhoneNumber = member_profile?.contact_number || 'Not Available'
    const memberSince = member_profile?.created_at
        ? formatDate(member_profile.created_at)
        : 'Not Available'

    return (
        <div className="p-6 rounded-xl font-sans max-h-fit w-full mx-auto">
            {/* Header Section */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-xl font-semibold ">
                        {reference_number}
                    </h2>
                    <p className="text-[11px] text-gray-400">
                        {toReadableDateTime(created_at)}
                    </p>
                </div>
            </div>
            <div className="flex flex-col gap-y-2 mb-4">
                {/* Transaction Information */}
                <div className="dark:bg-gray-800/30 bg-gray-100 p-4 rounded-xl ">
                    <h3 className="text-sm dark:text-gray-400 text-gray-600 font-bold mb-2">
                        Transaction Information
                    </h3>
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <p className="text-xs text-gray-400">
                                {description}
                            </p>
                        </div>
                        <p className="font-semibold dark:text-primary flex-shrink-0">
                            {formatCurrency(amount)}
                        </p>
                    </div>
                </div>

                {/* User Information */}
                <TransactionUserInfoGrid
                    data={[
                        { label: 'Name', value: userName },
                        { label: 'Passbook', value: passbook },
                        { label: 'Phone Number', value: userPhoneNumber },
                        { label: 'Member Since', value: memberSince },
                    ]}
                    title="Member Information"
                />
                <div className="w-full px-5 dark:hidden">
                    <Separator className=" w-full" />
                </div>
                {/* Account and Loan Information (adapted from Shipping) */}
                <TransactionUserInfoGrid
                    data={[
                        {
                            label: 'Total Loan',
                            value: formatCurrency(total_loan),
                        },
                        {
                            label: 'Loan Balance',
                            value: formatCurrency(loan_balance),
                        },
                        { label: 'Loan Due', value: formatCurrency(loan_due) },
                        {
                            label: 'Fines Due',
                            value: formatCurrency(fines_due),
                        },
                    ]}
                    title="Account and Loan Information"
                />
                <div>
                    <label className="text-sm font-semibold text-muted-foreground">
                        Signature
                    </label>
                    <PreviewMediaWrapper
                        media={transaction.signature_media || undefined}
                    >
                        <ImageDisplay
                            className="size-20 w-full rounded-xl"
                            src={transaction.signature_media?.download_url}
                        />
                    </PreviewMediaWrapper>
                </div>
                <div className="w-full px-5 dark:hidden">
                    <Separator className=" w-full" />
                </div>
                {/* Payment Information */}
                <div>
                    <label className="text-sm font-semibold text-muted-foreground">
                        Note/Description
                    </label>
                    <div className="min-h-40 bg-secondary/10 dark:bg-secondary/30 p-4 rounded-xl">
                        <p className="text-xs text-gray-500">
                            {transaction.description ||
                                'No description provided.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default TransactionCardItem
