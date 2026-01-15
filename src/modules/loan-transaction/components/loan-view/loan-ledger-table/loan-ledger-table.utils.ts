import { IAccount } from '@/modules/account'
import { IGeneralLedger } from '@/modules/general-ledger'
import { TLoanLedgerNormalized } from '@/modules/loan-transaction/loan-transaction.types'
import crypto from 'crypto'

import { TEntityId } from '@/types'

const generateSecureId = (length: number): string => {
    const byteLength = Math.ceil((length * 5) / 8) // base-36 ~ 5 bits per char
    let randomBytes: Uint8Array

    if (
        typeof window !== 'undefined' &&
        window.crypto &&
        window.crypto.getRandomValues
    ) {
        randomBytes = new Uint8Array(byteLength)
        window.crypto.getRandomValues(randomBytes)
    } else {
        // Node.js / non-browser fallback
        randomBytes = crypto.randomBytes(byteLength)
    }

    return Array.from(randomBytes)
        .map((b) => b.toString(36).padStart(2, '0'))
        .join('')
        .substring(0, length)
}

export const getLedgerUniqueAccounts = ({
    ledgerEntries = [],
}: {
    ledgerEntries: IGeneralLedger[]
}) => {
    const uniqueAccounts: Record<
        TEntityId,
        IAccount & { account_history_id: TEntityId }
    > = {}

    for (const record of ledgerEntries) {
        if (
            !uniqueAccounts[record.account_id] &&
            (record.account_id !== undefined || record.account_id !== null)
        ) {
            uniqueAccounts[record.account_id] = {
                ...record.account,
                account_history_id: record.account_history_id,
            }
        }
    }

    return {
        uniqueAccountsArray: Object.values(uniqueAccounts),
        uniqueAccountsMap: uniqueAccounts,
    }
}

// TEST DATA
// const ledgerEntries = [
//     // Initial loan disbursement
//     {
//         id: 'gl-001',
//         entry_date: '2025-01-15T09:00:00',
//         account_id: 'loan-principal-001',
//         account: {
//             id: 'loan-principal-001',
//             name: 'Loan Receivable - Principal',
//         },
//         debit: 50000,
//         credit: 0,
//         balance: 50000,
//         SPEC: true,
//     },
//     // Loan interest charge
//     {
//         id: 'gl-002',
//         entry_date: '2025-02-15T08:30:00',
//         account_id: 'loan-interest-001',
//         account: {
//             id: 'loan-interest-001',
//             name: 'Loan Receivable - Interest',
//         },
//         debit: 2500,
//         credit: 0,
//         balance: 2500,
//         SPEC: true,
//     },
//     // Payment applied to interest (full payment)
//     {
//         id: 'gl-003',
//         entry_date: '2025-02-15T14:00:00',
//         account_id: 'loan-interest-001',
//         account: {
//             id: 'loan-interest-001',
//             name: 'Loan Receivable - Interest',
//         },
//         debit: 0,
//         credit: 2500,
//         balance: 0,
//         SPEC: true,
//     },
//     // Payment applied to loan principal (1st payment)
//     {
//         id: 'gl-004',
//         entry_date: '2025-02-20T14:25:00',
//         account_id: 'loan-principal-001',
//         account: {
//             id: 'loan-principal-001',
//             name: 'Loan Receivable - Principal',
//         },
//         debit: 0,
//         credit: 3000,
//         balance: 47000,
//         SPEC: true,
//     },
//     // Payment applied to loan principal (2nd payment same day)
//     {
//         id: 'gl-004-b',
//         entry_date: '2025-02-20T16:15:00',
//         account_id: 'loan-principal-001',
//         account: {
//             id: 'loan-principal-001',
//             name: 'Loan Receivable - Principal',
//         },
//         debit: 0,
//         credit: 2000,
//         balance: 45000,
//         SPEC: true,
//     },
//     // Next month interest charge
//     {
//         id: 'gl-005',
//         entry_date: '2025-03-15T08:30:00',
//         account_id: 'loan-interest-001',
//         account: {
//             id: 'loan-interest-001',
//             name: 'Loan Receivable - Interest',
//         },
//         debit: 2250,
//         credit: 0,
//         balance: 2250,
//         SPEC: true,
//     },
//     // Payment applied to interest (1st payment - partial)
//     {
//         id: 'gl-006',
//         entry_date: '2025-03-25T15:50:00',
//         account_id: 'loan-interest-001',
//         account: {
//             id: 'loan-interest-001',
//             name: 'Loan Receivable - Interest',
//         },
//         debit: 0,
//         credit: 1000,
//         balance: 1250,
//         SPEC: true,
//     },
//     // Payment applied to interest (2nd payment same day - full payment)
//     {
//         id: 'gl-007',
//         entry_date: '2025-03-25T17:35:00',
//         account_id: 'loan-interest-001',
//         account: {
//             id: 'loan-interest-001',
//             name: 'Loan Receivable - Interest',
//         },
//         debit: 0,
//         credit: 1250,
//         balance: 0,
//         SPEC: true,
//     },
//     // April interest charge
//     {
//         id: 'gl-008',
//         entry_date: '2025-04-15T08:30:00',
//         account_id: 'loan-interest-001',
//         account: {
//             id: 'loan-interest-001',
//             name: 'Loan Receivable - Interest',
//         },
//         debit: 3000,
//         credit: 0,
//         balance: 3000,
//         SPEC: true,
//     },
//     // Multiple payments on April 20 - Interest payment 1 of 2
//     {
//         id: 'gl-009',
//         entry_date: '2025-04-20T10:30:00',
//         account_id: 'loan-interest-001',
//         account: {
//             id: 'loan-interest-001',
//             name: 'Loan Receivable - Interest',
//         },
//         debit: 0,
//         credit: 1500,
//         balance: 1500,
//         SPEC: true,
//     },
//     // Interest payment 2 of 2 (same day)
//     {
//         id: 'gl-010',
//         entry_date: '2025-04-20T16:30:00',
//         account_id: 'loan-interest-001',
//         account: {
//             id: 'loan-interest-001',
//             name: 'Loan Receivable - Interest',
//         },
//         debit: 0,
//         credit: 1500,
//         balance: 0,
//         SPEC: true,
//     },
//     // Principal payment 1 of 2 (same day)
//     {
//         id: 'gl-011',
//         entry_date: '2025-04-20T17:00:00',
//         account_id: 'loan-principal-001',
//         account: {
//             id: 'loan-principal-001',
//             name: 'Loan Receivable - Principal',
//         },
//         debit: 0,
//         credit: 3000,
//         balance: 42000,
//         SPEC: true,
//     },
//     // Principal payment 2 of 2 (same day)
//     {
//         id: 'gl-012',
//         entry_date: '2025-04-20T17:30:00',
//         account_id: 'loan-principal-001',
//         account: {
//             id: 'loan-principal-001',
//             name: 'Loan Receivable - Principal',
//         },
//         debit: 0,
//         credit: 2000,
//         balance: 40000,
//         SPEC: true,
//     },
// ]

// Normalize ledger entries for loan ledger table
export const loanNormalizeLedgerEntries = ({
    ledgerEntries,
}: {
    ledgerEntries: IGeneralLedger[]
}) => {
    // 1st step - unique by date
    const records: Record<string, IGeneralLedger[]> = {}
    for (const record of ledgerEntries) {
        const parsedDate = new Date(record.entry_date).toDateString()

        if (!records[parsedDate]) {
            records[parsedDate] = [record]
        } else {
            records[parsedDate].push(record)
        }
    }

    // step 2 - convert to array and sort by date
    const ledgerByDate: Array<{
        uniqueKey: string
        ledger: IGeneralLedger[]
    }> = []

    for (const [uniqueKey, ledger] of Object.entries(records)) {
        ledgerByDate.push({
            uniqueKey,
            ledger: ledger.sort(
                (a, b) =>
                    new Date(b.entry_date).getTime() -
                    new Date(a.entry_date).getTime()
            ),
        })
    }

    ledgerByDate.sort(
        (a, b) =>
            new Date(a.uniqueKey).getTime() - new Date(b.uniqueKey).getTime()
    )

    // step 3 - unique accounts
    const { uniqueAccountsMap: uniqueAccounts, uniqueAccountsArray } =
        getLedgerUniqueAccounts({
            ledgerEntries,
        })

    // step 4 - ledger by date
    const result: TLoanLedgerNormalized[] = []
    for (const entry of ledgerByDate) {
        const generalLedgerPaymentPerAccount: Record<
            TEntityId,
            IGeneralLedger[]
        > = {}

        entry.ledger.forEach((ldgr) => {
            if (generalLedgerPaymentPerAccount[ldgr.account_id]) {
                generalLedgerPaymentPerAccount[ldgr.account_id].push(ldgr)
            } else {
                generalLedgerPaymentPerAccount[ldgr.account_id] = [ldgr]
            }
        })

        const maxPayment = Object.values(generalLedgerPaymentPerAccount)
            .map((payments) => payments.length)
            .reduce((a, b) => Math.max(a, b), 0)

        Object.keys(generalLedgerPaymentPerAccount).forEach((accountId) => {
            if (generalLedgerPaymentPerAccount[accountId].length < maxPayment) {
                const missingPaymentsCount =
                    maxPayment -
                    generalLedgerPaymentPerAccount[accountId].length

                for (let i = 0; i < missingPaymentsCount; i++) {
                    generalLedgerPaymentPerAccount[accountId].push({
                        id: `ghost-${Math.random().toString(36).substring(2, 15)}`,
                        account_id: accountId,
                        account: uniqueAccounts[accountId],
                        account_history_id:
                            uniqueAccounts[accountId].account_history_id,
                        debit: 0,
                        credit: 0,
                        balance: 0,
                    } as unknown as IGeneralLedger)
                }
            }
        })

        const missingAccounts = Object.values(uniqueAccounts).filter(
            (acc) =>
                !Object.keys(generalLedgerPaymentPerAccount)
                    .map((act) => act)
                    .includes(acc.id)
        )

        for (const missingAcc of missingAccounts) {
            generalLedgerPaymentPerAccount[missingAcc.id] = []
            for (let i = 0; i < maxPayment; i++) {
                generalLedgerPaymentPerAccount[missingAcc.id].push({
                    id: `ghost-${generateSecureId(13)}`,
                    entry_date: new Date(
                        entry.uniqueKey.split('-')[0]
                    ).toISOString(),
                    account_id: missingAcc.id,
                    account: missingAcc,
                    account_history_id:
                        uniqueAccounts[missingAcc.id].account_history_id,
                    debit: 0,
                    credit: 0,
                    balance: 0,
                } as unknown as IGeneralLedger)
            }
        }

        for (const entry of Object.keys(generalLedgerPaymentPerAccount)) {
            generalLedgerPaymentPerAccount[entry].sort((a) => {
                return a.balance === 0 ? 1 : -1
            })
        }

        const generalLedgerPayments: IGeneralLedger[] = []
        const headers: IGeneralLedger[][] = []

        for (const entryValues of Object.keys(generalLedgerPaymentPerAccount)) {
            const head: IGeneralLedger[] = []

            generalLedgerPaymentPerAccount[entryValues].forEach((genLeg) => {
                head.push({
                    [`${entryValues}_ledger`]: genLeg.entry_date
                        ? genLeg
                        : { balance: 0, debit: 0, credit: 0 },
                } as unknown as IGeneralLedger)
            })

            headers.push(head)
        }

        for (let i = 0; i < maxPayment; i++) {
            let ledger: IGeneralLedger = {} as unknown as IGeneralLedger
            for (const header of headers) {
                ledger = { ...ledger, ...header[i] }
            }
            generalLedgerPayments.push(ledger)
            result.push({
                ...ledger,
                uid: generateSecureId(13), // just for uniqueness
                entry_date: entry.uniqueKey.split('-')[0],
            })
        }
    }

    for (let i = 0; i < result.length - 1; i++) {
        for (const account of uniqueAccountsArray) {
            if (
                result[i + 1][`${account.id}_ledger`]?.debit == 0 &&
                result[i + 1][`${account.id}_ledger`]?.credit == 0
            ) {
                result[i + 1][`${account.id}_ledger`] = {
                    credit: 0,
                    debit: 0,
                    balance: result[i][`${account.id}_ledger`]?.balance || 0,
                } as IGeneralLedger
            }
        }
    }
    return result
}
